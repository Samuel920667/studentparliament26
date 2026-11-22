// src/components/layout/Navbar.tsx
"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS, SITE_CONFIG, SOCIAL_LINKS } from "@/data/site";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/ui/Modal";

export interface NavbarProps {
  /**
   * Path or data URL for the Veritas University logo.
   * Leave undefined to display the minimal VUA logo placeholder.
   */
  veritasLogoSrc?: string;
  /**
   * Path or data URL for the SDP logo.
   * Leave undefined to display the minimal SDP logo placeholder.
   */
  logoSrc?: string;
}

function InstagramIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
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
  );
}

function BrandLogos({
  veritasLogoSrc,
  logoSrc,
}: {
  veritasLogoSrc?: string;
  logoSrc?: string;
}) {
  return (
    <div className="inline-flex items-center gap-3.5 sm:gap-4">
      {/* Veritas University Logo */}
      <div
        className={cn(
          "relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-[2px] transition-opacity duration-150 hover:opacity-90 sm:h-16 sm:w-16",
          veritasLogoSrc
            ? "bg-transparent"
            : "border border-white/20 bg-white/5"
        )}
      >
        {veritasLogoSrc ? (
          <Image
            src={veritasLogoSrc}
            alt="Veritas University Abuja Logo"
            fill
            sizes="(max-width: 640px) 56px, 64px"
            loading="eager"
            decoding="sync"
            className="object-contain"
          />
        ) : (
          <span className="font-display text-sm font-bold tracking-tight text-white">
            VUA
          </span>
        )}
      </div>

      {/* Subtle Divider */}
      <span aria-hidden="true" className="h-9 w-px bg-white/15 sm:h-10" />

      {/* SDP Logo */}
      <div
        className={cn(
          "relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-[2px] transition-opacity duration-150 hover:opacity-90 sm:h-16 sm:w-16",
          logoSrc ? "bg-transparent" : "border border-white/20 bg-white/5"
        )}
      >
        {logoSrc ? (
          <Image
            src={logoSrc}
            alt="Student Delegatory Parliament Logo"
            fill
            sizes="(max-width: 640px) 56px, 64px"
            loading="eager"
            decoding="sync"
            className="object-contain"
          />
        ) : (
          <span className="font-display text-base font-bold tracking-tight text-white">
            {SITE_CONFIG.shortName}
          </span>
        )}
      </div>
    </div>
  );
}

export function Navbar({ veritasLogoSrc, logoSrc }: NavbarProps) {
  const pathname = usePathname();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const menuOpen = menuPath === pathname;
  const closeMenu = () => setMenuPath(null);

  if (menuPath !== null && menuPath !== pathname) setMenuPath(null);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0B1F33]/95 pt-[env(safe-area-inset-top,0px)] backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6 sm:h-[88px]">
          {/* Left: Veritas University Logo + SDP Logo */}
          <Link
            href="/"
            onClick={closeMenu}
            aria-label="SDP Portal Home"
            className="inline-flex items-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2563EB]"
          >
            <BrandLogos
              veritasLogoSrc={veritasLogoSrc}
              logoSrc={logoSrc}
            />
          </Link>

          {/* Right: Borderless Instagram Icon + Uneven Hamburger Icon */}
          <div className="flex items-center gap-4">
            <a
              href={SOCIAL_LINKS.instagram.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow SDP on Instagram"
              className="inline-flex h-10 w-10 items-center justify-center text-white transition-colors duration-150 hover:text-[#60A5FA] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]"
            >
              <InstagramIcon size={21} />
            </a>

            <button
              type="button"
              onClick={(event) => {
                // Safari does not reliably focus buttons when they are tapped.
                event.currentTarget.focus({ preventScroll: true });
                setMenuPath(pathname);
              }}
              aria-expanded={menuOpen}
              aria-controls="sdp-fullscreen-menu"
              aria-label="Open navigation menu"
              className="inline-flex h-10 w-10 items-center justify-center text-white transition-colors duration-150 cursor-pointer hover:text-[#60A5FA] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]"
            >
              <svg
                aria-hidden="true"
                width="24"
                height="16"
                viewBox="0 0 24 16"
                fill="none"
              >
                <rect x="0" y="0" width="24" height="2" fill="currentColor" />
                <rect x="8" y="7" width="16" height="2" fill="currentColor" />
                <rect x="4" y="14" width="20" height="2" fill="currentColor" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Opaque menu surface isolates navigation from the page background. */}
      {menuOpen ? (
        <Modal id="sdp-fullscreen-menu" label="Site navigation" onClose={closeMenu} initialFocusRef={closeButtonRef} className="sdp-navigation-dialog">
          <div className="sdp-navigation-insets flex h-full min-h-0 flex-col overflow-hidden bg-[#0B1F33] text-white">
            {/* Overlay Top Bar */}
            <div className="shrink-0 border-b border-white/10">
              <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6 sm:h-[88px]">
                <Link
                  href="/"
                  onClick={closeMenu}
                  aria-label="SDP Portal Home"
                  className="inline-flex items-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#60A5FA]"
                >
                  <BrandLogos
                    veritasLogoSrc={veritasLogoSrc}
                    logoSrc={logoSrc}
                  />
                </Link>

                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={closeMenu}
                  aria-label="Close navigation menu"
                  className="inline-flex h-10 w-10 items-center justify-center text-white transition-colors duration-150 cursor-pointer hover:text-[#60A5FA] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <svg
                    aria-hidden="true"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="square"
                  >
                    <line x1="5" y1="5" x2="19" y2="19" />
                    <line x1="19" y1="5" x2="5" y2="19" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Clean Full-Screen Navigation List */}
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain [scroll-padding-block:1.5rem]">
              <div className="mx-auto flex min-h-full w-full max-w-6xl flex-col px-6 py-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] sm:py-8 sm:pb-[calc(2rem+env(safe-area-inset-bottom,0px))]">
                <nav
                  aria-label="Full screen navigation"
                  className="mx-auto my-auto flex w-full max-w-xl flex-col"
                >
                  {NAV_LINKS.map((item) => {
                    const active = isActive(item.href);

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={closeMenu}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "group flex min-h-14 items-center justify-between gap-3 border-b border-white/12 py-3 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:py-4 md:py-5",
                          active
                            ? "text-[#60A5FA]"
                            : "text-white/90 hover:text-white"
                        )}
                      >
                        <span className="min-w-0 font-display text-2xl font-semibold tracking-tight sm:text-4xl">
                          {item.label}
                        </span>

                        <svg
                          aria-hidden="true"
                          width="20"
                          height="20"
                          viewBox="0 0 16 16"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.75"
                          strokeLinecap="square"
                          className={cn(
                            "shrink-0 transition-transform duration-150 group-hover:translate-x-1 group-hover:-translate-y-1",
                            active
                              ? "text-[#60A5FA]"
                              : "text-white/40 group-hover:text-white"
                          )}
                        >
                          <path d="M4.5 11.5L11.5 4.5" />
                          <path d="M5.5 4.5H11.5V10.5" />
                        </svg>
                      </Link>
                    );
                  })}

                  <div className="space-y-3 pt-5 sm:space-y-4 sm:pt-8">
                    <Link
                      href="/petitions"
                      onClick={closeMenu}
                      className="inline-flex w-full items-center justify-center gap-2.5 rounded-[2px] bg-[#2563EB] px-6 py-4 font-display text-sm font-semibold tracking-wider text-white uppercase transition-colors duration-150 hover:bg-[#1D4ED8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                      <span>Draft a Petition</span>
                      <svg
                        aria-hidden="true"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="square"
                      >
                        <path d="M3 8H13" />
                        <path d="M8.5 3.5L13 8L8.5 12.5" />
                      </svg>
                    </Link>

                    <a
                      href={SOCIAL_LINKS.instagram.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={closeMenu}
                      className="inline-flex min-h-11 w-full items-center justify-center gap-2.5 py-2 font-mono text-xs font-semibold tracking-[0.12em] text-slate-200 uppercase transition-colors duration-150 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                      <InstagramIcon size={17} />
                      <span>Follow on {SOCIAL_LINKS.instagram.label}</span>
                    </a>
                  </div>
                </nav>
              </div>
            </div>
          </div>
        </Modal>
      ) : null}
    </>
  );
}
