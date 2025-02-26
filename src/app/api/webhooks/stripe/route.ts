import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY as string, {
  apiVersion: '2023-10-16',
});

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature') as string;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

  let event;

  try {
    const body = await req.text(); // Stripe sends raw text
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: any) {
    console.error('⚠️ Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const metadata = session.metadata as { playerData: string };

    if (metadata && metadata.playerData) {
      const playerData = JSON.parse(metadata.playerData);
      console.log('✅ Payment successful. Received player data:', playerData);

      // TODO: Save playerData to the database here
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
