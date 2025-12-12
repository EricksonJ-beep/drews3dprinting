import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductBySlug } from '../services/products';
import type { Product } from '../types';
import { useCart } from '../store/cart';

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const add = useCart(s => s.add);

  useEffect(() => {
    if (slug) getProductBySlug(slug).then(setProduct);
  }, [slug]);

  if (!product) return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <p>Loading...</p>
    </section>
  );

  return (
    <section className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-8">
      <img src={product.imageUrl || '/images/placeholder.svg'} alt={product.name} className="w-full rounded-lg border" />
      <div>
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-gray-600 mt-2">{product.description}</p>
        <div className="mt-4 text-2xl font-bold text-brand-blue">${product.price.toFixed(2)}</div>
        <div className="mt-6 flex gap-3">
          <button
            className="btn-primary"
            onClick={() => add({ productId: product.slug, name: product.name, price: product.price, imageUrl: product.imageUrl }, 1)}
          >
            Add to Cart
          </button>
          <span className="text-sm text-gray-600">Stock: {product.stock}</span>
        </div>
      </div>
    </section>
  );
}
