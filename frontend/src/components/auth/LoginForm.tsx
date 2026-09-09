"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginUser } from "@/lib/firebase/auth";
import { getUserProfile } from "@/lib/firebase/users";
import { Button } from "@/components/ui/Button";
import { FormField, inputClasses } from "@/components/ui/FormField";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const user = await loginUser(email, password);
      const profile = await getUserProfile(user.uid);
      router.push(profile?.role === "teacher" ? "/dashboard/teacher" : "/dashboard/student");
    } catch {
      setError("البريد الإلكتروني أو كلمة المرور غير صحيحة.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
          dir="ltr"
          className={inputClasses}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormField>

      {error && <p className="text-sm text-[#F3BFBF]">{error}</p>}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "جارٍ الدخول..." : "تسجيل الدخول"}
      </Button>

      <p className="text-center text-sm text-[#8A93A6]">
        ليس لديك حساب؟{" "}
        <Link href="/auth/register" className="text-[#E8C878]">
          أنشئ حسابًا
        </Link>
      </p>
    </form>
  );
}
