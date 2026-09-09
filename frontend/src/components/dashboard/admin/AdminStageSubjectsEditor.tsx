"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import { useAuth } from "@/context/AuthProvider";
import { setStageSubjects } from "@/lib/firebase/stages";
import { logAdminAction } from "@/lib/firebase/auditLog";
import { Button } from "@/components/ui/Button";
import { inputClasses } from "@/components/ui/FormField";
import type { Stage } from "@/types/stage";

export function AdminStageSubjectsEditor({ stage }: { stage: Stage }) {
  const { profile } = useAuth();
  const t = useTranslations("dashboardAdmin.stages");

  const [subjects, setSubjects] = useState(stage.subjects);
  const [newSubject, setNewSubject] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function addSubject() {
    const value = newSubject.trim();
    if (!value || subjects.includes(value)) return;
    setSubjects([...subjects, value]);
    setNewSubject("");
    setSaved(false);
  }

  function removeSubject(subject: string) {
    setSubjects(subjects.filter((s) => s !== subject));
    setSaved(false);
  }

  async function handleSave() {
    if (!profile) return;
    setSaving(true);
    await setStageSubjects(stage.id, subjects);
    await logAdminAction(profile, "stageSubjectsUpdate", "stage", stage.id, subjects.join(", "));
    setSaving(false);
    setSaved(true);
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <h3 className="mb-3 font-medium">{stage.label}</h3>

      <div className="mb-3 flex flex-wrap gap-2">
        {subjects.map((subject) => (
          <span
            key={subject}
            className="flex items-center gap-1.5 rounded-full border border-border-strong bg-surface-2 px-3 py-1 text-xs"
          >
            {subject}
            <button type="button" onClick={() => removeSubject(subject)} aria-label={t("removeSubject")}>
              <X size={12} className="cursor-pointer text-dim hover:text-danger" />
            </button>
          </span>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          className={inputClasses}
          value={newSubject}
          onChange={(e) => setNewSubject(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addSubject();
            }
          }}
          placeholder={t("addSubject")}
        />
        <Button type="button" variant="outline" onClick={addSubject} className="px-4 py-2 text-sm">
          {t("addSubject")}
        </Button>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <Button type="button" onClick={handleSave} disabled={saving} className="px-5 py-2 text-sm">
          {saving ? t("saving") : t("save")}
        </Button>
        {saved && <span className="text-xs text-success">{t("saved")}</span>}
      </div>
    </div>
  );
}
