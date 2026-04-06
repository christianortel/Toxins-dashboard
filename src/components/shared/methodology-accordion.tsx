"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { EvidenceBadge } from "@/components/shared/evidence-badge";
import type { MethodologySection } from "@/types";

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
          <div key={item.id}>
            <button
              onClick={() => toggle(item.id)}
              className="flex w-full items-center justify-between gap-4 py-5 text-left"
            >
              <div className="space-y-1">
                <h3 className="font-serif text-base text-text-primary md:text-lg">
                  {item.title}
                </h3>
                <p className="text-xs text-text-muted">{item.description}</p>
              </div>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="shrink-0"
              >
                <ChevronDown size={16} className="text-text-muted" />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="space-y-5 pb-6 pl-0 md:pl-4">
                    <EvidenceBadge level={item.evidenceType} />

                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <h4 className="text-xs uppercase tracking-widest text-text-secondary">
                          What it measures
                        </h4>
                        <p className="text-sm leading-relaxed text-text-muted">
                          {item.measures}
                        </p>
                      </div>
                      <div className="space-y-1.5">
                        <h4 className="text-xs uppercase tracking-widest text-text-secondary">
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
                        <ul className="space-y-1">
                          {item.uncertainties.map((u, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-sm leading-relaxed text-text-muted"
                            >
                              <span className="mt-1.5 inline-block h-1 w-1 shrink-0 rounded-full bg-text-muted" />
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
