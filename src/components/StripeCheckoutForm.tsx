import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useState } from 'react';

type Props = {
  clientSecret: string;
  onSuccess: (paymentIntentId: string) => Promise<void> | void;
};

export default function StripeCheckoutForm({ clientSecret, onSuccess }: Props) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (!stripe || !elements) return;
    setSubmitting(true);
    setError(null);
    const result = await stripe.confirmPayment({ elements, redirect: 'if_required' });
    if ((result as any).error) {
      const err = (result as any).error;
      setError(err?.message || 'Payment failed');
      setSubmitting(false);
      return;
    }
    const pi = (result as any).paymentIntent;
    if (pi && (pi.status === 'succeeded' || pi.status === 'requires_capture' || pi.status === 'processing')) {
      await onSuccess(pi.id);
    } else {
      setError('Payment not completed. Status: ' + (pi?.status || 'unknown'));
    }
    setSubmitting(false);
  }

  return (
    <div className="space-y-4">
      <PaymentElement />
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <button className="btn-accent" disabled={!stripe || !clientSecret || submitting} onClick={handleSubmit}>
        {submitting ? 'Confirming...' : 'Confirm Payment'}
      </button>
    </div>
  );
}
