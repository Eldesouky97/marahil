"use client";

import { useTranslations } from "next-intl";
import { useGovernorateLabel } from "@/lib/hooks/useGovernorates";
import type { AppUser } from "@/types/user";

const DETAIL_FIELDS: (keyof AppUser)[] = [
  "phone",
  "nationalId",
  "age",
  "governorate",
  "stage",
  "school",
  "subject",
  "workplace",
  "jobTitle",
];

/** Shared by AdminUserRow's expandable card section and AdminUserTableRow's expandable `<tr>` — the same field grid either way. */
export function AdminUserDetails({ user }: { user: AppUser }) {
  const t = useTranslations("dashboardAdmin.users");
  const tDetails = useTranslations("auth.personalDetails");
  const governorateLabel = useGovernorateLabel();

  const details = DETAIL_FIELDS.filter((field) => user[field] != null && user[field] !== "");

  return (
    <dl className="grid grid-cols-1 gap-x-6 gap-y-2 text-xs sm:grid-cols-2 md:grid-cols-3">
      <div>
        <dt className="text-dim">{t("joined")}</dt>
        <dd className="text-body">{new Date(user.createdAt).toLocaleDateString()}</dd>
      </div>
      {details.length === 0 ? (
        <p className="col-span-full text-dim">{t("noDetails")}</p>
      ) : (
        details.map((field) => (
          <div key={field}>
            <dt className="text-dim">{tDetails(field)}</dt>
            <dd className="text-body" dir={field === "nationalId" || field === "phone" ? "ltr" : undefined}>
              {field === "governorate" ? governorateLabel(String(user[field])) : String(user[field])}
            </dd>
          </div>
        ))
      )}
    </dl>
  );
}
