import { cn } from "@/lib/utils";

interface LoadingStateProps {
  variant?: "card" | "page" | "map";
  className?: string;
}

function Pulse({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded bg-panel", className)} />;
}

export function LoadingState({ variant = "card", className }: LoadingStateProps) {
  if (variant === "page") {
    return (
      <div className={cn("space-y-8", className)}>
        <Pulse className="h-8 w-48" />
        <Pulse className="h-4 w-96 max-w-full" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Pulse key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  if (variant === "map") {
    return (
      <div className={cn("relative overflow-hidden rounded-lg", className)}>
        <Pulse className="h-[420px] w-full" />
        <div className="absolute bottom-4 left-4 space-y-2">
          <Pulse className="h-3 w-24" />
          <Pulse className="h-3 w-32" />
        </div>
      </div>
    );
  }

  // card
  return (
    <div className={cn("space-y-4 rounded-lg border border-border bg-surface p-6", className)}>
      <Pulse className="h-4 w-32" />
      <Pulse className="h-3 w-full" />
      <Pulse className="h-3 w-3/4" />
      <Pulse className="h-20 w-full" />
    </div>
  );
}
