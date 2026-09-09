import { STAGES } from "@/data/stages";
import { cn } from "@/lib/utils/cn";
import type { StageId } from "@/types/stage";

export function StageFilter({
  value,
  onChange,
}: {
  value: StageId | "all";
  onChange: (stage: StageId | "all") => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <button
        onClick={() => onChange("all")}
        className={cn(
          "cursor-pointer rounded-full border border-white/[0.06] bg-[#141F38] px-4 py-2.5 text-sm text-[#8A93A6] transition-all hover:border-[#D4A94F]/30",
          value === "all" && "border-transparent bg-gradient-to-l from-[#D4A94F] to-[#E8C878] text-[#241A05]"
        )}
      >
        كل المراحل
      </button>
      {STAGES.map((s) => (
        <button
          key={s.id}
          onClick={() => onChange(s.id)}
          className={cn(
            "cursor-pointer rounded-full border border-white/[0.06] bg-[#141F38] px-4 py-2.5 text-sm text-[#8A93A6] transition-all hover:border-[#D4A94F]/30",
            value === s.id && "border-transparent bg-gradient-to-l from-[#D4A94F] to-[#E8C878] text-[#241A05]"
          )}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}
