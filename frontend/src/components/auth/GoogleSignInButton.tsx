"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { signInWithGoogle } from "@/lib/firebase/auth";
import { getUserProfile } from "@/lib/firebase/users";
import { Button } from "@/components/ui/Button";

/**
 * Shared by LoginForm and RegisterForm — Google sign-in is one flow with two
 * entry points, so the post-sign-in branch (existing profile -> dashboard,
 * no profile yet -> complete-profile) lives here once instead of twice.
 */
export function GoogleSignInButton() {
  const router = useRouter();
  const t = useTranslations("auth");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setError(null);
    setLoading(true);
    try {
      const user = await signInWithGoogle();
      const profile = await getUserProfile(user.uid);
      router.push(profile ? `/dashboard/${profile.role}` : "/auth/complete-profile");
    } catch {
      setError(t("googleError"));
      setLoading(false);
    }
  }

  return (
    <div>
      <Button
        type="button"
        variant="outline"
        disabled={loading}
        onClick={handleClick}
        className="w-full gap-3 text-sm"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
          <path
            fill="#4285F4"
            d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.88 2.7-6.62Z"
          />
          <path
            fill="#34A853"
            d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.98v2.33A9 9 0 0 0 9 18Z"
          />
          <path
            fill="#FBBC05"
            d="M3.95 10.7A5.4 5.4 0 0 1 3.67 9c0-.59.1-1.17.28-1.7V4.97H.98A9 9 0 0 0 0 9c0 1.45.35 2.83.98 4.03l2.97-2.33Z"
          />
          <path
            fill="#EA4335"
            d="M9 3.58c1.32 0 2.51.46 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .98 4.97l2.97 2.33C4.66 5.17 6.65 3.58 9 3.58Z"
          />
        </svg>
        {t("googleButton")}
      </Button>
      {error && <p className="mt-2 text-center text-sm text-danger-ink">{error}</p>}
    </div>
  );
}
