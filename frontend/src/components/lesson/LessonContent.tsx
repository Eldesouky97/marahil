import type { Lesson } from "@/types/course";

export function LessonContent({ lesson }: { lesson: Lesson }) {
  return (
    <div>
      {lesson.videoUrl && (
        <div className="mb-6 aspect-video overflow-hidden rounded-xl border border-border bg-black">
          <iframe
            src={lesson.videoUrl}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}
      {lesson.content && (
        <p className="whitespace-pre-line leading-relaxed text-muted">{lesson.content}</p>
      )}
    </div>
  );
}
