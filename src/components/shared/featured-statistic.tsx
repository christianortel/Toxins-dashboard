"use client";

import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { EvidenceBadge } from "@/components/shared/evidence-badge";
import type { EvidenceLevel } from "@/types";

interface FeaturedStatisticProps {
  value: string;
  label: string;
  context?: string;
  evidenceLevel?: EvidenceLevel;
  className?: string;
}

export function FeaturedStatistic({
  value,
  label,
  context,
  evidenceLevel,
  className,
}: FeaturedStatisticProps) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      className={cn("relative space-y-2", className)}
    >
      {evidenceLevel && (
        <div className="mb-3">
          <EvidenceBadge level={evidenceLevel} />
        </div>
      )}
      <p className="font-serif text-4xl text-text-primary md:text-5xl">{value}</p>
      <p className="text-sm uppercase tracking-widest text-text-secondary">{label}</p>
      {context && (
        <p className="max-w-xs text-sm leading-relaxed text-text-muted">{context}</p>
      )}
    </motion.div>
  );
}
