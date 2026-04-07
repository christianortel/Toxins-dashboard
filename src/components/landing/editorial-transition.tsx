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
    <section className="px-6 py-28 md:py-40">
      <motion.div
        variants={blurReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="mx-auto max-w-3xl"
      >
        <div className="relative pl-10 md:pl-16">
          {/* Decorative left border — wider, complex gradient */}
          <div
            className="absolute left-0 top-0 bottom-0 w-[2px]"
            style={{
              background:
                "linear-gradient(to bottom, transparent 0%, var(--accent-water) 25%, var(--accent-bio) 75%, transparent 100%)",
            }}
          />

          <blockquote
            className={cn(
              "font-serif font-light italic",
              "text-[1.6rem] md:text-3xl lg:text-[2.5rem]",
              "leading-[1.45] text-foreground/90"
            )}
            style={{ letterSpacing: "-0.01em" }}
          >
            {quote}
          </blockquote>

          {attribution && (
            <p
              className="mt-8 text-xs text-text-muted italic"
              style={{ letterSpacing: "0.1em", textTransform: "uppercase" }}
            >
              {attribution}
            </p>
          )}
        </div>
      </motion.div>
    </section>
  );
}
