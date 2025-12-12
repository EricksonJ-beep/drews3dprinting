import { useCart } from '../store/cart';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const { items, setQty, remove, clear, totalItems, totalPrice } = useCart();
  const navigate = useNavigate();
  const list = Object.values(items);

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold">Your Cart</h1>
      {list.length === 0 ? (
        <p className="mt-4 text-gray-600">Your cart is empty.</p>
      ) : (
        <div className="mt-6 grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            {list.map(item => (
              <div key={item.productId} className="bg-white border rounded-lg p-4 flex gap-4 items-center">
                <img src={item.imageUrl || '/images/placeholder.svg'} alt={item.name} className="w-20 h-20 object-cover rounded" />
                <div className="flex-1">
                  <div className="font-semibold">{item.name}</div>
                  <div className="text-sm text-gray-600">${item.price.toFixed(2)}</div>
                </div>
                <input
                  type="number"
                  min={0}
                  className="w-20 border rounded px-2 py-1"
                  value={item.quantity}
                  onChange={e => setQty(item.productId, parseInt(e.target.value || '0'))}
                />
                <button className="text-red-600 hover:underline" onClick={() => remove(item.productId)}>Remove</button>
              </div>
            ))}
            <button className="text-gray-600 hover:underline" onClick={() => clear()}>Clear cart</button>
          </div>
          <aside className="bg-white border rounded-lg p-4 h-fit">
            <div className="flex justify-between"><span>Items</span><span>{totalItems()}</span></div>
            <div className="flex justify-between font-semibold text-lg mt-2"><span>Total</span><span>${totalPrice().toFixed(2)}</span></div>
            <button className="btn-accent w-full mt-4" onClick={() => navigate('/checkout')}>Checkout</button>
          </aside>
        </div>
      )}
    </section>
  );
}
