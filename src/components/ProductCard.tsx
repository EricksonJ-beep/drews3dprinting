import { Link } from 'react-router-dom';
import type { Product } from '../types';

type Props = { product: Product };

export default function ProductCard({ product }: Props) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col">
      <img src={product.imageUrl || '/images/placeholder.svg'} alt={product.name} className="h-48 w-full object-cover" />
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
        <p className="text-sm text-gray-600 line-clamp-2 mt-1">{product.description}</p>
        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="text-brand-blue font-bold">${product.price.toFixed(2)}</span>
          <div className="flex gap-2">
            <Link to={`/product/${product.slug}`} className="btn-secondary">Quick View</Link>
            <Link to={`/product/${product.slug}`} className="btn-primary">Add to Cart</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
