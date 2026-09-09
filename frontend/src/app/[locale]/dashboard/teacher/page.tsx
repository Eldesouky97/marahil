import { RoleGuard } from "@/components/auth/RoleGuard";
import { TeacherDashboardView } from "@/components/dashboard/teacher/TeacherDashboardView";

export default function TeacherDashboardPage() {
  return (
    <RoleGuard role="teacher">
      <TeacherDashboardView />
    </RoleGuard>
  );
}
