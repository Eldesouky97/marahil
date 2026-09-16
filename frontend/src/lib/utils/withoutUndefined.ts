/** Firestore's `setDoc`/`addDoc`/`updateDoc` throw on an explicit `undefined` field — drop those instead of sending them. */
export function withoutUndefined<T extends object>(obj: T): Partial<T> {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined)) as Partial<T>;
}
