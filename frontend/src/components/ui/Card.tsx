import { cn } from "@/lib/utils/cn";

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/[0.06] bg-[#141F38] transition-colors hover:border-[#D4A94F]/30",
        className
      )}
    >
      {children}
    </div>
  );
}
