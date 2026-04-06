"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { staggerContainer, fadeInUp } from "@/lib/motion";
import { EVIDENCE_LEVELS } from "@/lib/constants";
import { featuredStatistics } from "@/data/mock/methodology";

export function StatisticsSection() {
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
            By the numbers
          </h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-px bg-border rounded-lg overflow-hidden"
        >
          {featuredStatistics.map((stat, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              className="bg-surface p-8 md:p-10"
            >
              <p className="font-serif text-4xl md:text-5xl font-light text-foreground tracking-tight">
                {stat.value}
              </p>
              <p className="mt-3 text-sm font-medium text-text-primary">
                {stat.label}
              </p>
              <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                {stat.context}
              </p>
              <div className="mt-5 flex items-center justify-between gap-4">
                <p className="text-xs text-text-muted truncate">
                  {stat.source}
                </p>
                <span className="shrink-0 inline-block text-[10px] uppercase tracking-wider text-text-muted border border-border rounded px-1.5 py-0.5">
                  {EVIDENCE_LEVELS[stat.evidenceLevel].label}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
