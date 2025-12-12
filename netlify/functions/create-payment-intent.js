// Netlify Function: /.netlify/functions/create-payment-intent
const Stripe = require('stripe');

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }
  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecret) return { statusCode: 503, body: JSON.stringify({ error: 'Stripe not configured' }) };
  const stripe = new Stripe(stripeSecret);

  try {
    const { amount, currency = 'usd' } = JSON.parse(event.body || '{}');
    if (!amount || amount <= 0) return { statusCode: 400, body: JSON.stringify({ error: 'Invalid amount' }) };
    const pi = await stripe.paymentIntents.create({ amount, currency, automatic_payment_methods: { enabled: true } });
    return { statusCode: 200, body: JSON.stringify({ clientSecret: pi.client_secret, id: pi.id }) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed to create payment intent' }) };
  }
};
