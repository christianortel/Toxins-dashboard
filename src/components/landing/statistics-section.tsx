"use client";

import { motion } from "framer-motion";
import { staggerContainer, fadeInUp } from "@/lib/motion";
import { EVIDENCE_LEVELS } from "@/lib/constants";
import { featuredStatistics } from "@/data/mock/methodology";

const levelColors: Record<string, string> = {
  direct: "var(--accent-contamination)",
  proxy: "var(--accent-warning)",
  screening: "var(--accent-bio)",
  literature: "var(--accent-water)",
  editorial: "var(--accent-neutral)",
};

export function StatisticsSection() {
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
            The numbers that precede acknowledgment
          </h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-px bg-border rounded-lg overflow-hidden"
        >
          {featuredStatistics.map((stat, i) => {
            const accentColor =
              levelColors[stat.evidenceLevel] || "var(--accent-neutral)";

            return (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="bg-surface p-10 md:p-12"
              >
                <p
                  className="font-serif font-light text-foreground text-[3rem] md:text-[3.5rem]"
                  style={{ letterSpacing: "-0.02em" }}
                >
                  {stat.value}
                </p>
                {/* Accent underline */}
                <div
                  className="mt-3 h-px w-12"
                  style={{ backgroundColor: accentColor }}
                />
                <p className="mt-4 text-sm font-medium text-text-primary">
                  {stat.label}
                </p>
                <p className="mt-2 text-sm text-text-muted leading-[1.7]">
                  {stat.context}
                </p>
                <div className="mt-5 flex items-center justify-between gap-4">
                  <p className="text-xs text-text-muted truncate italic">
                    <span className="not-italic text-text-muted/60 mr-1">
                      source
                    </span>
                    {stat.source}
                  </p>
                  <span className="shrink-0 inline-block text-[10px] uppercase tracking-wider text-text-muted border border-border rounded px-1.5 py-0.5">
                    {EVIDENCE_LEVELS[stat.evidenceLevel].label}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
