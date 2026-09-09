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
      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-[#3FBFAE]/10 text-[#3FBFAE] transition-colors group-hover:bg-[#D4A94F]/[0.12] group-hover:text-[#E8C878]">
        <Icon size={20} />
      </div>
      <h3 className="mb-2 font-bold">{title}</h3>
      <p className="text-sm leading-relaxed text-[#8A93A6]">{desc}</p>
    </Card>
  );
}
