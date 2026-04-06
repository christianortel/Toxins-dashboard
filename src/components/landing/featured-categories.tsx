"use client";

import { motion } from "framer-motion";
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
    <section className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="font-serif text-3xl md:text-4xl font-light text-foreground tracking-tight">
            Five lenses on a single question
          </h2>
          <p className="mt-4 text-text-secondary max-w-xl">
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
                "bg-surface border border-border rounded-lg p-6",
                "transition-colors duration-300",
                "hover:border-border/80"
              )}
            >
              <div className="flex items-center gap-3">
                <span
                  className="block w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: group.color }}
                />
                <h3 className="font-medium text-text-primary">
                  {group.label}
                </h3>
              </div>
              <p className="mt-3 text-sm text-text-secondary leading-relaxed">
                {group.description}
              </p>
              <p className="mt-4 text-xs text-text-muted">
                {layerCounts[group.id]} data layers
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
