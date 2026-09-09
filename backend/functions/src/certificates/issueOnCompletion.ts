import { onDocumentWritten } from "firebase-functions/v2/firestore";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import "../lib/admin";
import { generateSerial, generateVerifyCode } from "../lib/certificateSerial";

/**
 * Certificates must be issued server-side: a client could otherwise write a
 * certificate document directly and forge one. This trigger is the only
 * place a certificate is ever created (see backend/firestore.rules, which
 * denies all client writes to `certificates`).
 */
export const issueCertificateOnCompletion = onDocumentWritten(
  "enrollments/{enrollmentId}",
  async (event) => {
    const after = event.data?.after;
    const enrollment = after?.data();
    if (!after || !enrollment) return;

    if (enrollment.progress < 100 || enrollment.certificateIssued) return;

    const db = getFirestore();
    const { uid, courseId } = enrollment;

    const existing = await db
      .collection("certificates")
      .where("uid", "==", uid)
      .where("courseId", "==", courseId)
      .limit(1)
      .get();

    if (existing.empty) {
      const [userSnap, courseSnap] = await Promise.all([
        db.collection("users").doc(uid).get(),
        db.collection("courses").doc(courseId).get(),
      ]);
      if (!userSnap.exists || !courseSnap.exists) return;

      const course = courseSnap.data()!;
      await db.collection("certificates").add({
        uid,
        studentName: userSnap.data()?.name ?? "طالب",
        courseId,
        courseTitle: course.title,
        teacherName: course.teacherName,
        serial: generateSerial(),
        verifyCode: generateVerifyCode(),
        issuedAt: FieldValue.serverTimestamp(),
      });
    }

    await after.ref.set({ certificateIssued: true }, { merge: true });
  }
);
