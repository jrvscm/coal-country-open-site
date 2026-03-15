import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getProductAvailabilitySnapshot } from '@/lib/registration-product-availability';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function GET() {
  return NextResponse.json({ success: true });
}

export async function POST(req: Request) {
  try {
    const { totalPrice, uid, breakdown, items } = await req.json();

    if (!uid) {
      return NextResponse.json({ error: 'UID is required' }, { status: 400 });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'At least one checkout item is required' }, { status: 400 });
    }

    const parsedItems = items
      .filter((item) => item && typeof item === 'object')
      .map((item) => ({
        id: String(item.id ?? ''),
        name: String(item.name ?? ''),
        amount: Number(item.amount ?? 0),
        quantity: Math.max(1, Number(item.quantity ?? 1)),
        category: String(item.category ?? ''),
      }));

    const invalidItem = parsedItems.find((item) => !item.id || !item.name || !Number.isFinite(item.amount) || item.amount < 0 || !Number.isFinite(item.quantity) || item.quantity < 1);
    if (invalidItem) {
      return NextResponse.json({ error: 'Invalid checkout item payload' }, { status: 400 });
    }

    const computedTotal = parsedItems.reduce((sum, item) => sum + (item.amount * item.quantity), 0);

    if (!Number.isFinite(computedTotal) || computedTotal <= 0) {
      return NextResponse.json({ error: 'Checkout total must be greater than 0' }, { status: 400 });
    }

    const suppliedTotal = Number.parseFloat(totalPrice);
    if (Number.isNaN(suppliedTotal) || Math.round(suppliedTotal * 100) !== Math.round(computedTotal * 100)) {
      return NextResponse.json({ error: 'Checkout total does not match items' }, { status: 400 });
    }

    const requestedProductQuantities = parsedItems.reduce((acc, item) => {
      if (item.category === 'product') {
        acc[item.id] = (acc[item.id] ?? 0) + item.quantity;
      }
      return acc;
    }, {} as Record<string, number>);

    if (Object.keys(requestedProductQuantities).length > 0) {
      const availability = await getProductAvailabilitySnapshot();
      const soldOutProducts = Object.entries(requestedProductQuantities)
        .filter(([productId, quantity]) => {
          const productAvailability = availability[productId];
          if (!productAvailability) return false;
          return productAvailability.remaining < quantity;
        })
        .map(([productId]) => productId);

      if (soldOutProducts.length > 0) {
        return NextResponse.json(
          {
            error: 'One or more selected sponsorship products are sold out',
            soldOutProductIds: soldOutProducts,
          },
          { status: 409 }
        );
      }
    }

    const compactBreakdown = JSON.stringify({
      basePrice: breakdown?.basePrice,
      dinnerTickets: breakdown?.dinnerTickets,
      flagPrize: breakdown?.flagPrize,
      selectedProducts: Array.isArray(breakdown?.selectedProducts) ? breakdown.selectedProducts : [],
    });

    // Stripe metadata value limit is 500 chars; keep payload safely under limit.
    const metadataBreakdown = compactBreakdown.length <= 500
      ? compactBreakdown
      : JSON.stringify({ compact: true, selectedProducts: [] });

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/registration/player?confirmed=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/registration/player?canceled=${uid}`,
      line_items: parsedItems.map((item) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.amount * 100),
        },
        quantity: item.quantity,
      })),
      metadata: {
        uid, // Unique ID for matching the payment in Google Sheets
        totalPrice,
        breakdown: metadataBreakdown,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe Checkout Error:', error);
    return NextResponse.json({ error: 'Stripe checkout failed' }, { status: 500 });
  }
}
