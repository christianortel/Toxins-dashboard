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
        "flex flex-col items-center justify-center py-20 text-center",
        className
      )}
    >
      <AlertTriangle size={32} className="mb-4 text-accent-contamination opacity-60" />
      <h3 className="font-serif text-lg text-text-primary">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-text-muted">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-6 rounded border border-border bg-surface px-4 py-2 text-xs uppercase tracking-widest text-text-secondary transition-colors duration-200 hover:bg-panel hover:text-text-primary"
        >
          Try again
        </button>
      )}
    </div>
  );
}
