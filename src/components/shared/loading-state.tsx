import { cn } from "@/lib/utils";

interface LoadingStateProps {
  variant?: "card" | "page" | "map";
  className?: string;
}

function Shimmer({ className }: { className?: string }) {
  return (
    <div
      className={cn("relative overflow-hidden rounded-lg bg-panel", className)}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 40%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 60%, transparent 100%)",
          animation: "shimmer 2s ease-in-out infinite",
        }}
      />
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes shimmer {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(100%); }
            }
          `,
        }}
      />
    </div>
  );
}

export function LoadingState({
  variant = "card",
  className,
}: LoadingStateProps) {
  if (variant === "page") {
    return (
      <div className={cn("space-y-8", className)}>
        <Shimmer className="h-8 w-48" />
        <Shimmer className="h-4 w-96 max-w-full" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Shimmer key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  if (variant === "map") {
    return (
      <div
        className={cn(
          "relative flex h-full w-full items-center justify-center overflow-hidden rounded-lg",
          className
        )}
      >
        <Shimmer className="absolute inset-0 h-full w-full" />
        <div className="relative z-10 flex flex-col items-center gap-3">
          <p className="text-xs uppercase tracking-widest text-text-muted/60">
            Loading map data&hellip;
          </p>
        </div>
        <div className="absolute bottom-4 left-4 space-y-2">
          <Shimmer className="h-3 w-24" />
          <Shimmer className="h-3 w-32" />
        </div>
      </div>
    );
  }

  // card
  return (
    <div
      className={cn(
        "relative overflow-hidden space-y-4 rounded-lg border border-border bg-surface p-6",
        className
      )}
    >
      {/* Colored shimmer top line */}
      <div className="absolute top-0 left-0 h-[2px] w-full overflow-hidden">
        <div
          className="h-full w-full"
          style={{
            background:
              "linear-gradient(90deg, transparent, var(--accent-water), transparent)",
            animation: "shimmer 2s ease-in-out infinite",
          }}
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              @keyframes shimmer {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
              }
            `,
          }}
        />
      </div>
      <Shimmer className="h-4 w-32" />
      <Shimmer className="h-3 w-full" />
      <Shimmer className="h-3 w-3/4" />
      <Shimmer className="h-20 w-full" />
    </div>
  );
}
