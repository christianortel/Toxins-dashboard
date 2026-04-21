"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronDown, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { blurReveal, fadeInUp, fadeIn } from "@/lib/motion";
import { HeroGlobe } from "./hero-globe";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Layered atmospheric background — multiple radial gradients */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: [
            // Large central diffused glow
            "radial-gradient(ellipse 90% 70% at 50% 45%, rgba(30, 30, 36, 0.7) 0%, transparent 70%)",
            // Smaller tighter glow, offset slightly
            "radial-gradient(ellipse 45% 40% at 46% 40%, rgba(122, 158, 181, 0.05) 0%, transparent 55%)",
            // Secondary warm accent glow offset right
            "radial-gradient(ellipse 35% 30% at 58% 52%, rgba(30, 30, 36, 0.35) 0%, transparent 50%)",
            // Very faint warm undertone
            "radial-gradient(ellipse 60% 50% at 42% 55%, rgba(160, 140, 110, 0.015) 0%, transparent 60%)",
          ].join(", "),
        }}
      />

      {/* Subtle noise-like texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
          backgroundSize: "256px 256px",
        }}
      />

      {/* Fine grid pattern overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: [
            "repeating-linear-gradient(0deg, transparent, transparent 59px, rgba(255,255,255,0.08) 59px, rgba(255,255,255,0.08) 60px)",
            "repeating-linear-gradient(90deg, transparent, transparent 59px, rgba(255,255,255,0.08) 59px, rgba(255,255,255,0.08) 60px)",
          ].join(", "),
        }}
      />

      {/* 3D globe background */}
      <HeroGlobe />

      <div className="relative z-10 flex flex-col items-center text-center max-w-5xl">
        {/* Headline — imposing, cinematic */}
        <motion.h1
          variants={blurReveal}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            "font-serif font-light",
            "text-[3.2rem] md:text-[5rem] lg:text-[6.5rem]",
            "text-foreground leading-[1.05]"
          )}
          style={{ letterSpacing: "-0.02em" }}
        >
          The body lives downstream
          <br />
          of industry.
        </motion.h1>

        {/* Horizontal divider line */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="my-10 h-px w-24 bg-gradient-to-r from-transparent via-accent-water/40 to-transparent"
        />

        {/* Subtitle */}
        <motion.p
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.6, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-xl text-lg md:text-xl text-text-secondary leading-[1.7]"
        >
          An investigative mapping of environmental contamination, endocrine
          disruption, and the biological warning signs that precede official
          acknowledgment.
        </motion.p>

        {/* CTA button */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          transition={{ delay: 1.0, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12"
        >
          <Link
            href="/explore"
            className={cn(
              "group inline-flex flex-col items-center px-8 py-3.5",
              "border border-border rounded-sm",
              "font-sans text-sm uppercase",
              "text-text-primary",
              "transition-all duration-[600ms] ease-out",
              "hover:border-accent-water/60",
              "hover:shadow-[0_0_30px_-6px_rgba(122,158,181,0.18),inset_0_0_16px_-4px_rgba(122,158,181,0.1)]",
              "hover:text-foreground"
            )}
            style={{ letterSpacing: "0.15em" }}
          >
            <span>Explore the map</span>
            <ArrowDownRight className="w-3.5 h-3.5 mt-1.5 opacity-0 -translate-y-1 group-hover:opacity-50 group-hover:translate-y-0 transition-all duration-500 ease-out" />
          </Link>
        </motion.div>

        {/* Disclaimer */}
        <motion.p
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          transition={{ delay: 1.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 text-xs text-text-muted italic max-w-md"
        >
          This is not a map of certainty. It is a map of warning signs.
        </motion.p>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 1.8, duration: 1.0 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <ChevronDown className="w-4 h-4 text-text-muted" />
        </motion.div>
      </motion.div>
    </section>
  );
}
