"use client";

import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";
import { FormField, inputClasses } from "@/components/ui/FormField";
import { VideoUploadField } from "@/components/ui/VideoUploadField";
import { QuizQuestionEditor } from "@/components/dashboard/teacher/QuizQuestionEditor";
import type { VideoSlide, VideoCheckpoint } from "@/types/lessonSlide";
import type { QuizQuestion } from "@/types/quiz";

function emptyQuestion(): QuizQuestion {
  return { id: crypto.randomUUID(), question: "", choices: ["", "", "", ""], correct: 0, explanation: "" };
}

export function VideoSlideEditor({
  slide,
  onChange,
}: {
  slide: VideoSlide;
  onChange: (patch: Partial<VideoSlide>) => void;
}) {
  const t = useTranslations("dashboardTeacher.slideBuilder");
  const checkpoints = slide.checkpoints ?? [];

  function updateCheckpoint(index: number, patch: Partial<VideoCheckpoint>) {
    onChange({ checkpoints: checkpoints.map((c, i) => (i === index ? { ...c, ...patch } : c)) });
  }

  function deleteCheckpoint(index: number) {
    onChange({ checkpoints: checkpoints.filter((_, i) => i !== index) });
  }

  function addCheckpoint() {
    onChange({ checkpoints: [...checkpoints, { id: crypto.randomUUID(), timeSeconds: 0, question: emptyQuestion() }] });
  }

  return (
    <div className="space-y-4">
      <FormField label={t("videoSource")}>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onChange({ source: "youtube" })}
            className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs ${
              slide.source === "youtube" ? "border-accent bg-accent/10 text-accent" : "border-border-strong text-dim"
            }`}
          >
            {t("videoSourceYoutube")}
          </button>
          <button
            type="button"
            onClick={() => onChange({ source: "upload" })}
            className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs ${
              slide.source === "upload" ? "border-accent bg-accent/10 text-accent" : "border-border-strong text-dim"
            }`}
          >
            {t("videoSourceUpload")}
          </button>
        </div>
      </FormField>

      {slide.source === "youtube" ? (
        <input
          dir="ltr"
          className={inputClasses}
          placeholder={t("videoUrlPlaceholder")}
          value={slide.videoUrl}
          onChange={(e) => onChange({ videoUrl: e.target.value })}
        />
      ) : (
        <VideoUploadField folder="lesson-slide-videos" currentUrl={slide.videoUrl} onUploaded={(url) => onChange({ videoUrl: url })} />
      )}

      {slide.source === "youtube" ? (
        <p className="text-xs text-dim">{t("checkpointsYoutubeNotice")}</p>
      ) : (
        <div className="space-y-3 border-t border-border pt-4">
          <p className="text-xs text-dim">{t("checkpoints")}</p>
          {checkpoints.map((checkpoint, index) => (
            <div key={checkpoint.id} className="space-y-2 rounded-lg border border-border bg-surface-2 p-3">
              <FormField label={t("checkpointTime")}>
                <input
                  type="number"
                  min={0}
                  dir="ltr"
                  className={inputClasses}
                  value={checkpoint.timeSeconds}
                  onChange={(e) => updateCheckpoint(index, { timeSeconds: Number(e.target.value) })}
                />
              </FormField>
              <QuizQuestionEditor
                question={checkpoint.question}
                index={index}
                onChange={(patch) => updateCheckpoint(index, { question: { ...checkpoint.question, ...patch } })}
                onDelete={() => deleteCheckpoint(index)}
              />
            </div>
          ))}
          <button type="button" onClick={addCheckpoint} className="flex cursor-pointer items-center gap-2 text-sm text-accent">
            <Plus size={15} /> {t("addCheckpoint")}
          </button>
        </div>
      )}
    </div>
  );
}
