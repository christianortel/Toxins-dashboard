"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { fadeIn } from "@/lib/motion";
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
    <section className="bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
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
          className="mt-14"
        >
          <div className="flex flex-wrap gap-6 md:gap-10">
            {levels.map(([key, level]) => (
              <div key={key} className="flex items-start gap-3 min-w-[160px]">
                <span
                  className="mt-1.5 block w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: levelColors[key] }}
                />
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    {level.label}
                  </p>
                  <p className="mt-1 text-xs text-text-muted leading-relaxed max-w-[200px]">
                    {level.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
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
            className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors duration-300"
          >
            Read full methodology
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
