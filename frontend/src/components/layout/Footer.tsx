import { getTranslations } from "next-intl/server";
import { Logo } from "./Logo";

export async function Footer() {
  const t = await getTranslations("footer");
  return (
    <footer className="bg-bg-alt py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-5 sm:flex-row sm:px-8">
        <div className="flex items-center gap-2">
          <Logo />
          <span className="font-display text-lg text-heading">مراحل</span>
        </div>
        <p className="text-xs text-faint">{t("copyright", { year: new Date().getFullYear() })}</p>
      </div>
    </footer>
  );
}
