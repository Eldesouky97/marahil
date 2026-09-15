"use client";

import { useTranslations } from "next-intl";
import { FormField, inputClasses } from "@/components/ui/FormField";
import { ImageUploadField } from "@/components/ui/ImageUploadField";

export function LessonSimpleFields({
  videoUrl,
  onVideoUrlChange,
  content,
  onContentChange,
  imageUrl,
  onImageUrlChange,
}: {
  videoUrl: string;
  onVideoUrlChange: (value: string) => void;
  content: string;
  onContentChange: (value: string) => void;
  imageUrl?: string;
  onImageUrlChange: (url: string) => void;
}) {
  const t = useTranslations("dashboardTeacher.lessonForm");

  return (
    <>
      <FormField label={t("videoLabel")}>
        <input
          dir="ltr"
          className={inputClasses}
          value={videoUrl}
          onChange={(e) => onVideoUrlChange(e.target.value)}
          placeholder="https://www.youtube.com/embed/..."
        />
      </FormField>

      <FormField label={t("contentLabel")}>
        <textarea rows={4} className={inputClasses} value={content} onChange={(e) => onContentChange(e.target.value)} />
      </FormField>

      <FormField label={t("image")}>
        <ImageUploadField folder="lesson-images" currentUrl={imageUrl} onUploaded={onImageUrlChange} />
      </FormField>
    </>
  );
}
