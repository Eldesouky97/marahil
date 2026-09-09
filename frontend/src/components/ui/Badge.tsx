import { cn } from "@/lib/utils/cn";

export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-[#D4A94F]/30 bg-[#D4A94F]/10 px-4 py-1.5 text-xs text-[#E8C878]",
        className
      )}
    >
      {children}
    </span>
  );
}
