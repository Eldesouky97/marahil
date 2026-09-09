"use client";

import { useCallback, useEffect, useState } from "react";
import { listAllUsers } from "@/lib/firebase/users";
import type { AppUser } from "@/types/user";

export function useAdminUsers() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    setUsers(await listAllUsers());
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { users, loading, refresh };
}
