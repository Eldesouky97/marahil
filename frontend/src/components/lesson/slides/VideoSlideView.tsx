"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { QuizQuestionCard } from "@/components/quiz/QuizQuestionCard";
import { Button } from "@/components/ui/Button";
import type { VideoSlide } from "@/types/lessonSlide";

export function VideoSlideView({ slide }: { slide: VideoSlide }) {
  const t = useTranslations("lesson.slideDeck");
  const videoRef = useRef<HTMLVideoElement>(null);
  const consumedRef = useRef<Set<string>>(new Set());
  const [activeCheckpointId, setActiveCheckpointId] = useState<string | null>(null);
  const [selected, setSelected] = useState<number | null>(null);

  const checkpoints = slide.checkpoints ?? [];
  const activeCheckpoint = checkpoints.find((c) => c.id === activeCheckpointId);

  function handleTimeUpdate() {
    const video = videoRef.current;
    if (!video || activeCheckpointId) return;
    const hit = checkpoints.find((c) => !consumedRef.current.has(c.id) && video.currentTime >= c.timeSeconds);
    if (hit) {
      video.pause();
      consumedRef.current.add(hit.id);
      setActiveCheckpointId(hit.id);
      setSelected(null);
    }
  }

  function continueVideo() {
    setActiveCheckpointId(null);
    setSelected(null);
    videoRef.current?.play();
  }

  return (
    <div>
      {slide.title && <h3 className="mb-4 font-display text-xl text-heading">{slide.title}</h3>}
      <div className="relative aspect-video overflow-hidden rounded-xl border border-border bg-black">
        {slide.source === "youtube" ? (
          <iframe
            src={slide.videoUrl}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video ref={videoRef} src={slide.videoUrl} controls onTimeUpdate={handleTimeUpdate} className="h-full w-full" />
        )}

        {activeCheckpoint && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 p-4">
            <div className="w-full max-w-md rounded-xl border border-border bg-surface p-5">
              <QuizQuestionCard question={activeCheckpoint.question} selected={selected} onSelect={setSelected} />
              {selected !== null && (
                <div className="mt-4 flex justify-end">
                  <Button onClick={continueVideo} className="px-5 py-2 text-sm">
                    {t("checkpointContinue")}
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
