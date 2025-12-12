import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../store/cart';
import { useAuth } from '../lib/auth';
import { createPaymentIntent } from '../services/stripe';
import { createOrder } from '../services/orders';
import { getUserProfile, setShippingDefaults } from '../services/users';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import StripeCheckoutForm from '../components/StripeCheckoutForm';

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, totalItems, totalPrice, clear } = useCart();
  const [shipping, setShipping] = useState({ street: '', city: '', state: '', zip: '', country: 'US' });
  const [savedShipping, setSavedShipping] = useState<typeof shipping | null>(null);
  const [useSaved, setUseSaved] = useState(false);
  const [saveAsDefault, setSaveAsDefault] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);

  const itemsList = Object.values(items);
  const total = totalPrice();

  // Prefill from profile shippingDefaults when available
  useEffect(() => {
    let active = true;
    (async () => {
      if (!user) return;
      try {
        const profile = await getUserProfile(user.uid);
        if (active && profile?.shippingDefaults) {
          const s = { ...shipping, ...profile.shippingDefaults };
          setSavedShipping(s);
          setUseSaved(true);
          setShipping(s);
        }
      } catch {
        // ignore prefill errors
      }
    })();
    return () => { active = false; };
  }, [user]);

  const stripePromise = useMemo(() => {
    const pk = import.meta.env.VITE_STRIPE_PUBLIC_KEY as string | undefined;
    return pk ? loadStripe(pk) : null;
  }, []);

  async function continueToPayment() {
    setError(null);
    if (!user) return navigate('/auth', { replace: true });
    if (itemsList.length === 0) {
      setError('Your cart is empty.');
      return;
    }
    if (!stripePromise) {
      setError('Stripe is not configured. Missing VITE_STRIPE_PUBLIC_KEY');
      return;
    }
    setLoading(true);
    try {
      const pi = await createPaymentIntent({ amount: Math.round(total * 100) });
      setClientSecret(pi.clientSecret);
      setPaymentId(pi.id);
    } catch (e: any) {
      setError(e?.message || 'Failed to initialize payment');
    } finally {
      setLoading(false);
    }
  }

  async function onPaymentSuccess(piId: string) {
    if (!user) return;
    const orderId = await createOrder(user.uid, {
      userId: user.uid,
      status: 'Pending',
      totalAmount: total,
      shippingAddress: shipping,
      items: itemsList.map(i => ({
        productId: i.productId,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        imageUrl: i.imageUrl
      })),
      paymentId: piId,
      orderDate: new Date().toISOString()
    } as any);
    clear();
    // Save shipping defaults back to profile for next time, only if requested
    if (saveAsDefault) {
      try {
        await setShippingDefaults(user.uid, shipping);
      } catch {
        // ignore persistence errors here
      }
    }
    navigate(`/order-success/${orderId}`);
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <h1 className="text-3xl font-bold">Checkout</h1>
        <div className="bg-white border rounded-lg p-6 mt-6 space-y-4">
          <h2 className="text-xl font-semibold">Shipping Information</h2>
          {savedShipping && (
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={useSaved}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setUseSaved(checked);
                  if (checked && savedShipping) setShipping(savedShipping);
                }}
              />
              Use saved address
            </label>
          )}
          <div className="grid sm:grid-cols-2 gap-4 mt-2">
            <div>
              <label className="block text-sm text-gray-600">Street</label>
              <input className="w-full border rounded px-3 py-2" value={shipping.street} onChange={e => { setUseSaved(false); setShipping({ ...shipping, street: e.target.value }); }} />
            </div>
            <div>
              <label className="block text-sm text-gray-600">City</label>
              <input className="w-full border rounded px-3 py-2" value={shipping.city} onChange={e => { setUseSaved(false); setShipping({ ...shipping, city: e.target.value }); }} />
            </div>
            <div>
              <label className="block text-sm text-gray-600">State</label>
              <input className="w-full border rounded px-3 py-2" value={shipping.state} onChange={e => { setUseSaved(false); setShipping({ ...shipping, state: e.target.value }); }} />
            </div>
            <div>
              <label className="block text-sm text-gray-600">ZIP</label>
              <input className="w-full border rounded px-3 py-2" value={shipping.zip} onChange={e => { setUseSaved(false); setShipping({ ...shipping, zip: e.target.value }); }} />
            </div>
            <div>
              <label className="block text-sm text-gray-600">Country</label>
              <input className="w-full border rounded px-3 py-2" value={shipping.country} onChange={e => { setUseSaved(false); setShipping({ ...shipping, country: e.target.value }); }} />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm mt-2">
            <input type="checkbox" checked={saveAsDefault} onChange={e => setSaveAsDefault(e.target.checked)} />
            Save as my default address
          </label>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          {!clientSecret ? (
            <button className="btn-accent" onClick={continueToPayment} disabled={loading}>{loading ? 'Preparing...' : 'Continue to Payment'}</button>
          ) : (
            stripePromise && (
              <Elements options={{ clientSecret }} stripe={stripePromise}>
                <div className="pt-4 border-t">
                  <h3 className="font-semibold mb-2">Payment</h3>
                  <StripeCheckoutForm clientSecret={clientSecret} onSuccess={onPaymentSuccess} />
                  <p className="text-xs text-gray-500 mt-2">Use Stripe test cards (e.g., 4242 4242 4242 4242, any future expiry, any CVC).</p>
                </div>
              </Elements>
            )
          )}
        </div>
      </div>
      <aside className="bg-white border rounded-lg p-6 h-fit">
        <h2 className="text-xl font-semibold">Order Summary</h2>
        <div className="mt-4 space-y-2">
          {itemsList.map(i => (
            <div key={i.productId} className="flex justify-between text-sm">
              <span>{i.name} × {i.quantity}</span>
              <span>${(i.price * i.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between font-semibold text-lg mt-4">
          <span>Total ({totalItems()} items)</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </aside>
    </section>
  );
}
