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
      <p className="mb-3 text-sm font-bold text-accent">{eyebrow}</p>
      <h2 className="mb-4 font-display text-3xl text-heading">{title}</h2>
      {description && <p className="leading-relaxed text-dim">{description}</p>}
    </div>
  );
}
