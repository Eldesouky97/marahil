import { collection, DocumentData, doc, getDoc, getDocs, onSnapshot, query, where } from "firebase/firestore";
import { db } from "./client";
import type { Certificate } from "@/types/certificate";

const certificatesRef = collection(db, "certificates");

function mapCertificate(id: string, data: DocumentData): Certificate {
  return {
    id,
    serial: data.serial,
    verifyCode: data.verifyCode,
    uid: data.uid,
    studentName: data.studentName,
    courseId: data.courseId,
    courseTitle: data.courseTitle,
    teacherName: data.teacherName,
    issuedAt: data.issuedAt?.toMillis?.() ?? Date.now(),
  };
}

export async function getCertificate(certificateId: string): Promise<Certificate | null> {
  const snap = await getDoc(doc(db, "certificates", certificateId));
  return snap.exists() ? mapCertificate(snap.id, snap.data()) : null;
}

export async function findCertificateByCode(code: string): Promise<Certificate | null> {
  const snap = await getDocs(query(certificatesRef, where("verifyCode", "==", code.toUpperCase())));
  if (snap.empty) return null;
  const d = snap.docs[0];
  return mapCertificate(d.id, d.data());
}

export async function listStudentCertificates(uid: string): Promise<Certificate[]> {
  const snap = await getDocs(query(certificatesRef, where("uid", "==", uid)));
  return snap.docs.map((d) => mapCertificate(d.id, d.data()));
}

/**
 * Certificates are only ever created server-side (see backend/functions), once
 * an enrollment's progress reaches 100%. This watches for that document to
 * appear so the UI can react as soon as issuance completes.
 */
export function watchCertificateForCourse(
  uid: string,
  courseId: string,
  onIssued: (certificate: Certificate) => void
): () => void {
  const q = query(certificatesRef, where("uid", "==", uid), where("courseId", "==", courseId));
  return onSnapshot(q, (snap) => {
    if (!snap.empty) onIssued(mapCertificate(snap.docs[0].id, snap.docs[0].data()));
  });
}
