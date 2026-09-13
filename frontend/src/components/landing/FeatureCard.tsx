import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils/cn";

const SPAN_CLASSES = {
  sm: "lg:col-span-4",
  md: "lg:col-span-5",
  lg: "lg:col-span-7",
} as const;

export function FeatureCard({
  icon: Icon,
  title,
  desc,
  span = "md",
  widget,
}: {
  icon: LucideIcon;
  title: string;
  desc: string;
  span?: keyof typeof SPAN_CLASSES;
  widget?: "quiz" | "chart";
}) {
  return (
    <Card className={cn("group p-6", SPAN_CLASSES[span])}>
      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors group-hover:bg-primary/[0.12] group-hover:text-primary-strong">
        <Icon size={20} />
      </div>
      <h3 className="mb-2 font-bold">{title}</h3>
      <p className="text-sm leading-relaxed text-dim">{desc}</p>

      {widget === "quiz" && (
        <div className="mt-4 space-y-1.5">
          {[false, true].map((ok, i) => (
            <div
              key={i}
              className={cn(
                "rounded-md border px-2 py-1 text-[10px]",
                ok ? "border-accent/40 bg-accent/10 text-accent-ink" : "border-border-strong text-dim"
              )}
            >
              {"—".repeat(6 + i * 3)}
            </div>
          ))}
        </div>
      )}

      {widget === "chart" && (
        <div className="mt-4 flex h-10 items-end gap-1">
          {[40, 70, 55, 90].map((h, i) => (
            <div key={i} className="flex-1 rounded-t bg-gradient-to-t from-primary to-accent" style={{ height: `${h}%` }} />
          ))}
        </div>
      )}
    </Card>
  );
}
