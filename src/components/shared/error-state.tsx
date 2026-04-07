"use client";

import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border border-accent-contamination/20 py-20 text-center",
        className
      )}
    >
      <AlertTriangle
        size={32}
        className="mb-4 text-accent-contamination opacity-60"
      />
      <h3 className="font-serif text-lg text-text-primary">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-text-muted">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-6 rounded border border-accent-contamination/30 bg-surface px-5 py-2 text-xs uppercase tracking-widest text-text-secondary transition-all duration-200 hover:border-accent-contamination/50 hover:text-text-primary"
          style={{
            boxShadow: "0 0 0 0 transparent",
            transition: "box-shadow 0.2s, border-color 0.2s, color 0.2s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              "0 0 12px 0 rgba(196, 120, 74, 0.15)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              "0 0 0 0 transparent";
          }}
        >
          Try again
        </button>
      )}
    </div>
  );
}
