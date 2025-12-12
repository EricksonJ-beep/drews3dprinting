import { Link, useParams } from 'react-router-dom';

export default function OrderSuccess() {
  const { id } = useParams();
  return (
    <section className="max-w-2xl mx-auto px-4 py-10 text-center">
      <h1 className="text-3xl font-bold text-brand-blue">Thank you!</h1>
      <p className="mt-2 text-gray-700">Your order has been placed.</p>
      <div className="mt-4 text-sm text-gray-600">Order ID: <span className="font-mono">{id}</span></div>
      <div className="mt-6 flex justify-center gap-3">
        <Link to="/orders" className="btn-secondary">View Orders</Link>
        <Link to="/" className="btn-primary">Continue Shopping</Link>
      </div>
    </section>
  );
}
