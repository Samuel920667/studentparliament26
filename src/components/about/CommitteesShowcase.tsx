// src/components/about/CommitteesShowcase.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ModalPanel, ModalCloseButton } from "@/components/ui/Modal";
import { ProfileAvatar } from "@/components/ui/ProfileAvatar";
import { STANDING_COMMITTEES, type CommitteeItem, type CommitteeChairperson } from "@/data/committees";

function ChairAvatar({
  chairperson,
  size = "md",
}: {
  chairperson: CommitteeChairperson;
  size?: "md" | "lg";
}) {
  const dimensions = size === "lg" ? "h-14 w-14" : "h-12 w-12";
  const textSize = size === "lg" ? "text-base" : "text-xs";

  return (
    <ProfileAvatar
      name={chairperson.name}
      photo={chairperson.photo}
      textClassName={textSize}
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-[#102A43]/20 bg-[#0B1F33] text-white shadow-[0_2px_8px_rgba(11,31,51,0.14)]",
        dimensions
      )}
    />
  );
}

export function CommitteesShowcase() {
  const [selectedCommittee, setSelectedCommittee] =
    useState<CommitteeItem | null>(null);
  return (
    <section aria-labelledby="committees-heading" className="space-y-8">
      <div className="flex flex-col justify-between gap-4 border-b border-[#102A43]/15 pb-5 sm:flex-row sm:items-end">
        <div className="space-y-1.5">
          <p className="font-mono text-xs font-semibold tracking-[0.14em] text-[#4B5563] uppercase">
            Senate Structure
          </p>
          <h2
            id="committees-heading"
            className="font-display text-3xl font-bold tracking-tight text-[#0B1F33] sm:text-4xl"
          >
            Standing Oversight Committees
          </h2>
        </div>

        <p className="max-w-md text-sm leading-relaxed text-[#4B5563]">
          Select any committee to view its constitutional mandate under the
          Standing House Orders.
        </p>
      </div>

      {/* 5-Card Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-6">
        {STANDING_COMMITTEES.map((committee) => (
          <button
            key={committee.id}
            type="button"
            onClick={() => setSelectedCommittee(committee)}
            aria-haspopup="dialog"
            className={cn(
              "group flex flex-col justify-between rounded-[2px] border-[1.5px] border-[#102A43]/25 bg-white p-6 text-left shadow-[0_2px_10px_rgba(16,42,67,0.05)] transition-colors duration-150 cursor-pointer",
              "hover:border-[#0B1F33]",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B1F33]",
              committee.gridSpan
            )}
          >
            <div className="space-y-3">
              <p className="font-mono text-[11px] font-semibold tracking-[0.12em] text-[#4B5563] uppercase">
                {committee.number} / {committee.focus}
              </p>

              <h3 className="font-display text-xl font-bold tracking-tight text-[#0B1F33] transition-opacity group-hover:opacity-80">
                {committee.name}
              </h3>

              <p className="text-sm leading-relaxed text-[#4B5563]">
                {committee.summary}
              </p>
            </div>

            <div className="mt-6 space-y-5">
              {/* Chairperson Profile Strip (only rendered when assigned) */}
              {committee.chairperson ? (
                <div className="flex items-center gap-3.5 border-t border-[#102A43]/12 pt-4">
                  <ChairAvatar
                    chairperson={committee.chairperson}
                  />

                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-[10px] font-semibold tracking-[0.12em] text-[#4B5563] uppercase">
                      {committee.chairperson.role}
                    </p>
                    <p className="truncate font-display text-sm font-bold text-[#0B1F33]">
                      {committee.chairperson.name}
                    </p>
                    <p className="truncate text-xs text-[#4B5563]">
                      {committee.chairperson.department}
                    </p>
                  </div>
                </div>
              ) : null}

              <span className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold tracking-[0.08em] text-[#0B1F33] uppercase transition-transform group-hover:translate-x-0.5">
                Read details
                <span aria-hidden="true">&rarr;</span>
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Committee Detail Modal */}
      {selectedCommittee ? (
        <ModalPanel
          onClose={() => setSelectedCommittee(null)}
          labelledBy="committee-modal-title"
          className="max-w-lg"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <p className="font-mono text-[11px] font-semibold tracking-[0.12em] text-[#4B5563] uppercase">
                {selectedCommittee.number} / {selectedCommittee.focus}
              </p>
              <h3
                id="committee-modal-title"
                className="font-display text-2xl font-bold tracking-tight text-[#0B1F33]"
              >
                {selectedCommittee.name}
              </h3>
              {selectedCommittee.chairNote ? (
                <p className="text-xs text-[#4B5563]">
                  {selectedCommittee.chairNote}
                </p>
              ) : null}
            </div>

            <ModalCloseButton
              onClose={() => setSelectedCommittee(null)}
              label="Close committee details"
            />
          </div>

          {/* Chairperson Highlight Card Inside Modal (only rendered when assigned) */}
          {selectedCommittee.chairperson ? (
            <div className="mt-5 flex items-center gap-4 rounded-[2px] border border-[#102A43]/15 bg-[#F5F5F0] p-4">
              <ChairAvatar
                chairperson={selectedCommittee.chairperson}
                size="lg"
              />

              <div className="min-w-0">
                <p className="font-mono text-[10px] font-semibold tracking-[0.12em] text-[#4B5563] uppercase">
                  {selectedCommittee.chairperson.role}
                </p>
                <p className="font-display text-base font-bold text-[#0B1F33]">
                  {selectedCommittee.chairperson.name}
                </p>
                <p className="text-xs font-medium text-[#4B5563]">
                  {selectedCommittee.chairperson.department}
                </p>
              </div>
            </div>
          ) : null}

          <div className="mt-5 space-y-5 border-t border-[#102A43]/12 pt-5">
            <p className="text-sm leading-relaxed text-[#1F2937]">
              {selectedCommittee.summary}
            </p>

            <div className="space-y-3">
              {selectedCommittee.mandates.map((item, idx) => (
                <p
                  key={idx}
                  className="border-l-2 border-[#0B1F33] pl-3.5 text-sm leading-relaxed text-[#374151]"
                >
                  {item}
                </p>
              ))}
            </div>
          </div>

          <div className="mt-7 flex items-center justify-between border-t border-[#102A43]/12 pt-5">
            <Link
              href="/petitions"
              onClick={() => setSelectedCommittee(null)}
              className="font-mono text-xs font-semibold tracking-[0.08em] text-[#0B1F33] uppercase transition-opacity hover:opacity-75"
            >
              Draft a petition &rarr;
            </Link>
          </div>
        </ModalPanel>
      ) : null}
    </section>
  );
}
