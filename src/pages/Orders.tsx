import { useEffect, useState } from 'react';
import { useAuth } from '../lib/auth';
import { getOrdersForUser } from '../services/orders';

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    getOrdersForUser(user.uid).then(setOrders);
  }, [user]);

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold">Your Orders</h1>
      {orders.length === 0 ? (
        <p className="mt-4 text-gray-600">No orders yet.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="bg-white border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">Order #{o.id}</div>
                  <div className="text-sm text-gray-600">Status: {o.status}</div>
                </div>
                <div className="font-semibold">${(o.totalAmount ?? 0).toFixed(2)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
