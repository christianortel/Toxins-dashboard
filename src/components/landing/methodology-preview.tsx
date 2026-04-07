"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { fadeIn, fadeInUp } from "@/lib/motion";
import { EVIDENCE_LEVELS } from "@/lib/constants";
import type { EvidenceLevel } from "@/types";

const levelColors: Record<EvidenceLevel, string> = {
  direct: "var(--accent-contamination)",
  proxy: "var(--accent-warning)",
  screening: "var(--accent-bio)",
  literature: "var(--accent-water)",
  editorial: "var(--accent-neutral)",
};

export function MethodologyPreview() {
  const levels = Object.entries(EVIDENCE_LEVELS) as [
    EvidenceLevel,
    (typeof EVIDENCE_LEVELS)[EvidenceLevel],
  ][];

  return (
    <section className="relative bg-surface">
      {/* Gradient transition from background to surface */}
      <div
        className="absolute top-0 left-0 right-0 h-24 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, var(--background) 0%, var(--surface) 100%)",
        }}
      />

      <div className="mx-auto max-w-6xl px-6 py-28 md:py-36">
        <motion.div
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="max-w-3xl"
        >
          <h2 className="font-serif text-3xl md:text-4xl font-light text-foreground tracking-tight">
            How to read this project
          </h2>
          <p className="mt-3 text-text-secondary text-lg">
            Every data layer carries an evidence grade
          </p>
          <p className="mt-6 text-text-secondary leading-relaxed">
            Not all data carries the same weight. We grade every data layer by
            the strength of its evidence so you can distinguish a peer-reviewed
            measurement from a screening signal or an editorial observation. This
            transparency is central to the project&apos;s integrity.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-14 flex flex-col gap-3"
        >
          {levels.map(([key, level]) => (
            <div
              key={key}
              className={cn(
                "flex flex-col md:flex-row md:items-center gap-3 md:gap-6",
                "bg-panel border border-border rounded-lg px-6 py-5"
              )}
            >
              {/* Colored left border */}
              <div
                className="hidden md:block w-[3px] self-stretch rounded-full shrink-0"
                style={{ backgroundColor: levelColors[key] }}
              />
              {/* Dot for mobile */}
              <span
                className="block md:hidden w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: levelColors[key] }}
              />
              <p className="text-sm font-medium text-text-primary min-w-[120px] shrink-0">
                {level.label}
              </p>
              <p className="text-sm text-text-muted leading-relaxed">
                {level.description}
              </p>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-14"
        >
          <Link
            href="/methodology"
            className={cn(
              "group inline-flex items-center gap-2.5 px-6 py-3",
              "border border-border rounded-sm",
              "font-sans text-xs uppercase",
              "text-text-secondary",
              "transition-all duration-500 ease-out",
              "hover:border-accent-water/50",
              "hover:text-text-primary",
              "hover:shadow-[0_0_20px_-6px_rgba(122,158,181,0.12)]"
            )}
            style={{ letterSpacing: "0.15em" }}
          >
            Read full methodology
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
