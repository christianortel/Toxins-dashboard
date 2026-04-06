import { cn } from "@/lib/utils";

interface SectionContainerProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
}

export function SectionContainer({
  children,
  title,
  subtitle,
  className,
}: SectionContainerProps) {
  return (
    <section className={cn("py-16 md:py-24", className)}>
      {(title || subtitle) && (
        <div className="mb-12 space-y-2">
          {title && (
            <h2 className="font-serif text-2xl text-text-primary md:text-3xl">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="max-w-2xl text-sm leading-relaxed text-text-secondary">
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}
