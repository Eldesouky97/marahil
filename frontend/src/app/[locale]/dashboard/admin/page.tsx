import { RoleGuard } from "@/components/auth/RoleGuard";
import { AdminOverviewView } from "@/components/dashboard/admin/AdminOverviewView";

export default function AdminDashboardPage() {
  return (
    <RoleGuard role="admin">
      <AdminOverviewView />
    </RoleGuard>
  );
}
