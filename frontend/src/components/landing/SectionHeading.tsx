export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mx-auto mb-12 max-w-xl text-center">
      <p className="mb-3 text-sm font-bold text-[#3FBFAE]">{eyebrow}</p>
      <h2 className="mb-4 font-display text-3xl text-[#F6EFDD]">{title}</h2>
      {description && <p className="leading-relaxed text-[#8A93A6]">{description}</p>}
    </div>
  );
}
