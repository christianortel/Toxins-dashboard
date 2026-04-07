"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { staggerContainer, fadeInUp } from "@/lib/motion";
import { LAYER_GROUPS, EVIDENCE_LEVELS } from "@/lib/constants";
import { mockCaseStudies } from "@/data/mock/case-studies";
import type { LayerGroupId } from "@/types";

function getGroupColor(id: LayerGroupId): string {
  return LAYER_GROUPS[id].color;
}

export function FeaturedCaseStudies() {
  const studies = mockCaseStudies.slice(0, 3);

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
            Investigations
          </h2>
          <p className="mt-4 text-text-secondary max-w-2xl leading-relaxed">
            Where contamination, biology, and policy converge
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {studies.map((study) => {
            const primaryColor = getGroupColor(study.layerGroups[0]);

            return (
              <motion.article key={study.slug} variants={fadeInUp}>
                <Link
                  href={`/case-studies/${study.slug}`}
                  className={cn(
                    "group block bg-surface border border-border rounded-lg overflow-hidden",
                    "transition-all duration-500 hover:border-border/70 h-full"
                  )}
                  style={
                    {
                      "--card-color": primaryColor,
                    } as React.CSSProperties
                  }
                >
                  {/* Colored top bar */}
                  <div
                    className="h-[3px] w-full transition-shadow duration-500 group-hover:shadow-[0_2px_16px_-2px_var(--card-color)]"
                    style={{ backgroundColor: primaryColor }}
                  />

                  <div className="p-8 flex flex-col h-full">
                    <h3 className="font-serif text-2xl font-light text-foreground/90 group-hover:text-foreground transition-colors duration-300">
                      {study.title}
                    </h3>
                    <p className="mt-3 text-sm text-text-secondary leading-relaxed">
                      {study.subtitle}
                    </p>
                    <p className="mt-3 text-xs text-text-muted">
                      {study.location}
                    </p>

                    {/* Layer group chips */}
                    <div className="mt-5 flex flex-wrap gap-2">
                      {study.layerGroups.map((groupId) => (
                        <span
                          key={groupId}
                          className="inline-flex items-center gap-1.5 text-xs text-text-muted"
                        >
                          <span
                            className="block w-1.5 h-1.5 rounded-full"
                            style={{
                              backgroundColor: getGroupColor(groupId),
                            }}
                          />
                          {LAYER_GROUPS[groupId].label}
                        </span>
                      ))}
                    </div>

                    {/* Evidence badge and Read label */}
                    <div className="mt-auto pt-6 flex items-center justify-between">
                      <span className="inline-block text-[11px] uppercase tracking-wider text-text-muted border border-border rounded px-2 py-0.5">
                        {EVIDENCE_LEVELS[study.evidenceLevel].label}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-xs text-text-muted opacity-0 translate-x-[-4px] group-hover:opacity-70 group-hover:translate-x-0 transition-all duration-400">
                        Read
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.article>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-14 flex flex-col items-center gap-5"
        >
          {/* Subtle horizontal line */}
          <div className="h-px w-16 bg-border" />
          <Link
            href="/case-studies"
            className="group inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors duration-300"
          >
            View all investigations
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
