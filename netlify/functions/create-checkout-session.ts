import { Handler } from '@netlify/functions';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2022-11-15' });

const handler: Handler = async (event) => {
  const { name, email, extraDinnerTickets, derbyEntry } = JSON.parse(event.body || '{}');

  const basePrice = 10000; // $100 in cents
  const dinnerPrice = (extraDinnerTickets || 0) * 4000;
  const derbyPrice = derbyEntry ? 1000 : 0;
  const totalAmount = basePrice + dinnerPrice + derbyPrice;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: 'Golf Tournament Entry' },
          unit_amount: totalAmount,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.URL}/success`,
      cancel_url: `${process.env.URL}/cancel`,
      metadata: { name, email, extraDinnerTickets, derbyEntry },
    });

    return { statusCode: 200, body: JSON.stringify({ url: session.url }) };
  } catch (err: any) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};

export { handler };
