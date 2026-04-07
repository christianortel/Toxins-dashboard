import { cn } from "@/lib/utils";

interface EditorialQuoteProps {
  quote: string;
  attribution?: string;
  accentColor?: string;
  className?: string;
}

export function EditorialQuote({
  quote,
  attribution,
  accentColor,
  className,
}: EditorialQuoteProps) {
  const gradientStart = accentColor || "var(--accent-water)";

  return (
    <blockquote
      className={cn("relative py-1 pl-6", className)}
    >
      {/* Gradient left border */}
      <div
        className="absolute left-0 top-0 h-full w-[2px] rounded-full"
        style={{
          background: `linear-gradient(to bottom, ${gradientStart}, var(--accent-bio))`,
        }}
      />
      <p className="font-serif text-xl italic leading-[1.5] text-foreground/85 md:text-2xl">
        {quote}
      </p>
      {attribution && (
        <footer className="mt-4 text-[11px] uppercase tracking-[0.1em] text-text-muted">
          &mdash; {attribution}
        </footer>
      )}
    </blockquote>
  );
}
