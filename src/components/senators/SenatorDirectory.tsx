// src/components/senators/SenatorDirectory.tsx
"use client";

import { useState } from "react";
import { PhoneIcon, WhatsAppIcon } from "@/components/ui/ContactIcons";
import { ProfileAvatar } from "@/components/ui/ProfileAvatar";
import {
  buildSenatorWhatsAppLink,
  SENATORS_2026_2027,
  type SenatorRecord,
} from "@/data/senators";

export interface SenatorDirectoryProps {
  senators?: readonly SenatorRecord[];
}

export function SenatorDirectory({
  senators = SENATORS_2026_2027,
}: SenatorDirectoryProps) {
  const [query, setQuery] = useState("");
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});
  const normalizedQuery = query.trim().toLowerCase();

  const filteredSenators = senators.filter((senator) =>
    senator.name.toLowerCase().includes(normalizedQuery) ||
    senator.department.toLowerCase().includes(normalizedQuery)
  );

  const toggleContact = (id: string) => {
    setRevealedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="space-y-8">
      {/* Search Bar */}
      <div className="relative">
        <label htmlFor="senator-search" className="sr-only">
          Search by department or name
        </label>

        <svg
          aria-hidden="true"
          width="19"
          height="19"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="square"
          className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-[#0B1F33]"
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="20" y1="20" x2="16.65" y2="16.65" />
        </svg>

        <input
          id="senator-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search department or senator name..."
          className="w-full rounded-[2px] border-[1.5px] border-[#102A43]/25 bg-white py-4 pr-20 pl-12 text-base text-[#111827] placeholder:text-slate-400 shadow-[0_2px_10px_rgba(16,42,67,0.04)] transition-colors focus:border-[#0B1F33] focus:outline-none"
        />

        {query ? (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute top-1/2 right-3 -translate-y-1/2 rounded-[2px] px-2.5 py-1 font-mono text-xs font-semibold tracking-wider text-[#0B1F33] uppercase hover:bg-[#F5F5F0] cursor-pointer"
          >
            Clear
          </button>
        ) : null}
      </div>

      {/* Results Grid */}
      {filteredSenators.length === 0 ? (
        <div className="rounded-[2px] border border-[#102A43]/20 bg-white px-6 py-12 text-center">
          <p className="font-display text-lg font-semibold text-[#102A43]">
            No senator found for &ldquo;{query.trim()}&rdquo;
          </p>
          <button
            type="button"
            onClick={() => setQuery("")}
            className="mt-4 inline-flex items-center justify-center rounded-[2px] bg-[#0B1F33] px-5 py-2.5 font-mono text-xs font-semibold tracking-wider text-white uppercase transition-colors hover:bg-[#102A43] cursor-pointer"
          >
            Show All
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 items-start gap-x-5 gap-y-20 pt-16 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSenators.map((senator) => {
            const isRevealed = Boolean(revealedIds[senator.id]);
            const contactId = `senator-contact-${senator.id}`;

            return (
              <article
                key={senator.id}
                className="relative flex flex-col justify-between gap-5 rounded-[2px] border border-[#102A43]/20 bg-white px-6 pt-14 pb-6 text-center shadow-[0_2px_10px_rgba(16,42,67,0.04)]"
              >
                {/* Overlapping Profile Circle */}
                <ProfileAvatar
                  name={senator.name}
                  photo={senator.photo}
                  fallback="S"
                  textClassName="text-xl text-white"
                  className="absolute -top-14 left-1/2 z-10 flex h-24 w-24 -translate-x-1/2 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-[#0B1F33] shadow-[0_4px_14px_rgba(11,31,51,0.16)] ring-1 ring-[#102A43]/15"
                />

                {/* Senator Name & Department */}
                <div className="space-y-1.5">
                  <h2 className="font-display text-lg font-semibold leading-snug text-[#111827]">
                    {senator.name}
                  </h2>

                  <p className="text-sm font-bold leading-snug text-[#0B1F33]">
                    {senator.department}
                  </p>
                </div>

                {/* Keep the disclosure button mounted so keyboard focus survives toggling. */}
                <div className={isRevealed ? "space-y-3 border-t border-[#102A43]/12 pt-4" : undefined}>
                  <div className={isRevealed ? "flex items-center justify-between gap-2" : undefined}>
                    {isRevealed && (
                      <a
                        href={`tel:${senator.phone}`}
                        className="font-mono text-sm font-semibold text-[#0B1F33] transition-colors hover:text-[#2563EB]"
                      >
                        {senator.phone}
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => toggleContact(senator.id)}
                      aria-expanded={isRevealed}
                      aria-controls={contactId}
                      className={isRevealed
                        ? "font-mono text-[11px] font-semibold tracking-wider text-[#4B5563] uppercase transition-colors hover:text-[#0B1F33] cursor-pointer"
                        : "inline-flex w-full items-center justify-center gap-2 rounded-[2px] bg-[#0B1F33] px-4 py-2.5 font-mono text-xs font-semibold tracking-[0.08em] text-white uppercase transition-colors hover:bg-[#102A43] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]"}
                    >
                      {!isRevealed && <PhoneIcon />}
                      {isRevealed ? "Hide" : "View Contact"}
                    </button>
                  </div>
                  <div id={contactId} hidden={!isRevealed}>
                    <a
                      href={buildSenatorWhatsAppLink(senator)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-[2px] bg-[#0B1F33] px-4 py-2.5 font-mono text-xs font-semibold tracking-[0.08em] text-white uppercase transition-colors hover:bg-[#102A43] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]"
                    >
                      <WhatsAppIcon />
                      WhatsApp
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
