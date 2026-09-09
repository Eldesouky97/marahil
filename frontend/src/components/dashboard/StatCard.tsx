import type { LucideIcon } from "lucide-react";

export function StatCard({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#141F38] p-4">
      <Icon size={16} className="mb-2 text-[#3FBFAE]" />
      <div className="text-lg font-bold">{value}</div>
      <div className="mt-0.5 text-xs text-[#8A93A6]">{label}</div>
    </div>
  );
}
