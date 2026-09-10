"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { updateUserProfileFields } from "@/lib/firebase/users";
import { useStages } from "@/lib/hooks/useStages";
import { useGovernorates } from "@/lib/hooks/useGovernorates";
import { parseEgyptianNationalId } from "@/lib/utils/nationalId";
import { Button } from "@/components/ui/Button";
import { FormField, inputClasses } from "@/components/ui/FormField";
import type { AppUser } from "@/types/user";
import type { StageId } from "@/types/stage";

export function ProfileEditForm({ profile, onSaved }: { profile: AppUser; onSaved: () => Promise<void> | void }) {
  const t = useTranslations("profile");
  const tDetails = useTranslations("auth.personalDetails");
  const stages = useStages();
  const governorates = useGovernorates();
  const hasNationalId = profile.role === "teacher" || profile.role === "admin";

  const [name, setName] = useState(profile.name);
  const [phone, setPhone] = useState(profile.phone ?? "");
  const [age, setAge] = useState(profile.age != null ? String(profile.age) : "");
  const [governorate, setGovernorate] = useState(profile.governorate ?? "");
  const [stage, setStage] = useState<StageId>(profile.stage ?? "primary");
  const [school, setSchool] = useState(profile.school ?? "");
  const [subject, setSubject] = useState(profile.subject ?? "");
  const [workplace, setWorkplace] = useState(profile.workplace ?? "");
  const [jobTitle, setJobTitle] = useState(profile.jobTitle ?? "");
  const [nationalId, setNationalId] = useState(profile.nationalId ?? "");

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const parsedNationalId = hasNationalId ? parseEgyptianNationalId(nationalId) : null;
  const nationalIdError = hasNationalId && nationalId.length === 14 && !parsedNationalId;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (hasNationalId && nationalId && !parsedNationalId) return;
    setSaving(true);
    setSaved(false);
    await updateUserProfileFields(profile.uid, {
      name,
      phone,
      age: hasNationalId ? (parsedNationalId?.age ?? profile.age) : age ? Number(age) : undefined,
      governorate,
      nationalId: hasNationalId ? nationalId : undefined,
      ...(profile.role === "student" ? { stage, school } : {}),
      ...(profile.role === "teacher" ? { subject, workplace, jobTitle } : {}),
    });
    await onSaved();
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-border bg-surface p-6">
      <h2 className="font-display text-lg text-heading">{t("editDetails")}</h2>

      <FormField label={t("name")}>
        <input required className={inputClasses} value={name} onChange={(e) => setName(e.target.value)} />
      </FormField>

      <FormField label={tDetails("phone")}>
        <input dir="ltr" className={inputClasses} value={phone} onChange={(e) => setPhone(e.target.value)} />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        {hasNationalId ? (
          <FormField label={tDetails("age")}>
            <input
              disabled
              dir="ltr"
              className={`${inputClasses} disabled:opacity-70`}
              value={parsedNationalId ? String(parsedNationalId.age) : age}
              placeholder={tDetails("ageFromNationalId")}
            />
          </FormField>
        ) : (
          <FormField label={tDetails("age")}>
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
        <FormField label={tDetails("governorate")}>
          <select className={inputClasses} value={governorate} onChange={(e) => setGovernorate(e.target.value)}>
            <option value="" disabled>
              {tDetails("governoratePlaceholder")}
            </option>
            {governorates.map((g) => (
              <option key={g.id} value={g.id}>
                {g.label}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      {hasNationalId && (
        <FormField label={tDetails("nationalId")}>
          <input
            inputMode="numeric"
            dir="ltr"
            maxLength={14}
            className={inputClasses}
            value={nationalId}
            onChange={(e) => setNationalId(e.target.value.replace(/\D/g, "").slice(0, 14))}
          />
          {nationalIdError && <p className="mt-1 text-xs text-danger-ink">{tDetails("nationalIdInvalid")}</p>}
        </FormField>
      )}

      {profile.role === "student" && (
        <>
          <FormField label={tDetails("stage")}>
            <select className={inputClasses} value={stage} onChange={(e) => setStage(e.target.value as StageId)}>
              {stages.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label={tDetails("school")}>
            <input className={inputClasses} value={school} onChange={(e) => setSchool(e.target.value)} />
          </FormField>
        </>
      )}

      {profile.role === "teacher" && (
        <>
          <FormField label={tDetails("subject")}>
            <input className={inputClasses} value={subject} onChange={(e) => setSubject(e.target.value)} />
          </FormField>
          <FormField label={tDetails("workplace")}>
            <input className={inputClasses} value={workplace} onChange={(e) => setWorkplace(e.target.value)} />
          </FormField>
          <FormField label={tDetails("jobTitle")}>
            <input className={inputClasses} value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
          </FormField>
        </>
      )}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={saving} className="px-6 py-2.5 text-sm">
          {saving ? t("saving") : t("save")}
        </Button>
        {saved && <span className="text-sm text-success">{t("saved")}</span>}
      </div>
    </form>
  );
}
