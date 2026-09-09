import { cn } from "@/lib/utils/cn";

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-surface shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-[transform,box-shadow,border-color] duration-300 will-change-transform hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_16px_32px_-12px_rgba(0,0,0,0.18)]",
        className
      )}
    >
      {children}
    </div>
  );
}
