// src/components/leadership/LeadershipOrbital.tsx
"use client";

import { useState } from "react";
import { WhatsAppIcon } from "@/components/ui/ContactIcons";
import { ModalPanel, ModalCloseButton } from "@/components/ui/Modal";
import { ProfileAvatar } from "@/components/ui/ProfileAvatar";
import {
  buildOfficerWhatsAppLink,
  PRINCIPAL_OFFICERS,
  SENATE_PRESIDENT,
  type OrbitalSlot,
  type PrincipalOfficer,
} from "@/data/leadership";
import { cn } from "@/lib/utils";

const ORBITAL_SLOT_CLASSES: Record<OrbitalSlot, string> = {
  top: "top-[130px] left-1/2 -translate-x-1/2 -translate-y-1/2",
  "upper-left": "top-[235px] left-[16%] -translate-x-1/2 -translate-y-1/2",
  "upper-right": "top-[235px] left-[84%] -translate-x-1/2 -translate-y-1/2",
  "mid-left": "top-[465px] left-[12%] -translate-x-1/2 -translate-y-1/2",
  "mid-right": "top-[465px] left-[88%] -translate-x-1/2 -translate-y-1/2",
  "lower-left": "top-[715px] left-[28%] -translate-x-1/2 -translate-y-1/2",
  "lower-right": "top-[715px] left-[72%] -translate-x-1/2 -translate-y-1/2",
};

const ORBITAL_SPOKE_ENDPOINTS: readonly { x: number; y: number }[] = [
  { x: 500, y: 130 },
  { x: 160, y: 235 },
  { x: 840, y: 235 },
  { x: 120, y: 465 },
  { x: 880, y: 465 },
  { x: 280, y: 715 },
  { x: 720, y: 715 },
];

function OfficerAvatar({
  officer,
  size = "md",
  inverted = false,
}: {
  officer: PrincipalOfficer;
  size?: "md" | "lg" | "xl";
  inverted?: boolean;
}) {
  const dimensions =
    size === "xl"
      ? "h-28 w-28"
      : size === "lg"
        ? "h-24 w-24"
        : "h-20 w-20";
  const textSize =
    size === "xl" ? "text-2xl" : size === "lg" ? "text-xl" : "text-lg";

  return (
    <ProfileAvatar
      name={officer.name}
      photo={officer.photo}
      textClassName={textSize}
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-full border-4 shadow-[0_6px_18px_rgba(11,31,51,0.18)]",
        inverted
          ? "border-[#0B1F33] bg-white text-[#0B1F33] ring-2 ring-white/80"
          : "border-white bg-[#0B1F33] text-white ring-1 ring-[#102A43]/20",
        dimensions
      )}
    />
  );
}

function PresidentCenterCard({
  officer,
  onSelect,
  className,
}: {
  officer: PrincipalOfficer;
  onSelect: (officer: PrincipalOfficer) => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(officer)}
      aria-haspopup="dialog"
      className={cn(
        "group relative flex w-full flex-col items-center rounded-[2px] border-2 border-[#0B1F33] bg-[#0B1F33] px-6 pt-16 pb-6 text-center text-white shadow-[0_14px_34px_rgba(11,31,51,0.22)] transition-transform duration-150 cursor-pointer hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0B1F33]",
        className
      )}
    >
      <div className="absolute -top-14 left-1/2 -translate-x-1/2">
        <OfficerAvatar
          officer={officer}
          size="xl"
          inverted
        />
      </div>

      <p className="font-mono text-[10px] font-semibold tracking-[0.16em] text-slate-300 uppercase">
        {officer.office}
      </p>

      <h2 className="mt-1.5 font-display text-2xl font-bold leading-tight tracking-tight text-white">
        {officer.name}
      </h2>

      <p className="mt-1 text-xs font-medium tracking-wide text-slate-300">
        {officer.department}
      </p>

      <span className="mt-4 inline-flex items-center gap-1.5 border-t border-white/15 pt-3 font-mono text-[11px] font-semibold tracking-[0.1em] text-white uppercase transition-opacity group-hover:opacity-80">
        View Profile
        <span aria-hidden="true">&rarr;</span>
      </span>
    </button>
  );
}

function OfficerNodeCard({
  officer,
  onSelect,
  className,
}: {
  officer: PrincipalOfficer;
  onSelect: (officer: PrincipalOfficer) => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(officer)}
      aria-haspopup="dialog"
      className={cn(
        "group relative flex w-full flex-col items-center rounded-[2px] border-[1.5px] border-[#102A43]/25 bg-white px-4 pt-12 pb-4 text-center shadow-[0_4px_16px_rgba(11,31,51,0.07)] transition-all duration-150 cursor-pointer hover:border-[#0B1F33] hover:shadow-[0_8px_22px_rgba(11,31,51,0.12)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B1F33]",
        className
      )}
    >
      <div className="absolute -top-10 left-1/2 -translate-x-1/2">
        <OfficerAvatar
          officer={officer}
          size="md"
        />
      </div>

      <p className="font-mono text-[10px] font-semibold leading-snug tracking-[0.12em] text-[#4B5563] uppercase">
        {officer.office}
      </p>

      <h3 className="mt-1 font-display text-base font-bold leading-snug text-[#0B1F33] transition-opacity group-hover:opacity-80">
        {officer.name}
      </h3>

      <p className="mt-0.5 text-xs font-medium text-[#4B5563]">
        {officer.department}
      </p>
    </button>
  );
}

export function LeadershipOrbital() {
  const [selectedOfficer, setSelectedOfficer] =
    useState<PrincipalOfficer | null>(null);

  return (
    <section aria-labelledby="leadership-chamber-heading" className="space-y-8">
      <div className="flex flex-col justify-between gap-4 border-b border-[#102A43]/15 pb-5 sm:flex-row sm:items-end">
        <div className="space-y-1.5">
          <p className="font-mono text-xs font-semibold tracking-[0.14em] text-[#4B5563] uppercase">
            Principal Officers
          </p>
          <h2
            id="leadership-chamber-heading"
            className="font-display text-3xl font-bold tracking-tight text-[#0B1F33] sm:text-4xl"
          >
            Leadership of the Student Senate
          </h2>
        </div>

        <p className="max-w-md text-sm leading-relaxed text-[#4B5563]">
          Select any Principal Officer to view their parliamentary mandate and
          direct contact details.
        </p>
      </div>

      {/* Desktop Symmetrical Chamber Ring (lg and above) */}
      <div className="relative mx-auto hidden h-[860px] w-full max-w-[1060px] lg:block">
        {/* Subtle Architectural Chamber Rings & Radial Spokes */}
        <svg
          aria-hidden="true"
          viewBox="0 0 1000 860"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 h-full w-full"
        >
          <ellipse
            cx="500"
            cy="430"
            rx="375"
            ry="300"
            fill="none"
            stroke="#102A43"
            strokeOpacity="0.14"
            strokeWidth="1.25"
            strokeDasharray="6 6"
          />
          <ellipse
            cx="500"
            cy="430"
            rx="210"
            ry="180"
            fill="none"
            stroke="#102A43"
            strokeOpacity="0.08"
            strokeWidth="1"
          />
          {ORBITAL_SPOKE_ENDPOINTS.map((point, index) => (
            <line
              key={index}
              x1="500"
              y1="430"
              x2={point.x}
              y2={point.y}
              stroke="#102A43"
              strokeOpacity="0.14"
              strokeWidth="1.25"
            />
          ))}
        </svg>

        {/* Centerpiece: President of the Senate */}
        <div className="absolute top-[430px] left-1/2 z-20 w-[264px] -translate-x-1/2 -translate-y-1/2 xl:w-[280px]">
          <PresidentCenterCard
            officer={SENATE_PRESIDENT}
            onSelect={setSelectedOfficer}
          />
        </div>

        {/* Surrounding 7 Principal Officers */}
        {PRINCIPAL_OFFICERS.map((officer) => {
          const slotClass = officer.slot
            ? ORBITAL_SLOT_CLASSES[officer.slot]
            : "";

          return (
            <div
              key={officer.id}
              className={cn(
                "absolute z-10 w-[220px] xl:w-[236px]",
                slotClass
              )}
            >
              <OfficerNodeCard
                officer={officer}
                onSelect={setSelectedOfficer}
              />
            </div>
          );
        })}
      </div>

      {/* Mobile & Tablet Hierarchical Layout (below lg) */}
      <div className="space-y-14 pt-12 lg:hidden">
        <div className="mx-auto max-w-sm">
          <PresidentCenterCard
            officer={SENATE_PRESIDENT}
            onSelect={setSelectedOfficer}
          />
        </div>

        <div className="grid grid-cols-1 gap-x-5 gap-y-16 pt-4 sm:grid-cols-2">
          {PRINCIPAL_OFFICERS.map((officer) => (
            <OfficerNodeCard
              key={officer.id}
              officer={officer}
              onSelect={setSelectedOfficer}
            />
          ))}
        </div>
      </div>

      {/* Officer Profile & Contact Modal */}
      {selectedOfficer ? (
        <ModalPanel
          onClose={() => setSelectedOfficer(null)}
          labelledBy="officer-modal-title"
          className="max-w-md"
          backdropClassName="bg-[#0B1F33]/55"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <OfficerAvatar
                officer={selectedOfficer}
                size="lg"
              />

              <div className="min-w-0 space-y-1">
                <p className="font-mono text-[10px] font-semibold tracking-[0.14em] text-[#4B5563] uppercase">
                  {selectedOfficer.office}
                </p>
                <h3
                  id="officer-modal-title"
                  className="font-display text-xl font-bold leading-snug text-[#0B1F33]"
                >
                  {selectedOfficer.name}
                </h3>
                <p className="text-xs font-semibold text-[#4B5563]">
                  {selectedOfficer.department}
                </p>
              </div>
            </div>

            <ModalCloseButton
              onClose={() => setSelectedOfficer(null)}
              label="Close officer profile"
            />
          </div>

          <div className="mt-5 border-t border-[#102A43]/12 pt-5">
            <p className="border-l-2 border-[#0B1F33] pl-3.5 text-sm leading-relaxed text-[#374151]">
              {selectedOfficer.responsibility}
            </p>
          </div>

          <div className="mt-6 space-y-3 border-t border-[#102A43]/12 pt-5">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-[11px] font-semibold tracking-[0.1em] text-[#4B5563] uppercase">
                Direct Line
              </span>
              <a
                href={`tel:${selectedOfficer.phone}`}
                className="font-mono text-sm font-semibold text-[#0B1F33] transition-opacity hover:opacity-75"
              >
                {selectedOfficer.phone}
              </a>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <a
                href={buildOfficerWhatsAppLink(selectedOfficer)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-[2px] bg-[#0B1F33] px-4 py-2.5 font-mono text-xs font-semibold tracking-[0.08em] text-white uppercase transition-colors hover:bg-[#102A43] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B1F33]"
              >
                <WhatsAppIcon />
                WhatsApp
              </a>
            </div>
          </div>
        </ModalPanel>
      ) : null}
    </section>
  );
}
