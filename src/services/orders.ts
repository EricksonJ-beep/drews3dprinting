import { collection, addDoc, serverTimestamp, orderBy, query, getDocs } from 'firebase/firestore';
import { firestore, firebaseConfigured } from '../lib/firebase';
import type { Order } from '../types';

export async function createOrder(userId: string, order: Omit<Order, 'orderDate'>) {
  if (!firebaseConfigured || !firestore) throw new Error('Firebase not configured');
  const col = collection(firestore, 'users', userId, 'orders');
  const docRef = await addDoc(col, { ...order, userId, orderDate: serverTimestamp(), createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  return docRef.id;
}

export async function getOrdersForUser(userId: string) {
  if (!firebaseConfigured || !firestore) return [];
  const col = collection(firestore, 'users', userId, 'orders');
  const q = query(col, orderBy('orderDate', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
