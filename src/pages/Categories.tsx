import { Link } from 'react-router-dom';

const categories = [
  'Toys/Fidgets',
  'Office Supplies',
  'Hobbies',
  'Birthday Ideas',
  'Holidays',
];

export default function Categories() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold">Shop by Category</h1>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
        {categories.map(c => (
          <Link key={c} to={`/category/${encodeURIComponent(c)}`} className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow">
            <h3 className="text-lg font-semibold text-brand-blue">{c}</h3>
            <p className="text-sm text-gray-600 mt-1">Explore {c} products</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
