import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { PageContainer } from "@/components/layout/page-container";
import { SiteFooter } from "@/components/layout/site-footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Not Found — DOWNSTREAM",
  description: "The page you were looking for does not exist.",
};

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <PageContainer>
        <div className="relative mx-auto max-w-2xl py-28 text-center md:py-40">
          {/* Atmospheric background */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={{
              background:
                "radial-gradient(ellipse at 50% 40%, var(--accent-water), transparent 65%)",
            }}
          />

          <div className="relative">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-text-muted">
              404 / Off the Map
            </p>

            <h1 className="mt-6 font-serif text-5xl font-light tracking-tight text-foreground md:text-6xl lg:text-7xl">
              Unmapped territory
            </h1>

            <div className="mx-auto mt-8 h-px w-16 bg-gradient-to-r from-transparent via-accent-water/50 to-transparent" />

            <p className="mx-auto mt-8 max-w-md text-base leading-relaxed text-text-secondary">
              The page you were looking for does not exist in this version of
              DOWNSTREAM. It may have moved, been renamed, or never been
              charted in the first place.
            </p>

            <p className="mx-auto mt-3 max-w-md text-xs italic leading-relaxed text-text-muted">
              Absence of a page is not evidence of a missing story — just a
              missing link.
            </p>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/"
                className="group inline-flex items-center gap-2 rounded-sm border border-border px-6 py-3 text-xs uppercase tracking-[0.15em] text-text-secondary transition-all duration-500 hover:border-accent-water/50 hover:text-text-primary hover:shadow-[0_0_20px_-6px_rgba(122,158,181,0.18)]"
              >
                <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
                Return home
              </Link>
              <Link
                href="/explore"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-text-muted transition-colors duration-300 hover:text-text-secondary"
              >
                Open the explorer
              </Link>
            </div>
          </div>
        </div>
      </PageContainer>
      <SiteFooter />
    </>
  );
}
