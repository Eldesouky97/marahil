import { RoleGuard } from "@/components/auth/RoleGuard";
import { AdminAuditLogView } from "@/components/dashboard/admin/AdminAuditLogView";

export default function AdminAuditLogPage() {
  return (
    <RoleGuard role="admin">
      <AdminAuditLogView />
    </RoleGuard>
  );
}
