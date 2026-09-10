import { RoleGuard } from "@/components/auth/RoleGuard";
import { AdminShell } from "@/components/dashboard/admin/AdminShell";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard role="admin">
      <AdminShell>{children}</AdminShell>
    </RoleGuard>
  );
}
