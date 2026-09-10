import { ManageCourseView } from "@/components/dashboard/teacher/ManageCourseView";

export default async function ManageCoursePage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  return <ManageCourseView courseId={courseId} />;
}
