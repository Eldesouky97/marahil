export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.07]">
      <div
        className="h-full rounded-full bg-gradient-to-l from-[#D4A94F] to-[#3FBFAE]"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
