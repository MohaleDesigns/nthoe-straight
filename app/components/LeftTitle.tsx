export default function LeftTitle({
    title,
    subtitle,
  }: {
    title: string;
    subtitle: string;
  }) {
    return (
      <div>
        <p className="uppercase tracking-[0.3em] text-xs md:text-sm mb-4 font-light">
          {subtitle}
        </p>
        <h2 className="text-3xl md:text-4xl font-serif font-bold mb-16 text-primary">
          {title}
        </h2>
      </div>
    );
  }
  