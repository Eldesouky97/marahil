"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { FileUp } from "lucide-react";
import { useAuth } from "@/context/AuthProvider";
import { useToast } from "@/components/ui/ToastProvider";
import { uploadFile } from "@/lib/upload/uploadFile";
import { extractPptxSlides, buildLessonSlides, PptxParseError } from "@/lib/pptx/parsePptx";
import type { LessonSlide } from "@/types/lessonSlide";

const MAX_PPTX_BYTES = 50 * 1024 * 1024;

type Phase = "idle" | "parsing" | "uploading";

export function PptxImportButton({ onImported }: { onImported: (slides: LessonSlide[]) => void }) {
  const { firebaseUser } = useAuth();
  const { showToast } = useToast();
  const t = useTranslations("dashboardTeacher.slideBuilder");
  const [phase, setPhase] = useState<Phase>("idle");
  const [progress, setProgress] = useState({ done: 0, total: 0 });

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !firebaseUser) return;

    if (!file.name.toLowerCase().endsWith(".pptx")) {
      showToast(t("importPptxInvalidType"), { tone: "error" });
      return;
    }
    if (file.size > MAX_PPTX_BYTES) {
      showToast(t("importPptxTooLarge"), { tone: "error" });
      return;
    }

    setPhase("parsing");
    setProgress({ done: 0, total: 0 });
    try {
      const { extracted } = await extractPptxSlides(file, (done, total) => setProgress({ done, total }));

      setPhase("uploading");
      setProgress({ done: 0, total: extracted.length });
      const idToken = await firebaseUser.getIdToken();
      const imageUrls: (string | undefined)[] = [];
      for (let i = 0; i < extracted.length; i++) {
        const slide = extracted[i];
        if (slide.image) {
          try {
            const imageFile = new File([slide.image.blob], `slide-${i + 1}.${slide.image.extension}`, {
              type: slide.image.contentType,
            });
            imageUrls.push(await uploadFile(imageFile, "lesson-images", idToken));
          } catch {
            imageUrls.push(undefined); // one slide's image failing shouldn't fail the whole import
          }
        } else {
          imageUrls.push(undefined);
        }
        setProgress({ done: i + 1, total: extracted.length });
      }

      const { slides, quizSlideNumbers } = buildLessonSlides(extracted, imageUrls);
      onImported(slides);
      showToast(t("importPptxSuccess", { count: slides.length }), { tone: "success" });
      if (quizSlideNumbers.length > 0) {
        showToast(t("importPptxReviewQuiz", { count: quizSlideNumbers.length }), { tone: "info", duration: 7000 });
      }
    } catch (err) {
      if (err instanceof PptxParseError) {
        console.error("PPTX parse error:", err.message);
        showToast(t("importPptxInvalidFile"), { tone: "error" });
      } else {
        console.error("PPTX import failed:", err);
        showToast(t("importPptxFailed"), { tone: "error" });
      }
    } finally {
      setPhase("idle");
    }
  }

  const importing = phase !== "idle";
  const label =
    phase === "parsing"
      ? t("importPptxParsing")
      : phase === "uploading"
        ? t("importPptxUploading", { done: progress.done, total: progress.total })
        : t("importPptx");

  return (
    <label className="flex cursor-pointer items-center gap-1.5 rounded-full border border-border-strong px-3 py-1.5 text-xs text-body hover:border-accent/60 hover:text-accent">
      <FileUp size={13} />
      {label}
      <input type="file" accept=".pptx" className="hidden" onChange={handleChange} disabled={importing} />
    </label>
  );
}
