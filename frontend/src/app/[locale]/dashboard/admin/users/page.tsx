import { RoleGuard } from "@/components/auth/RoleGuard";
import { AdminUsersView } from "@/components/dashboard/admin/AdminUsersView";

export default function AdminUsersPage() {
  return (
    <RoleGuard role="admin">
      <AdminUsersView />
    </RoleGuard>
  );
}
