import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: Request) {
  try {
    const { totalPrice, uid, breakdown } = await req.json(); // Receive UID from the frontend

    if (!uid) {
      return NextResponse.json({ error: 'UID is required' }, { status: 400 });
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/registration/player?confirmed=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/registration/player?canceled=${uid}`,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Coal Country Open Registration',
            },
            unit_amount: Math.round(parseFloat(totalPrice) * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      metadata: {
        uid, // Unique ID for matching the payment in Google Sheets
        totalPrice,
        breakdown: JSON.stringify(breakdown), // Store breakdown as a JSON string
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe Checkout Error:', error);
    return NextResponse.json({ error: 'Stripe checkout failed' }, { status: 500 });
  }
}
