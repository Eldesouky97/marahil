import { RoleGuard } from "@/components/auth/RoleGuard";
import { AdminCoursesView } from "@/components/dashboard/admin/AdminCoursesView";

export default function AdminCoursesPage() {
  return (
    <RoleGuard role="admin">
      <AdminCoursesView />
    </RoleGuard>
  );
}
