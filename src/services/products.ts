import type { Product } from '../types';
import sample from '../data/sampleProducts.json';
import { firestore, firebaseConfigured } from '../lib/firebase';
import { collection, doc, getDoc, getDocs, limit, orderBy, query, where } from 'firebase/firestore';

const useSample = () => !firebaseConfigured || !firestore;

export async function getProducts(category?: string): Promise<Product[]> {
  if (useSample()) {
    const list = sample as Product[];
    return category ? list.filter(p => p.category === category) : list;
  }
  const col = collection(firestore!, 'products');
  const q = category
    ? query(col, where('category', '==', category), orderBy('price', 'asc'))
    : query(col, orderBy('price', 'asc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data() as Product);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  if (useSample()) {
    const list = sample as Product[];
    return list.filter(p => p.isFeatured).slice(0, 8);
  }
  const col = collection(firestore!, 'products');
  const q = query(col, where('isFeatured', '==', true), orderBy('updatedAt', 'desc'), limit(8));
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data() as Product);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (useSample()) {
    const list = sample as Product[];
    return list.find(p => p.slug === slug) ?? null;
  }
  const ref = doc(firestore!, 'products', slug);
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as Product) : null;
}
