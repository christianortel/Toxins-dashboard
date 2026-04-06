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
        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition-all duration-200",
        selected
          ? "border-border bg-panel text-text-primary"
          : "border-transparent bg-surface text-text-muted hover:border-border hover:text-text-secondary",
        className
      )}
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
