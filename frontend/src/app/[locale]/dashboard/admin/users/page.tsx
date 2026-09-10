import { Suspense } from "react";
import { AdminUsersView } from "@/components/dashboard/admin/AdminUsersView";

export default function AdminUsersPage() {
  return (
    <Suspense>
      <AdminUsersView />
    </Suspense>
  );
}
