import { LessonPlayer } from "@/components/lesson/LessonPlayer";

export default async function LearnPage({
  params,
}: {
  params: Promise<{ courseId: string; lessonId: string }>;
}) {
  const { courseId, lessonId } = await params;
  return <LessonPlayer courseId={courseId} lessonId={lessonId} />;
}
