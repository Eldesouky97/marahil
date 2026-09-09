import { cn } from "@/lib/utils/cn";

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-block h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-[#D4A94F]",
        className
      )}
      role="status"
      aria-label="جارٍ التحميل"
    />
  );
}
