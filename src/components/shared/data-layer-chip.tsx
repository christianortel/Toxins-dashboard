"use client";

import { cn } from "@/lib/utils";

interface DataLayerChipProps {
  label: string;
  color: string;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

export function DataLayerChip({
  label,
  color,
  selected = false,
  onClick,
  className,
}: DataLayerChipProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] tracking-wide transition-all duration-200 active:scale-95",
        selected
          ? "border-border bg-panel text-text-primary"
          : "border-border/60 bg-surface text-text-muted hover:border-border hover:text-text-secondary",
        className
      )}
      style={
        selected
          ? { boxShadow: `0 0 12px 0 ${color}20, 0 1px 3px 0 ${color}10` }
          : undefined
      }
    >
      <span
        className={cn(
          "inline-block h-2 w-2 rounded-full transition-opacity duration-200",
          !selected && "opacity-50"
        )}
        style={{ backgroundColor: color }}
      />
      {label}
    </button>
  );
}
