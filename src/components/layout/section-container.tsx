"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionContainerProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
}

const titleVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const childrenVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const childItem = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export function SectionContainer({
  children,
  title,
  subtitle,
  className,
}: SectionContainerProps) {
  return (
    <section className={cn("py-16 md:py-24", className)}>
      {(title || subtitle) && (
        <motion.div
          variants={titleVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-12"
        >
          {title && (
            <>
              <h2 className="font-serif text-3xl font-light tracking-tight text-text-primary md:text-4xl">
                {title}
              </h2>
              <div className="mt-4 h-px w-16 bg-gradient-to-r from-accent-water/60 to-transparent" />
            </>
          )}
          {subtitle && (
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-text-secondary">
              {subtitle}
            </p>
          )}
        </motion.div>
      )}

      <motion.div
        variants={childrenVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {children}
      </motion.div>
    </section>
  );
}

/**
 * Wrap direct children of SectionContainer with this component
 * to get the stagger-in animation effect.
 */
export function SectionItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={childItem} className={className}>
      {children}
    </motion.div>
  );
}
