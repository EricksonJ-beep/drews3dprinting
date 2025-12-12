// Vercel Serverless Function: /api/create-payment-intent
const Stripe = require('stripe');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecret) return res.status(503).json({ error: 'Stripe not configured' });
  const stripe = new Stripe(stripeSecret);

  try {
    const { amount, currency = 'usd' } = req.body || {};
    if (!amount || amount <= 0) return res.status(400).json({ error: 'Invalid amount' });
    const pi = await stripe.paymentIntents.create({ amount, currency, automatic_payment_methods: { enabled: true } });
    return res.status(200).json({ clientSecret: pi.client_secret, id: pi.id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to create payment intent' });
  }
};
