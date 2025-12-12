import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { firestore, firebaseConfigured } from '../lib/firebase';
import type { ShippingAddress, UserProfile } from '../types';

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  if (!firebaseConfigured || !firestore) return null;
  const ref = doc(firestore, 'users', userId);
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as UserProfile) : null;
}

export async function setShippingDefaults(userId: string, address: ShippingAddress): Promise<void> {
  if (!firebaseConfigured || !firestore) return;
  const ref = doc(firestore, 'users', userId);
  await setDoc(
    ref,
    {
      userId,
      shippingDefaults: address,
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp()
    },
    { merge: true }
  );
}
