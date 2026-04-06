import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-20 text-center",
        className
      )}
    >
      <Icon size={32} className="mb-4 text-text-muted opacity-40" />
      <h3 className="font-serif text-lg text-text-secondary">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-text-muted">
          {description}
        </p>
      )}
    </div>
  );
}
