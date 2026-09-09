"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { registerUser } from "@/lib/firebase/auth";
import { RoleSwitch } from "./RoleSwitch";
import { Button } from "@/components/ui/Button";
import { FormField, inputClasses } from "@/components/ui/FormField";
import type { UserRole } from "@/types/user";

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get("role") === "teacher" ? "teacher" : "student";

  const [role, setRole] = useState<UserRole>(initialRole);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await registerUser(name, email, password, role);
      router.push(role === "teacher" ? "/dashboard/teacher" : "/dashboard/student");
    } catch {
      setError("تعذّر إنشاء الحساب. تأكد من صحة البيانات أو أن البريد غير مستخدم من قبل.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <RoleSwitch value={role} onChange={setRole} />

      <FormField label="الاسم الكامل">
        <input required className={inputClasses} value={name} onChange={(e) => setName(e.target.value)} />
      </FormField>
      <FormField label="البريد الإلكتروني">
        <input
          type="email"
          required
          dir="ltr"
          className={inputClasses}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormField>
      <FormField label="كلمة المرور">
        <input
          type="password"
          required
          minLength={6}
          dir="ltr"
          className={inputClasses}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormField>

      {error && <p className="text-sm text-[#F3BFBF]">{error}</p>}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "جارٍ الإنشاء..." : "إنشاء حساب"}
      </Button>

      <p className="text-center text-sm text-[#8A93A6]">
        لديك حساب بالفعل؟{" "}
        <Link href="/auth/login" className="text-[#E8C878]">
          سجّل الدخول
        </Link>
      </p>
    </form>
  );
}
