"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { FileUp } from "lucide-react";
import { useAuth } from "@/context/AuthProvider";
import { useToast } from "@/components/ui/ToastProvider";
import { uploadFile } from "@/lib/upload/uploadFile";
import { extractPptxSlides, buildLessonSlides, PptxParseError, type ExtractedSlide } from "@/lib/pptx/parsePptx";
import type { LessonSlide } from "@/types/lessonSlide";

const MAX_PPTX_BYTES = 50 * 1024 * 1024;
const UPLOAD_CONCURRENCY = 4;
const MAX_IMAGE_DIMENSION = 1600;
const JPEG_QUALITY = 0.82;

type Phase = "idle" | "parsing" | "uploading";

/**
 * PPTX slide images often come straight out of a phone/stock photo at full
 * resolution (700KB+ each) even though they render at a fraction of that
 * size in a lesson slide — re-encoding through a canvas before upload is
 * what makes importing a 13-slide deck take seconds instead of a minute-plus
 * on a mobile connection. Falls back to the original bytes if decoding fails
 * for a given image rather than failing the whole import over one slide.
 */
async function compressImage(
  blob: Blob,
  contentType: string
): Promise<{ blob: Blob; contentType: string; extension: string }> {
  const fallback = { blob, contentType, extension: contentType === "image/png" ? "png" : "jpg" };
  try {
    const bitmap = await createImageBitmap(blob);
    const scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return fallback;
    ctx.drawImage(bitmap, 0, 0, width, height);

    const outputType = contentType === "image/png" ? "image/png" : "image/jpeg";
    const outBlob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, outputType, outputType === "image/jpeg" ? JPEG_QUALITY : undefined)
    );
    if (!outBlob) return fallback;
    return { blob: outBlob, contentType: outputType, extension: outputType === "image/png" ? "png" : "jpg" };
  } catch {
    return fallback;
  }
}

/** Uploads every slide's image with a small worker pool instead of one at a time — the presign+PUT round trip per image otherwise adds up linearly with slide count. */
async function uploadImagesConcurrently(
  extracted: ExtractedSlide[],
  idToken: string,
  onProgress: (done: number, total: number) => void
): Promise<(string | undefined)[]> {
  const results: (string | undefined)[] = new Array(extracted.length).fill(undefined);
  let doneCount = 0;
  let nextIndex = 0;

  async function worker() {
    for (;;) {
      const i = nextIndex++;
      if (i >= extracted.length) return;
      const slide = extracted[i];
      if (slide.image) {
        try {
          const compressed = await compressImage(slide.image.blob, slide.image.contentType);
          const file = new File([compressed.blob], `slide-${i + 1}.${compressed.extension}`, { type: compressed.contentType });
          results[i] = await uploadFile(file, "lesson-images", idToken);
        } catch {
          results[i] = undefined; // one slide's image failing shouldn't fail the whole import
        }
      }
      doneCount++;
      onProgress(doneCount, extracted.length);
    }
  }

  await Promise.all(Array.from({ length: Math.min(UPLOAD_CONCURRENCY, extracted.length) }, worker));
  return results;
}

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
      const imageUrls = await uploadImagesConcurrently(extracted, idToken, (done, total) => setProgress({ done, total }));

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
