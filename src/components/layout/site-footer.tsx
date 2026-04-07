"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE_NAME, SITE_TAGLINE, NAV_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function SiteFooter() {
  const pathname = usePathname();

  return (
    <footer className="border-t border-border bg-background">
      {/* Gradient top accent line */}
      <div
        className="h-px w-full opacity-30"
        style={{
          background:
            "linear-gradient(to right, transparent, var(--accent-water), var(--accent-contamination), transparent)",
        }}
      />

      <div className="mx-auto max-w-7xl px-6 py-20">
        {/* 3-column layout */}
        <div className="grid gap-12 md:grid-cols-3">
          {/* Brand column */}
          <div className="space-y-4">
            <Link href="/" className="select-none">
              <span className="font-serif text-sm uppercase tracking-[0.3em] text-text-primary">
                {SITE_NAME}
              </span>
            </Link>
            <p className="text-xs uppercase tracking-widest text-text-muted">
              An independent investigative project
            </p>
            <p className="max-w-xs text-sm leading-relaxed text-text-muted">
              {SITE_TAGLINE}
            </p>
          </div>

          {/* Navigation column */}
          <div>
            <p className="mb-4 text-xs font-medium uppercase tracking-widest text-text-secondary">
              Navigation
            </p>
            <nav className="flex flex-col gap-3">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group relative w-fit"
                  >
                    <span
                      className={cn(
                        "text-xs uppercase tracking-widest transition-colors duration-300",
                        isActive
                          ? "text-text-primary"
                          : "text-text-muted hover:text-text-primary"
                      )}
                    >
                      {item.label}
                    </span>
                    <span
                      className={cn(
                        "absolute -bottom-0.5 left-0 h-px bg-text-primary transition-all duration-300",
                        isActive ? "w-full" : "w-0 group-hover:w-full"
                      )}
                    />
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Meta / Evidence disclaimer column */}
          <div>
            <p className="mb-4 text-xs font-medium uppercase tracking-widest text-text-secondary">
              About the Data
            </p>
            <p className="text-sm leading-relaxed text-text-muted">
              All data drawn from publicly available sources. This project does
              not establish causation. Evidence levels are clearly labeled
              throughout to distinguish between direct measurements, proxy
              indicators, and editorial observations.
            </p>
          </div>
        </div>

        {/* Horizontal rule */}
        <div className="mt-16">
          <div
            className="h-px w-full opacity-20"
            style={{
              background:
                "linear-gradient(to right, transparent, var(--accent-water), transparent)",
            }}
          />
        </div>

        {/* Copyright */}
        <div className="mt-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-text-muted">
            &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </p>
          <p className="text-xs text-text-muted opacity-60">
            All data drawn from publicly available sources. This project does
            not establish causation.
          </p>
        </div>
      </div>
    </footer>
  );
}
