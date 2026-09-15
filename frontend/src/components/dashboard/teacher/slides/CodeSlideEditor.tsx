"use client";

import { useTranslations } from "next-intl";
import { FormField, inputClasses } from "@/components/ui/FormField";
import type { CodeSlide, CodeSlideLanguage } from "@/types/lessonSlide";

const LANGUAGES: CodeSlideLanguage[] = ["javascript", "python", "html", "css", "json", "bash", "plain"];

export function CodeSlideEditor({
  slide,
  onChange,
}: {
  slide: CodeSlide;
  onChange: (patch: Partial<CodeSlide>) => void;
}) {
  const t = useTranslations("dashboardTeacher.slideBuilder");

  return (
    <>
      <FormField label={t("codeLanguage")}>
        <select
          dir="ltr"
          className={inputClasses}
          value={slide.language}
          onChange={(e) => onChange({ language: e.target.value as CodeSlideLanguage })}
        >
          {LANGUAGES.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
      </FormField>
      <FormField label={t("codeBody")}>
        <textarea
          dir="ltr"
          rows={8}
          className={`${inputClasses} font-mono`}
          value={slide.code}
          onChange={(e) => onChange({ code: e.target.value })}
        />
      </FormField>
      <FormField label={t("codeCaption")}>
        <input className={inputClasses} value={slide.caption ?? ""} onChange={(e) => onChange({ caption: e.target.value })} />
      </FormField>
    </>
  );
}
