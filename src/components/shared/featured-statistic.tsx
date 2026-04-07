"use client";

import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { EvidenceBadge } from "@/components/shared/evidence-badge";
import type { EvidenceLevel } from "@/types";

const accentColors: Record<EvidenceLevel, string> = {
  direct: "bg-accent-water",
  proxy: "bg-accent-bio",
  screening: "bg-accent-warning",
  literature: "bg-accent-contamination",
  editorial: "bg-accent-neutral",
};

interface FeaturedStatisticProps {
  value: string;
  label: string;
  context?: string;
  source?: string;
  evidenceLevel?: EvidenceLevel;
  className?: string;
}

export function FeaturedStatistic({
  value,
  label,
  context,
  source,
  evidenceLevel,
  className,
}: FeaturedStatisticProps) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      className={cn("relative", className)}
    >
      {evidenceLevel && (
        <div className="mb-3">
          <EvidenceBadge level={evidenceLevel} />
        </div>
      )}
      <p
        className="font-serif text-5xl text-text-primary md:text-6xl"
        style={{ letterSpacing: "-0.03em" }}
      >
        {value}
      </p>

      {/* Decorative accent line */}
      <div
        className={cn(
          "mt-3 h-px w-12",
          evidenceLevel ? accentColors[evidenceLevel] : "bg-accent-water"
        )}
      />

      <p className="mt-5 text-sm uppercase tracking-widest text-text-secondary">
        {label}
      </p>
      {context && (
        <p className="mt-2 max-w-xs text-sm leading-relaxed text-text-muted">
          {context}
        </p>
      )}
      {source && (
        <p className="mt-2 text-xs italic text-text-muted">
          <span className="not-italic text-text-muted/70">Source:</span>{" "}
          {source}
        </p>
      )}
    </motion.div>
  );
}
