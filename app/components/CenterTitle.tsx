export default function CenterTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center">
      <p className="uppercase tracking-[0.3em] text-xs md:text-sm mb-4 font-light text-center">
        {subtitle}
      </p>
      <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-16 text-primary">
        {title}
      </h2>
    </div>
  );
}
