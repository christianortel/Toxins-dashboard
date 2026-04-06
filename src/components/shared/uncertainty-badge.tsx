import { TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

interface UncertaintyBadgeProps {
  text: string;
  className?: string;
}

export function UncertaintyBadge({ text, className }: UncertaintyBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-[11px] text-text-muted",
        className
      )}
    >
      <TriangleAlert size={12} className="shrink-0 opacity-60" />
      {text}
    </span>
  );
}
