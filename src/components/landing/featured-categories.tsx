"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { staggerContainer, fadeInUp } from "@/lib/motion";
import { LAYER_GROUPS } from "@/lib/constants";

const layerCounts: Record<string, number> = {
  official: 14,
  emerging: 8,
  wildlife: 11,
  reproductive: 9,
  regulatory: 7,
};

export function FeaturedCategories() {
  const groups = Object.values(LAYER_GROUPS);

  return (
    <section className="px-6 py-28 md:py-36">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="font-serif text-3xl md:text-4xl font-light text-foreground tracking-tight">
            <span className="block font-serif italic text-accent-water">
              Five
            </span>
            lenses on a single question
          </h2>
          <p className="mt-4 text-text-secondary max-w-xl leading-relaxed">
            Each layer group examines environmental health from a distinct
            vantage point. Together, they compose a fuller picture of what
            industry leaves behind.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {groups.map((group) => (
            <motion.div
              key={group.id}
              variants={fadeInUp}
              className={cn(
                "group relative bg-surface border border-border rounded-lg p-8 overflow-hidden",
                "transition-all duration-500 hover:border-border/70"
              )}
              style={
                {
                  "--group-color": group.color,
                } as React.CSSProperties
              }
            >
              {/* Left border accent on hover */}
              <div
                className="absolute left-0 top-0 bottom-0 w-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ backgroundColor: group.color }}
              />

              {/* Subtle gradient overlay on hover */}
              <div
                className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `radial-gradient(ellipse 70% 70% at 90% 90%, color-mix(in srgb, ${group.color} 6%, transparent) 0%, transparent 70%)`,
                }}
              />

              <div className="relative">
                <div className="flex items-center gap-3">
                  <span
                    className="block w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: group.color }}
                  />
                  <h3 className="font-medium text-text-primary">
                    {group.label}
                  </h3>
                </div>
                <p className="mt-4 text-sm text-text-secondary leading-relaxed">
                  {group.description}
                </p>
                <div className="mt-6 flex items-center justify-between">
                  <p className="text-xs text-text-muted">
                    <span className="font-medium text-base tabular-nums text-text-secondary">
                      {layerCounts[group.id]}
                    </span>{" "}
                    data layers
                  </p>
                  <ArrowRight className="w-3.5 h-3.5 text-text-muted opacity-0 -translate-x-2 group-hover:opacity-60 group-hover:translate-x-0 transition-all duration-400" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
