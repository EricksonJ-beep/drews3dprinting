export type PaymentIntentInput = {
  amount: number; // cents
  currency?: string; // 'usd'
};

export async function createPaymentIntent(input: PaymentIntentInput) {
  const res = await fetch('/api/create-payment-intent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to create payment intent');
  }
  return res.json() as Promise<{ clientSecret: string; id: string }>;
}
