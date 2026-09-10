import { AdminManageCourseView } from "@/components/dashboard/admin/AdminManageCourseView";

export default async function AdminManageCoursePage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  return <AdminManageCourseView courseId={courseId} />;
}
