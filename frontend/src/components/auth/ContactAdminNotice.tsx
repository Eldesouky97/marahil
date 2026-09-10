import { useTranslations } from "next-intl";
import { Mail } from "lucide-react";
import { SUPPORT_EMAIL } from "@/lib/constants";

/** Shared by PendingApprovalNotice and AccountDisabledNotice — the same "how to reach the admin" block. */
export function ContactAdminNotice() {
  const t = useTranslations("auth.contactAdmin");

  return (
    <div className="flex items-center justify-center gap-2 rounded-xl border border-border bg-surface-2 px-4 py-3 text-sm">
      <Mail size={16} className="shrink-0 text-dim" />
      <span className="text-dim">{t("label")}</span>
      <a href={`mailto:${SUPPORT_EMAIL}`} dir="ltr" className="font-medium text-primary-strong hover:underline">
        {SUPPORT_EMAIL}
      </a>
    </div>
  );
}
