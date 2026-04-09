"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { useExploreStore } from "@/stores/explore-store";
import { mockEntities } from "@/data/mock/entities";

const MIN_YEAR = 1940;
const MAX_YEAR = 2024;
const KEY_YEARS = [1940, 1960, 1980, 2000, 2020];

export function TimelineShell() {
  const { timelineYear, setTimelineYear } = useExploreStore();

  // Build a histogram of entity counts per year
  const histogram = useMemo(() => {
    const buckets = new Array<number>(MAX_YEAR - MIN_YEAR + 1).fill(0);
    for (const e of mockEntities) {
      if (e.year !== undefined) {
        const start = Math.max(e.year, MIN_YEAR);
        const end = Math.min(e.yearEnd ?? e.year, MAX_YEAR);
        for (let y = start; y <= end; y++) {
          buckets[y - MIN_YEAR] += 1;
        }
      }
    }
    return buckets;
  }, []);

  const maxCount = useMemo(
    () => Math.max(...histogram, 1),
    [histogram]
  );

  const pct = ((timelineYear - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100;
  const visibleCount = histogram[timelineYear - MIN_YEAR] ?? 0;

  return (
    <div
      className={cn(
        "absolute bottom-4 left-1/2 z-10 -translate-x-1/2",
        "w-full max-w-2xl px-4"
      )}
    >
      <div
        className={cn(
          "rounded-xl border border-border glass",
          "px-8 py-3"
        )}
      >
        {/* Header row */}
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase tracking-widest text-text-muted">
              Timeline
            </span>
            <span className="text-[10px] tabular-nums text-text-muted/70">
              {visibleCount} active
            </span>
          </div>
          <span className="tabular-nums text-lg font-light font-serif text-accent-water">
            {timelineYear}
          </span>
        </div>

        {/* Histogram bars */}
        <div className="relative h-6 mb-1 flex items-end gap-px">
          {histogram.map((count, idx) => {
            const year = MIN_YEAR + idx;
            const h = (count / maxCount) * 100;
            const isCurrent = year === timelineYear;
            const isPast = year <= timelineYear;
            return (
              <div
                key={year}
                className={cn(
                  "flex-1 transition-all duration-200",
                  isCurrent && "bg-accent-water",
                  !isCurrent && isPast && "bg-accent-water/40",
                  !isPast && "bg-text-muted/15"
                )}
                style={{
                  height: count === 0 ? "1px" : `${Math.max(h, 6)}%`,
                }}
                title={`${year}: ${count}`}
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
