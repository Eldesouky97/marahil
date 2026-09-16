function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value) && value.constructor === Object;
}

/**
 * Firestore's `setDoc`/`addDoc`/`updateDoc` throw on an explicit `undefined`
 * field at ANY nesting depth, not just the top level — a lesson's `slides`
 * array holding a slide object with e.g. `imageUrl: undefined` fails the
 * whole write just as surely as an undefined top-level field would.
 * Recurses into plain objects and arrays; leaves class instances (Date,
 * Firestore Timestamp, etc.) untouched since none of this codebase's
 * withoutUndefined() callers ever hand it a Firestore sentinel directly
 * (serverTimestamp()/deleteField() are always spread in *after* this runs).
 */
export function withoutUndefined<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => withoutUndefined(item)) as T;
  }
  if (isPlainObject(value)) {
    const result: Record<string, unknown> = {};
    for (const [key, v] of Object.entries(value)) {
      if (v !== undefined) result[key] = withoutUndefined(v);
    }
    return result as T;
  }
  return value;
}
