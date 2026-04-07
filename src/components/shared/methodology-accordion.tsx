"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { EvidenceBadge } from "@/components/shared/evidence-badge";
import type { MethodologySection, EvidenceLevel } from "@/types";

const accentBorderColors: Record<EvidenceLevel, string> = {
  direct: "var(--accent-water)",
  proxy: "var(--accent-bio)",
  screening: "var(--accent-warning)",
  literature: "var(--accent-contamination)",
  editorial: "var(--accent-neutral)",
};

interface MethodologyAccordionProps {
  items: MethodologySection[];
  className?: string;
}

export function MethodologyAccordion({
  items,
  className,
}: MethodologyAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className={cn("divide-y divide-border", className)}>
      {items.map((item) => {
        const isOpen = openId === item.id;

        return (
          <div
            key={item.id}
            className={cn(
              "relative transition-colors duration-300",
              isOpen && "bg-surface/30"
            )}
            style={
              isOpen
                ? {
                    borderLeft: `3px solid ${accentBorderColors[item.evidenceType]}`,
                    paddingLeft: "1rem",
                  }
                : { borderLeft: "3px solid transparent", paddingLeft: "1rem" }
            }
          >
            <button
              onClick={() => toggle(item.id)}
              className="flex w-full items-center justify-between gap-4 py-6 text-left"
            >
              <div className="space-y-1">
                <h3 className="font-serif text-lg font-light text-text-primary md:text-xl">
                  {item.title}
                </h3>
                <p className="text-xs text-text-muted">{item.description}</p>
              </div>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="shrink-0"
              >
                <ChevronDown size={16} className="text-text-muted" />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0, filter: "blur(4px)" }}
                  animate={{
                    height: "auto",
                    opacity: 1,
                    filter: "blur(0px)",
                  }}
                  exit={{ height: 0, opacity: 0, filter: "blur(4px)" }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="space-y-5 pb-6 pl-0 md:pl-4">
                    <EvidenceBadge level={item.evidenceType} />

                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <h4 className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-text-secondary">
                          <CheckCircle2
                            size={13}
                            className="text-accent-water"
                          />
                          What it measures
                        </h4>
                        <p className="text-sm leading-relaxed text-text-muted">
                          {item.measures}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-text-secondary">
                          <XCircle
                            size={13}
                            className="text-accent-warning"
                          />
                          What it does not measure
                        </h4>
                        <p className="text-sm leading-relaxed text-text-muted">
                          {item.doesNotMeasure}
                        </p>
                      </div>
                    </div>

                    {item.uncertainties.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-xs uppercase tracking-widest text-text-secondary">
                          Uncertainties
                        </h4>
                        <ul className="space-y-1.5">
                          {item.uncertainties.map((u, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-sm leading-relaxed text-text-muted"
                            >
                              <AlertTriangle
                                size={12}
                                className="mt-[3px] shrink-0 text-accent-warning/70"
                              />
                              {u}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
