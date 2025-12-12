import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../services/products';
import type { Product } from '../types';

export default function ProductList() {
  const { category } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [sort, setSort] = useState<'price-asc' | 'price-desc'>('price-asc');

  useEffect(() => {
    getProducts(category && decodeURIComponent(category)).then(list => {
      setProducts(list);
    });
  }, [category]);

  const sorted = [...products].sort((a, b) => {
    if (sort === 'price-asc') return a.price - b.price;
    return b.price - a.price;
  });

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{category ? decodeURIComponent(category) : 'All Products'}</h1>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Sort</label>
          <select value={sort} onChange={e => setSort(e.target.value as any)} className="border rounded px-2 py-1">
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
        {sorted.map(p => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </section>
  );
}
