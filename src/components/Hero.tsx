import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-brand-blue to-brand-green text-white">
      <div className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">Creative, Durable 3D Prints for Every Occasion</h1>
          <p className="mt-4 text-lg text-white/90">Toys, office helpers, hobby parts, gifts, and seasonal designs — printed with quality materials and care.</p>
          <div className="mt-6 flex gap-3">
            <Link to="/categories" className="btn-primary">Shop Categories</Link>
            <Link to="/custom-order" className="btn-secondary">Request Custom Print</Link>
          </div>
        </div>
        <div className="flex justify-center">
          <img src="/images/placeholder.svg" alt="3D prints" className="w-full max-w-md drop-shadow-xl" />
        </div>
      </div>
    </section>
  );
}
