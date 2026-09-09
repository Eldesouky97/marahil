import { addDoc, collection, DocumentData, getDocs, orderBy, query, serverTimestamp } from "firebase/firestore";
import { db } from "./client";
import type { AuditLogEntry } from "@/types/auditLog";

const auditLogRef = collection(db, "adminAuditLog");

function mapEntry(id: string, data: DocumentData): AuditLogEntry {
  return {
    id,
    adminUid: data.adminUid,
    adminName: data.adminName,
    action: data.action,
    targetType: data.targetType,
    targetId: data.targetId,
    details: data.details,
    createdAt: data.createdAt?.toMillis?.() ?? Date.now(),
  };
}

/** Admin-only. Called right after an admin mutation succeeds, from the component that made it. */
export async function logAdminAction(
  admin: { uid: string; name: string },
  action: string,
  targetType: string,
  targetId: string,
  details?: string
): Promise<void> {
  await addDoc(auditLogRef, {
    adminUid: admin.uid,
    adminName: admin.name,
    action,
    targetType,
    targetId,
    details: details ?? null,
    createdAt: serverTimestamp(),
  });
}

export async function listAuditLog(): Promise<AuditLogEntry[]> {
  const snap = await getDocs(query(auditLogRef, orderBy("createdAt", "desc")));
  return snap.docs.map((d) => mapEntry(d.id, d.data()));
}
