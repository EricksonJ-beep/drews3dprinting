import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import { useEffect, useState } from 'react';
import { getFeaturedProducts } from '../services/products';
import type { Product } from '../types';

export default function Home() {
  const [featured, setFeatured] = useState<Product[]>([]);

  useEffect(() => {
    getFeaturedProducts().then(setFeatured);
  }, []);

  return (
    <div>
      <Hero />
      <section className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold">Featured Products</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {featured.map(p => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
