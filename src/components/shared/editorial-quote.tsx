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
  accentColor = "var(--accent-water)",
  className,
}: EditorialQuoteProps) {
  return (
    <blockquote
      className={cn("border-l-2 py-1 pl-6", className)}
      style={{ borderColor: accentColor }}
    >
      <p className="font-serif text-lg italic leading-relaxed text-text-primary md:text-xl">
        {quote}
      </p>
      {attribution && (
        <footer className="mt-3 text-xs uppercase tracking-widest text-text-muted">
          &mdash; {attribution}
        </footer>
      )}
    </blockquote>
  );
}
