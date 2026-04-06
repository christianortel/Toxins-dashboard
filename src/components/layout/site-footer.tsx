import Link from "next/link";
import { SITE_NAME, SITE_TAGLINE, NAV_ITEMS } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
          {/* Brand */}
          <div className="space-y-3">
            <Link href="/" className="select-none">
              <span className="font-serif text-sm uppercase tracking-[0.3em] text-text-primary">
                {SITE_NAME}
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-text-muted">
              {SITE_TAGLINE}
            </p>
          </div>

          {/* Links */}
          <nav className="flex flex-col gap-3">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-xs uppercase tracking-widest text-text-secondary transition-opacity duration-300 hover:opacity-100 opacity-70"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-16 border-t border-border pt-6">
          <p className="text-xs text-text-muted">
            &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
