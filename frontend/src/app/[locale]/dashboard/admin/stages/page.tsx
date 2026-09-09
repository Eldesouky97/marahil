import { RoleGuard } from "@/components/auth/RoleGuard";
import { AdminStagesView } from "@/components/dashboard/admin/AdminStagesView";

export default function AdminStagesPage() {
  return (
    <RoleGuard role="admin">
      <AdminStagesView />
    </RoleGuard>
  );
}
