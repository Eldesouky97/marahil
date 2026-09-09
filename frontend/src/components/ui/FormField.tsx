export function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm text-[#C7CEE3]">{label}</span>
      {children}
    </label>
  );
}

export const inputClasses =
  "w-full rounded-lg border border-white/10 bg-[#141F38] px-4 py-2.5 text-sm text-[#E7E9F2] placeholder:text-[#5C6584] focus:border-[#3FBFAE]/50 outline-none";
