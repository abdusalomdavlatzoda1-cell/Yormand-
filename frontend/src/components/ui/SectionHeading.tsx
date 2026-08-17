export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  center = true,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <div className={center ? "text-center max-w-2xl mx-auto mb-12" : "mb-12"}>
      {eyebrow && <div className="text-xs uppercase tracking-[0.2em] text-gold font-semibold mb-3">{eyebrow}</div>}
      <h2 className="section-title">{title}</h2>
      {subtitle && <p className="mt-4 text-brand-900/60 leading-relaxed">{subtitle}</p>}
    </div>
  );
}
