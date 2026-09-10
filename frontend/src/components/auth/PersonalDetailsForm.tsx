"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useStages } from "@/lib/hooks/useStages";
import { useGovernorates } from "@/lib/hooks/useGovernorates";
import { parseEgyptianNationalId } from "@/lib/utils/nationalId";
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
  const governorates = useGovernorates();

  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [governorate, setGovernorate] = useState("");
  const [stage, setStage] = useState<StageId>("primary");
  const [school, setSchool] = useState("");
  const [subject, setSubject] = useState("");
  const [workplace, setWorkplace] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [nationalId, setNationalId] = useState("");

  const parsedNationalId = role === "teacher" ? parseEgyptianNationalId(nationalId) : null;
  const nationalIdError = role === "teacher" && nationalId.length === 14 && !parsedNationalId;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (role === "teacher" && !parsedNationalId) return;
    onSubmit({
      phone: phone || undefined,
      age: role === "teacher" ? parsedNationalId?.age : age ? Number(age) : undefined,
      governorate: governorate || undefined,
      ...(role === "student" ? { stage, school: school || undefined } : {}),
      ...(role === "teacher"
        ? { subject: subject || undefined, workplace: workplace || undefined, jobTitle: jobTitle || undefined, nationalId }
        : {}),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField label={t("phone")}>
        <input dir="ltr" className={inputClasses} value={phone} onChange={(e) => setPhone(e.target.value)} />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        {role === "teacher" ? (
          <FormField label={t("age")}>
            <input
              disabled
              dir="ltr"
              className={`${inputClasses} disabled:opacity-70`}
              value={parsedNationalId ? String(parsedNationalId.age) : ""}
              placeholder={t("ageFromNationalId")}
            />
          </FormField>
        ) : (
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
        )}
        <FormField label={t("governorate")}>
          <select className={inputClasses} value={governorate} onChange={(e) => setGovernorate(e.target.value)}>
            <option value="" disabled>
              {t("governoratePlaceholder")}
            </option>
            {governorates.map((g) => (
              <option key={g.id} value={g.id}>
                {g.label}
              </option>
            ))}
          </select>
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
          <FormField label={t("nationalId")}>
            <input
              required
              inputMode="numeric"
              dir="ltr"
              maxLength={14}
              className={inputClasses}
              value={nationalId}
              onChange={(e) => setNationalId(e.target.value.replace(/\D/g, "").slice(0, 14))}
            />
            {nationalIdError && <p className="mt-1 text-xs text-danger-ink">{t("nationalIdInvalid")}</p>}
          </FormField>
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
        <Button type="submit" disabled={submitting || (role === "teacher" && !parsedNationalId)} className="flex-1">
          {submitting ? t("submitting") : t("submit")}
        </Button>
      </div>
    </form>
  );
}
