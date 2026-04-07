"use client";

import { cn } from "@/lib/utils";
import { useExploreStore } from "@/stores/explore-store";

const MIN_YEAR = 1960;
const MAX_YEAR = 2024;
const KEY_YEARS = [1960, 1970, 1980, 1990, 2000, 2010, 2024];

export function TimelineShell() {
  const { timelineYear, setTimelineYear } = useExploreStore();

  const pct = ((timelineYear - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100;

  return (
    <div
      className={cn(
        "absolute bottom-4 left-1/2 z-10 -translate-x-1/2",
        "w-full max-w-xl px-4"
      )}
    >
      <div
        className={cn(
          "rounded-xl border border-border glass",
          "px-8 py-3"
        )}
      >
        {/* Header row */}
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-widest text-text-muted">
            Timeline
          </span>
          <span className="tabular-nums text-lg font-light font-serif text-accent-water">
            {timelineYear}
          </span>
        </div>

        {/* Tick marks above slider */}
        <div className="relative h-2 mb-1">
          {KEY_YEARS.map((year) => {
            const yearPct =
              ((year - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100;
            return (
              <div
                key={year}
                className="absolute top-0 w-px bg-text-muted/40"
                style={{
                  left: `${yearPct}%`,
                  height: "8px",
                }}
              />
            );
          })}
        </div>

        {/* Range slider — uses global .range-slider class */}
        <div className="relative">
          <input
            type="range"
            min={MIN_YEAR}
            max={MAX_YEAR}
            value={timelineYear}
            onChange={(e) => setTimelineYear(Number(e.target.value))}
            className="range-slider w-full relative z-[1]"
            aria-label="Timeline year"
          />
          {/* Track fill overlay */}
          <div
            className="pointer-events-none absolute top-1/2 left-0 h-[2px] -translate-y-1/2 rounded-full bg-accent-water/60"
            style={{ width: `${pct}%` }}
          />
        </div>

        {/* Key year markers */}
        <div className="relative mt-2 flex justify-between">
          {KEY_YEARS.map((year) => {
            const yearPct =
              ((year - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100;
            return (
              <button
                key={year}
                onClick={() => setTimelineYear(year)}
                className={cn(
                  "text-[10px] tabular-nums transition-all duration-200",
                  "hover:underline hover:underline-offset-2",
                  timelineYear === year
                    ? "text-accent-water font-medium"
                    : "text-text-muted hover:text-text-secondary"
                )}
                style={{
                  position: "absolute",
                  left: `${yearPct}%`,
                  transform: "translateX(-50%)",
                }}
              >
                {year}
              </button>
            );
          })}
        </div>

        {/* Spacer for key year labels */}
        <div className="h-5" />
      </div>
    </div>
  );
}
