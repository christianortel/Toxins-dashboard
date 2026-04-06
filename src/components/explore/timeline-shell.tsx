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
          "rounded-lg border border-border bg-panel/90 backdrop-blur-md",
          "px-6 py-3"
        )}
      >
        {/* Year display */}
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-widest text-text-muted">
            Timeline
          </span>
          <span className="tabular-nums text-sm font-semibold text-accent-water">
            {timelineYear}
          </span>
        </div>

        {/* Range slider */}
        <div className="relative">
          <input
            type="range"
            min={MIN_YEAR}
            max={MAX_YEAR}
            value={timelineYear}
            onChange={(e) => setTimelineYear(Number(e.target.value))}
            className="timeline-slider w-full"
            aria-label="Timeline year"
          />
          {/* Track fill overlay */}
          <div
            className="pointer-events-none absolute top-1/2 left-0 h-[2px] -translate-y-1/2 rounded-full bg-accent-water/60"
            style={{ width: `${pct}%` }}
          />
        </div>

        {/* Key year markers */}
        <div className="relative mt-1.5 flex justify-between">
          {KEY_YEARS.map((year) => {
            const yearPct =
              ((year - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100;
            return (
              <button
                key={year}
                onClick={() => setTimelineYear(year)}
                className={cn(
                  "text-[9px] tabular-nums transition-colors",
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
        <div className="h-4" />

        {/* Custom slider styles */}
        <style jsx>{`
          .timeline-slider {
            -webkit-appearance: none;
            appearance: none;
            height: 2px;
            background: var(--border);
            border-radius: 1px;
            outline: none;
            cursor: pointer;
            position: relative;
            z-index: 1;
          }
          .timeline-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 14px;
            height: 14px;
            border-radius: 50%;
            background: var(--accent-water);
            border: 2px solid var(--panel);
            box-shadow: 0 0 0 1px var(--accent-water), 0 2px 8px rgba(0, 0, 0, 0.4);
            cursor: pointer;
            transition: transform 0.15s ease;
          }
          .timeline-slider::-webkit-slider-thumb:hover {
            transform: scale(1.2);
          }
          .timeline-slider::-moz-range-thumb {
            width: 14px;
            height: 14px;
            border-radius: 50%;
            background: var(--accent-water);
            border: 2px solid var(--panel);
            box-shadow: 0 0 0 1px var(--accent-water), 0 2px 8px rgba(0, 0, 0, 0.4);
            cursor: pointer;
          }
          .timeline-slider::-moz-range-track {
            height: 2px;
            background: var(--border);
            border-radius: 1px;
          }
        `}</style>
      </div>
    </div>
  );
}
