"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { listAllUsers } from "@/lib/firebase/users";

interface MonthBucket {
  label: string;
  count: number;
}

interface AdminTrends {
  signupsByMonth: MonthBucket[];
  roleBreakdown: { students: number; teachers: number; admins: number };
  loading: boolean;
}

export function useAdminTrends(): AdminTrends {
  const locale = useLocale();
  const [signupsByMonth, setSignupsByMonth] = useState<MonthBucket[]>([]);
  const [roleBreakdown, setRoleBreakdown] = useState({ students: 0, teachers: 0, admins: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    listAllUsers().then((users) => {
      if (cancelled) return;

      const formatter = new Intl.DateTimeFormat(locale, { month: "short" });
      const now = new Date();
      const months: { key: string; label: string; date: Date }[] = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        months.push({ key: `${date.getFullYear()}-${date.getMonth()}`, label: formatter.format(date), date });
      }
      const counts = new Map(months.map((m) => [m.key, 0]));
      for (const u of users) {
        const d = new Date(u.createdAt);
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        if (counts.has(key)) counts.set(key, (counts.get(key) ?? 0) + 1);
      }
      setSignupsByMonth(months.map((m) => ({ label: m.label, count: counts.get(m.key) ?? 0 })));

      setRoleBreakdown({
        students: users.filter((u) => u.role === "student").length,
        teachers: users.filter((u) => u.role === "teacher").length,
        admins: users.filter((u) => u.role === "admin").length,
      });
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [locale]);

  return { signupsByMonth, roleBreakdown, loading };
}
