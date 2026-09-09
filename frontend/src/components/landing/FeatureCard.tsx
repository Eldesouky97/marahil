import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";

export function FeatureCard({
  icon: Icon,
  title,
  desc,
}: {
  icon: LucideIcon;
  title: string;
  desc: string;
}) {
  return (
    <Card className="group p-6">
      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors group-hover:bg-primary/[0.12] group-hover:text-primary-strong">
        <Icon size={20} />
      </div>
      <h3 className="mb-2 font-bold">{title}</h3>
      <p className="text-sm leading-relaxed text-dim">{desc}</p>
    </Card>
  );
}
