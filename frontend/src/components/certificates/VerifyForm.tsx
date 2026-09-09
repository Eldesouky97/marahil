"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { inputClasses } from "@/components/ui/FormField";

export function VerifyForm() {
  const router = useRouter();
  const [code, setCode] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (code.trim()) router.push(`/verify/${code.trim().toUpperCase()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex max-w-md gap-2">
      <input
        dir="ltr"
        placeholder="MRH-2026-XXXXX أو رمز التحقق"
        className={`${inputClasses} text-center`}
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <Button type="submit" className="shrink-0 px-5">
        <Search size={16} /> تحقق
      </Button>
    </form>
  );
}
