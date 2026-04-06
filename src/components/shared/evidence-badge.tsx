import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { EVIDENCE_LEVELS } from "@/lib/constants";
import type { EvidenceLevel } from "@/types";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-sans",
  {
    variants: {
      level: {
        direct: "bg-accent-water/10 text-accent-water",
        proxy: "bg-accent-bio/10 text-accent-bio",
        screening: "bg-accent-warning/10 text-accent-warning",
        literature: "bg-accent-contamination/10 text-accent-contamination",
        editorial: "bg-accent-neutral/10 text-accent-neutral",
      },
    },
    defaultVariants: {
      level: "direct",
    },
  }
);

const dotColors: Record<EvidenceLevel, string> = {
  direct: "bg-accent-water",
  proxy: "bg-accent-bio",
  screening: "bg-accent-warning",
  literature: "bg-accent-contamination",
  editorial: "bg-accent-neutral",
};

interface EvidenceBadgeProps extends VariantProps<typeof badgeVariants> {
  level: EvidenceLevel;
  className?: string;
}

export function EvidenceBadge({ level, className }: EvidenceBadgeProps) {
  return (
    <span className={cn(badgeVariants({ level }), className)}>
      <span className={cn("inline-block h-1.5 w-1.5 rounded-full", dotColors[level])} />
      {EVIDENCE_LEVELS[level].label}
    </span>
  );
}
