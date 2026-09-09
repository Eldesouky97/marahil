import { RoleGuard } from "@/components/auth/RoleGuard";
import { StudentDashboardView } from "@/components/dashboard/student/StudentDashboardView";

export default function StudentDashboardPage() {
  return (
    <RoleGuard role="student">
      <StudentDashboardView />
    </RoleGuard>
  );
}
