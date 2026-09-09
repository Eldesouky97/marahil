import type { LucideIcon } from "lucide-react";

export function StatCard({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <Icon size={16} className="mb-2 text-accent" />
      <div className="text-lg font-bold">{value}</div>
      <div className="mt-0.5 text-xs text-dim">{label}</div>
    </div>
  );
}
