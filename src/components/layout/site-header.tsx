"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { SITE_NAME, NAV_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Thin gradient accent line */}
      <div
        className="h-px w-full opacity-30"
        style={{
          background:
            "linear-gradient(to right, transparent, var(--accent-water), var(--accent-contamination), transparent)",
        }}
      />

      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-4">
            <Link href="/" className="select-none">
              <span className="font-serif text-sm uppercase tracking-[0.3em] text-text-primary">
                {SITE_NAME}
              </span>
            </Link>

            {/* Separator */}
            <span className="hidden h-4 w-px bg-border md:block" />
          </div>

          {/* Desktop navigation */}
          <nav className="hidden items-center gap-8 md:flex">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group relative"
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
                      "absolute -bottom-1 left-0 h-px bg-text-primary transition-all duration-300",
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Mobile hamburger */}
          <button
            className="flex items-center justify-center text-text-secondary md:hidden"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden border-t border-border md:hidden"
            >
              {/* Gradient line at top of mobile menu */}
              <div
                className="h-px w-full opacity-30"
                style={{
                  background:
                    "linear-gradient(to right, transparent, var(--accent-water), var(--accent-contamination), transparent)",
                }}
              />

              <div className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-4">
                {NAV_ITEMS.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-3 py-3 text-xs uppercase tracking-widest transition-colors duration-300",
                        isActive
                          ? "text-text-primary"
                          : "text-text-muted hover:text-text-primary"
                      )}
                    >
                      {/* Left color indicator */}
                      <span
                        className={cn(
                          "h-4 w-0.5 rounded-full transition-colors duration-300",
                          isActive
                            ? "bg-accent-water"
                            : "bg-border group-hover:bg-accent-water"
                        )}
                      />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
