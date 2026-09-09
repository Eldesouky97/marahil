import { isSupported, getAnalytics } from "firebase/analytics";
import { firebaseApp } from "./client";

export async function initAnalytics() {
  if (typeof window === "undefined") return null;
  if (!(await isSupported())) return null;
  return getAnalytics(firebaseApp);
}
