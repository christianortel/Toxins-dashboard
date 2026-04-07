"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-20 text-center",
        className
      )}
    >
      <div className="mb-4" style={{ animation: "emptyFloat 3s ease-in-out infinite" }}>
        <Icon size={32} className="text-text-muted/50" />
      </div>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes emptyFloat {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-6px); }
            }
          `,
        }}
      />
      <h3 className="font-serif text-lg font-light text-text-secondary">
        {title}
      </h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-text-muted">
          {description}
        </p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="mt-6 rounded-full border border-border bg-surface px-5 py-2 text-xs uppercase tracking-widest text-text-secondary transition-all duration-200 hover:border-accent-water/40 hover:bg-panel hover:text-text-primary"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
