import { RoleGuard } from "@/components/auth/RoleGuard";
import { AdminCertificatesView } from "@/components/dashboard/admin/AdminCertificatesView";

export default function AdminCertificatesPage() {
  return (
    <RoleGuard role="admin">
      <AdminCertificatesView />
    </RoleGuard>
  );
}
