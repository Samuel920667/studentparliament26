// src/components/layout/Footer.tsx
import Image from "next/image";
import Link from "next/link";
import { CookiePreferencesButton } from "@/components/layout/CookieConsent";
import { NAV_LINKS, SITE_CONFIG, SOCIAL_LINKS } from "@/data/site";
import { cn } from "@/lib/utils";

export interface FooterProps {
  /**
   * Path to the SDP logo or picture inside /public (e.g. "/sdp-logo.png").
   * Leave undefined to display the minimal SDP placeholder.
   */
  logoSrc?: string;
  logoAlt?: string;
}

export function Footer({
  logoSrc,
  logoAlt = "Student Delegatory Parliament",
}: FooterProps) {
  return (
    <footer className="border-t border-white/10 bg-[#0B1F33] text-white">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col justify-between gap-8 border-b border-white/10 pb-8 md:flex-row md:items-center">
          {/* Left: Dedicated Picture / Logo Slot & Minimal Identity */}
          <Link
            href="/"
            className="inline-flex items-center gap-3.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2563EB]"
          >
            <div
              className={cn(
                "relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-[2px]",
                logoSrc
                  ? "bg-transparent"
                  : "border border-white/20 bg-white/5"
              )}
            >
              {logoSrc ? (
                <Image
                  src={logoSrc}
                  alt={logoAlt}
                  fill
                  sizes="48px"
                  className="object-contain"
                />
              ) : (
                <span className="font-display text-sm font-bold tracking-tight text-white">
                  {SITE_CONFIG.shortName}
                </span>
              )}
            </div>

            <div className="flex flex-col">
              <span className="font-display text-sm font-semibold tracking-tight text-white">
                {SITE_CONFIG.fullName}
              </span>
              <span className="font-mono text-[11px] tracking-[0.12em] text-slate-400 uppercase">
                {SITE_CONFIG.institution}
              </span>
            </div>
          </Link>

          {/* Right: Official Route Links + Borderless Instagram Icon */}
          <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
            <nav
              aria-label="Footer navigation"
              className="flex flex-wrap items-center gap-x-7 gap-y-3"
            >
              {NAV_LINKS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="font-mono text-xs font-medium tracking-[0.1em] text-slate-300 uppercase transition-colors duration-150 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/petitions"
                className="font-mono text-xs font-semibold tracking-[0.1em] text-[#60A5FA] uppercase transition-colors duration-150 hover:text-white"
              >
                Draft a Petition
              </Link>
            </nav>

            <a
              href={SOCIAL_LINKS.instagram.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow SDP on Instagram"
              className="inline-flex h-9 w-9 items-center justify-center text-slate-300 transition-colors duration-150 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]"
            >
              <svg
                aria-hidden="true"
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.9"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
          </div>
        </div>

        {/* Bottom Metadata Row + Subtle Game Link */}
        <div className="flex flex-col justify-between gap-3 pt-6 font-mono text-[11px] tracking-[0.1em] text-slate-400 uppercase sm:flex-row sm:items-center">
          <p>
            &copy; {SITE_CONFIG.year} {SITE_CONFIG.fullName}
          </p>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link
              href="/game"
              className="inline-flex items-center gap-1.5 text-slate-300 transition-colors hover:text-[#60A5FA]"
            >
              <span>Study Break: Tic-Tac-Toe</span>
              <span aria-hidden="true">&rarr;</span>
            </Link>
            <CookiePreferencesButton />
            <p>{SITE_CONFIG.session}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
