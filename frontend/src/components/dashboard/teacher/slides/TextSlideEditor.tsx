"use client";

import { useTranslations } from "next-intl";
import { FormField, inputClasses } from "@/components/ui/FormField";
import { ImageUploadField } from "@/components/ui/ImageUploadField";
import type { TextSlide } from "@/types/lessonSlide";

export function TextSlideEditor({
  slide,
  onChange,
}: {
  slide: TextSlide;
  onChange: (patch: Partial<TextSlide>) => void;
}) {
  const t = useTranslations("dashboardTeacher.slideBuilder");

  return (
    <>
      <FormField label={t("textBody")}>
        <textarea rows={5} className={inputClasses} value={slide.body} onChange={(e) => onChange({ body: e.target.value })} />
      </FormField>
      <FormField label={t("textImage")}>
        <ImageUploadField folder="lesson-images" currentUrl={slide.imageUrl} onUploaded={(url) => onChange({ imageUrl: url })} />
      </FormField>
    </>
  );
}
