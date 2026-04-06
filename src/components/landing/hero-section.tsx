"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { blurReveal, fadeInUp, fadeIn } from "@/lib/motion";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Subtle radial gradient background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 45%, rgba(30, 30, 36, 0.5) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center max-w-5xl">
        <motion.h1
          variants={blurReveal}
          initial="hidden"
          animate="visible"
          className={cn(
            "font-serif font-light tracking-tight",
            "text-5xl md:text-7xl lg:text-8xl",
            "text-foreground leading-[1.1]"
          )}
        >
          The body lives downstream
          <br />
          of industry.
        </motion.h1>

        <motion.p
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
          className="mt-8 max-w-2xl text-lg md:text-xl text-text-secondary leading-relaxed"
        >
          An investigative mapping of environmental contamination, endocrine
          disruption, and the biological warning signs that precede official
          acknowledgment. We trace the lines between industrial releases and the
          communities that live in their shadow.
        </motion.p>

        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.6 }}
          className="mt-12"
        >
          <Link
            href="/explore"
            className={cn(
              "inline-flex items-center px-8 py-3.5",
              "border border-border rounded-sm",
              "font-sans text-sm tracking-widest uppercase",
              "text-text-primary",
              "transition-all duration-500 ease-out",
              "hover:border-accent-water/60 hover:shadow-[0_0_24px_-6px_rgba(122,158,181,0.15)]",
              "hover:text-foreground"
            )}
          >
            Explore the map
          </Link>
        </motion.div>

        <motion.p
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.9 }}
          className="mt-6 text-sm text-text-muted italic max-w-md"
        >
          This is not a map of certainty. It is a map of warning signs.
        </motion.p>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <ChevronDown className="w-5 h-5 text-text-muted" />
        </motion.div>
      </motion.div>
    </section>
  );
}
