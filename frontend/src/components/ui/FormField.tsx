export function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm text-muted">{label}</span>
      {children}
    </label>
  );
}

export const inputClasses =
  "w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-body placeholder:text-faint focus:border-accent/50 outline-none";
