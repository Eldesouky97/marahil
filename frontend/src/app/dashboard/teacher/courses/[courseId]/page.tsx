import { RoleGuard } from "@/components/auth/RoleGuard";
import { ManageCourseView } from "@/components/dashboard/teacher/ManageCourseView";

export default async function ManageCoursePage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  return (
    <RoleGuard role="teacher">
      <ManageCourseView courseId={courseId} />
    </RoleGuard>
  );
}
