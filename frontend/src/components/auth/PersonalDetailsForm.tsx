"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useStages } from "@/lib/hooks/useStages";
import { Button } from "@/components/ui/Button";
import { FormField, inputClasses } from "@/components/ui/FormField";
import type { PersonalDetails, UserRole } from "@/types/user";
import type { StageId } from "@/types/stage";

export function PersonalDetailsForm({
  role,
  onSubmit,
  submitting,
  onBack,
}: {
  role: UserRole;
  onSubmit: (details: PersonalDetails) => void;
  submitting: boolean;
  onBack: () => void;
}) {
  const t = useTranslations("auth.personalDetails");
  const stages = useStages();

  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [governorate, setGovernorate] = useState("");
  const [stage, setStage] = useState<StageId>("primary");
  const [school, setSchool] = useState("");
  const [subject, setSubject] = useState("");
  const [workplace, setWorkplace] = useState("");
  const [jobTitle, setJobTitle] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({
      phone: phone || undefined,
      age: age ? Number(age) : undefined,
      governorate: governorate || undefined,
      ...(role === "student" ? { stage, school: school || undefined } : {}),
      ...(role === "teacher"
        ? { subject: subject || undefined, workplace: workplace || undefined, jobTitle: jobTitle || undefined }
        : {}),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField label={t("phone")}>
        <input dir="ltr" className={inputClasses} value={phone} onChange={(e) => setPhone(e.target.value)} />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label={t("age")}>
          <input
            type="number"
            min={3}
            max={120}
            dir="ltr"
            className={inputClasses}
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </FormField>
        <FormField label={t("governorate")}>
          <input className={inputClasses} value={governorate} onChange={(e) => setGovernorate(e.target.value)} />
        </FormField>
      </div>

      {role === "student" && (
        <>
          <FormField label={t("stage")}>
            <select className={inputClasses} value={stage} onChange={(e) => setStage(e.target.value as StageId)}>
              {stages.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label={t("school")}>
            <input className={inputClasses} value={school} onChange={(e) => setSchool(e.target.value)} />
          </FormField>
        </>
      )}

      {role === "teacher" && (
        <>
          <FormField label={t("subject")}>
            <input className={inputClasses} value={subject} onChange={(e) => setSubject(e.target.value)} />
          </FormField>
          <FormField label={t("workplace")}>
            <input className={inputClasses} value={workplace} onChange={(e) => setWorkplace(e.target.value)} />
          </FormField>
          <FormField label={t("jobTitle")}>
            <input className={inputClasses} value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
          </FormField>
        </>
      )}

      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={onBack} className="flex-1">
          {t("back")}
        </Button>
        <Button type="submit" disabled={submitting} className="flex-1">
          {submitting ? t("submitting") : t("submit")}
        </Button>
      </div>
    </form>
  );
}
