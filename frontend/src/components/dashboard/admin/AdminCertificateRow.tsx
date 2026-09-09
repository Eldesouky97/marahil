"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/context/AuthProvider";
import { updateCertificate, deleteCertificate } from "@/lib/firebase/certificates";
import { logAdminAction } from "@/lib/firebase/auditLog";
import { Button } from "@/components/ui/Button";
import { inputClasses } from "@/components/ui/FormField";
import type { Certificate } from "@/types/certificate";

export function AdminCertificateRow({ certificate, onChanged }: { certificate: Certificate; onChanged: () => void }) {
  const { profile } = useAuth();
  const t = useTranslations("dashboardAdmin.certificates");

  const [editing, setEditing] = useState(false);
  const [confirmingRevoke, setConfirmingRevoke] = useState(false);
  const [studentName, setStudentName] = useState(certificate.studentName);
  const [courseTitle, setCourseTitle] = useState(certificate.courseTitle);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    await updateCertificate(certificate.id, { studentName, courseTitle });
    if (profile) await logAdminAction(profile, "certificateUpdate", "certificate", certificate.id, studentName);
    setSaving(false);
    setEditing(false);
    onChanged();
  }

  async function handleRevoke() {
    setSaving(true);
    await deleteCertificate(certificate.id);
    if (profile) await logAdminAction(profile, "certificateDelete", "certificate", certificate.id, certificate.studentName);
    onChanged();
  }

  if (editing) {
    return (
      <div className="space-y-3 rounded-xl border border-border bg-surface-2 p-4">
        <input className={inputClasses} value={studentName} onChange={(e) => setStudentName(e.target.value)} />
        <input className={inputClasses} value={courseTitle} onChange={(e) => setCourseTitle(e.target.value)} />
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setEditing(false)} className="px-4 py-2 text-sm">
            {t("cancel")}
          </Button>
          <Button onClick={handleSave} disabled={saving} className="px-4 py-2 text-sm">
            {saving ? t("saving") : t("save")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="font-medium">{certificate.studentName}</div>
        <div className="mt-1 text-xs text-dim">
          {t("course")}: {certificate.courseTitle} — <span dir="ltr">{certificate.serial}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 self-start sm:self-auto">
        {confirmingRevoke ? (
          <>
            <span className="text-xs text-dim">{t("revokeConfirm")}</span>
            <Button variant="outline" onClick={() => setConfirmingRevoke(false)} className="px-3 py-1.5 text-xs">
              {t("cancel")}
            </Button>
            <Button onClick={handleRevoke} disabled={saving} className="px-3 py-1.5 text-xs">
              {t("revoke")}
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline" onClick={() => setEditing(true)} className="px-4 py-1.5 text-xs">
              {t("edit")}
            </Button>
            <Button variant="outline" onClick={() => setConfirmingRevoke(true)} className="px-4 py-1.5 text-xs">
              {t("revoke")}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
