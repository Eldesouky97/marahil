import { RoleGuard } from "@/components/auth/RoleGuard";
import { AdminManageCourseView } from "@/components/dashboard/admin/AdminManageCourseView";

export default async function AdminManageCoursePage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  return (
    <RoleGuard role="admin">
      <AdminManageCourseView courseId={courseId} />
    </RoleGuard>
  );
}
