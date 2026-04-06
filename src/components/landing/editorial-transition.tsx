"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { blurReveal } from "@/lib/motion";

interface EditorialTransitionProps {
  quote: string;
  attribution?: string;
}

export function EditorialTransition({
  quote,
  attribution,
}: EditorialTransitionProps) {
  return (
    <section className="px-6 py-24 md:py-32">
      <motion.div
        variants={blurReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="mx-auto max-w-3xl"
      >
        <div className="relative pl-8 md:pl-12">
          {/* Decorative left border */}
          <div
            className="absolute left-0 top-0 bottom-0 w-px"
            style={{
              background:
                "linear-gradient(to bottom, transparent, var(--accent-water), transparent)",
            }}
          />

          <blockquote className="font-serif text-2xl md:text-3xl lg:text-4xl font-light italic leading-[1.4] text-foreground/90">
            {quote}
          </blockquote>

          {attribution && (
            <p className="mt-6 text-sm text-text-muted tracking-wide">
              {attribution}
            </p>
          )}
        </div>
      </motion.div>
    </section>
  );
}
