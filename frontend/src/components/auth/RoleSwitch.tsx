import { cn } from "@/lib/utils/cn";
import type { UserRole } from "@/types/user";

const OPTIONS: { role: UserRole; label: string }[] = [
  { role: "student", label: "طالب" },
  { role: "teacher", label: "معلّم" },
];

export function RoleSwitch({ value, onChange }: { value: UserRole; onChange: (role: UserRole) => void }) {
  return (
    <div className="grid grid-cols-2 gap-2 rounded-lg border border-white/10 bg-[#141F38] p-1">
      {OPTIONS.map((o) => (
        <button
          key={o.role}
          type="button"
          onClick={() => onChange(o.role)}
          className={cn(
            "cursor-pointer rounded-md py-2 text-sm transition-colors",
            value === o.role ? "bg-gradient-to-l from-[#D4A94F] to-[#E8C878] text-[#241A05]" : "text-[#8A93A6]"
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
