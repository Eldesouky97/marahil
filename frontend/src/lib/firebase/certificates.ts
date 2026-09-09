import { collection, deleteDoc, doc, DocumentData, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { db } from "./client";
import type { Certificate } from "@/types/certificate";
import { generateSerial, generateVerifyCode } from "@/lib/utils/certificateSerial";

const certificatesRef = collection(db, "certificates");

function certificateId(uid: string, courseId: string) {
  return `${uid}_${courseId}`;
}

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

/**
 * Creates the certificate document for a completed course (id is the same
 * "{uid}_{courseId}" scheme as enrollments). Firestore rules (backend/firestore.rules)
 * only allow this when the matching enrollment is actually at 100% progress
 * and the denormalized name/title fields match the real course/user docs —
 * see that file for why this is safe to do straight from the client on the
 * free Firebase plan (no Cloud Functions available).
 */
export async function issueCertificate(input: {
  uid: string;
  studentName: string;
  courseId: string;
  courseTitle: string;
  teacherName: string;
}): Promise<Certificate> {
  const ref = doc(db, "certificates", certificateId(input.uid, input.courseId));
  const existing = await getDoc(ref);
  if (existing.exists()) return mapCertificate(existing.id, existing.data());

  const serial = generateSerial();
  const verifyCode = generateVerifyCode();
  await setDoc(ref, { ...input, serial, verifyCode, issuedAt: serverTimestamp() });
  await setDoc(doc(db, "enrollments", certificateId(input.uid, input.courseId)), { certificateIssued: true }, { merge: true });

  return { id: ref.id, serial, verifyCode, issuedAt: Date.now(), ...input };
}

export async function getCertificate(certId: string): Promise<Certificate | null> {
  const snap = await getDoc(doc(db, "certificates", certId));
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

/** Admin-only overview stat — certificates are publicly readable, so no rules change needed. */
export async function listAllCertificates(): Promise<Certificate[]> {
  const snap = await getDocs(certificatesRef);
  return snap.docs.map((d) => mapCertificate(d.id, d.data()));
}

/** Admin-only — fixes a typo in the denormalized display fields. */
export async function updateCertificate(
  certId: string,
  patch: Partial<Pick<Certificate, "studentName" | "courseTitle" | "teacherName">>
): Promise<void> {
  await updateDoc(doc(db, "certificates", certId), patch);
}

/** Admin-only — revokes a certificate (e.g. issued in error or fraudulently). */
export async function deleteCertificate(certId: string): Promise<void> {
  await deleteDoc(doc(db, "certificates", certId));
}
