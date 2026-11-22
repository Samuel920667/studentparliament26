// src/components/archive/LeadershipArchiveView.tsx
"use client";

import { useEffect, useState } from "react";
import {
  getArchiveInitials,
  SDP_ARCHIVE_PRESIDENTS,
  SRA_ARCHIVE_PRESIDENTS,
  type ArchivePresident,
} from "@/data/archive";
import { cn } from "@/lib/utils";

type ArchiveFilter = "all" | "sdp" | "sra";

export interface LeadershipArchiveViewProps {
  sdpPresidents?: readonly ArchivePresident[];
  sraPresidents?: readonly ArchivePresident[];
}

function ArchiveCard({
  president,
  failedPhoto,
  failedLogo,
  onPhotoError,
  onLogoError,
}: {
  president: ArchivePresident;
  failedPhoto: boolean;
  failedLogo: boolean;
  onPhotoError: (id: string) => void;
  onLogoError: (id: string) => void;
}) {
  const isCurrent = Boolean(president.isCurrent);
  const showPhoto = Boolean(president.photo) && !failedPhoto;
  const showLogoSlot = president.arm === "sra" || Boolean(president.logo);
  const showLogoImage = Boolean(president.logo) && !failedLogo;

  return (
    <article
      className={cn(
        "group flex flex-col justify-between border-2 border-[#0B1F33] transition-all duration-150",
        isCurrent
          ? "bg-[#0B1F33] text-white shadow-[6px_6px_0px_#475569] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_#475569]"
          : "bg-white text-[#0B1F33] shadow-[6px_6px_0px_#0B1F33] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_#0B1F33]"
      )}
    >
      {/* Top Stamp Header Bar: Ordinal on Left, Session Year + Borderless Logo on Right */}
      <div
        className={cn(
          "flex items-center justify-between gap-2 border-b-2 px-4 py-2.5 font-mono text-xs font-bold tracking-[0.1em] uppercase",
          isCurrent
            ? "border-white/25 bg-white/10 text-white"
            : "border-[#0B1F33] bg-[#F5F5F0] text-[#0B1F33]"
        )}
      >
        <span className="inline-flex items-center gap-1.5">
          <span
            className={cn(
              "px-2 py-0.5 text-[11px] font-extrabold tracking-[0.1em]",
              isCurrent
                ? "bg-white text-[#0B1F33]"
                : "bg-[#0B1F33] text-white"
            )}
          >
            {president.ordinal}
          </span>
          {isCurrent ? (
            <span className="border border-white/50 px-1.5 py-0.5 text-[10px] tracking-[0.12em] text-white">
              CURRENT
            </span>
          ) : null}
        </span>

        <div className="flex items-center gap-2.5">
          <span
            className={cn(
              "text-right text-[11px] font-bold tracking-[0.06em]",
              isCurrent ? "text-slate-200" : "text-[#0B1F33]"
            )}
          >
            {president.session}
          </span>

          {showLogoSlot ? (
            <div
              title={`${president.ordinal} Administration Logo`}
              className="flex h-9 w-9 shrink-0 items-center justify-center"
            >
              {showLogoImage && president.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={president.logo}
                  alt={`${president.name} administration logo`}
                  decoding="async"
                  onError={() => onLogoError(president.id)}
                  className="h-full w-full object-contain"
                />
              ) : (
                <span
                  className={cn(
                    "font-mono text-[10px] font-extrabold tracking-tight",
                    isCurrent ? "text-white" : "text-[#0B1F33]"
                  )}
                >
                  SRA
                </span>
              )}
            </div>
          ) : null}
        </div>
      </div>

      {/* Framed Archival Portrait Box */}
      <div className="p-4 pb-0">
        <div
          className={cn(
            "relative aspect-[4/4] w-full overflow-hidden border-2",
            isCurrent
              ? "border-white/30 bg-[#102A43]"
              : "border-[#0B1F33] bg-[#F5F5F0]"
          )}
        >
          {showPhoto && president.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={president.photo}
              alt={`${president.name}, ${president.title}`}
              decoding="async"
              onError={() => onPhotoError(president.id)}
              className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
            />
          ) : (
            <div
              className={cn(
                "flex h-full w-full flex-col items-center justify-center gap-3 p-6 text-center",
                isCurrent
                  ? "bg-[#102A43] text-white"
                  : "bg-[#0B1F33] text-white"
              )}
            >
              <span className="border-2 border-white/30 px-4 py-2 font-display text-4xl font-extrabold tracking-tight text-white">
                {getArchiveInitials(president.name)}
              </span>
              <span className="font-mono text-[10px] font-semibold tracking-[0.18em] text-slate-300 uppercase">
                Archival Record
              </span>
            </div>
          )}

          {/* Bottom Corner Arm Stamp */}
          <span
            className={cn(
              "absolute bottom-0 left-0 border-t-2 border-r-2 px-2.5 py-1 font-mono text-[10px] font-bold tracking-[0.14em] uppercase",
              isCurrent
                ? "border-white/30 bg-[#0B1F33] text-white"
                : "border-[#0B1F33] bg-white text-[#0B1F33]"
            )}
          >
            {president.armLabel}
          </span>
        </div>
      </div>

      {/* Typographic Identity Block */}
      <div className="flex flex-1 flex-col justify-between gap-4 p-4 pt-5">
        <div className="space-y-1.5">
          <h3
            className={cn(
              "font-display text-2xl font-extrabold leading-tight tracking-tight",
              isCurrent ? "text-white" : "text-[#0B1F33]"
            )}
          >
            {president.name}
          </h3>

          <p
            className={cn(
              "text-sm font-bold leading-snug",
              isCurrent ? "text-slate-200" : "text-[#102A43]"
            )}
          >
            {president.title}
          </p>
        </div>

        <div
          className={cn(
            "flex items-center justify-between gap-2 border-t-2 pt-3 font-mono text-[11px] font-semibold tracking-[0.08em] uppercase",
            isCurrent
              ? "border-white/20 text-slate-300"
              : "border-[#0B1F33]/20 text-[#4B5563]"
          )}
        >
          <span>{president.tenureNote}</span>
          <span className={isCurrent ? "text-white" : "text-[#0B1F33]"}>
            VUA
          </span>
        </div>
      </div>
    </article>
  );
}

export function LeadershipArchiveView({
  sdpPresidents = SDP_ARCHIVE_PRESIDENTS,
  sraPresidents = SRA_ARCHIVE_PRESIDENTS,
}: LeadershipArchiveViewProps) {
  const [activeFilter, setActiveFilter] = useState<ArchiveFilter>("all");
  const [failedPhotos, setFailedPhotos] = useState<Record<string, boolean>>({});
  const [failedLogos, setFailedLogos] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setFailedPhotos({});
    setFailedLogos({});
  }, [sdpPresidents, sraPresidents]);

  const markPhotoFailed = (id: string) => {
    setFailedPhotos((prev) => ({
      ...prev,
      [id]: true,
    }));
  };

  const markLogoFailed = (id: string) => {
    setFailedLogos((prev) => ({
      ...prev,
      [id]: true,
    }));
  };

  const showSdp = activeFilter === "all" || activeFilter === "sdp";
  const showSra = activeFilter === "all" || activeFilter === "sra";

  const filterButtons: readonly {
    id: ArchiveFilter;
    label: string;
    mobileLabel: string;
    count: number;
  }[] = [
    {
      id: "all",
      label: "All Archives",
      mobileLabel: "All",
      count: sdpPresidents.length + sraPresidents.length,
    },
    {
      id: "sdp",
      label: "SDP Senate",
      mobileLabel: "SDP",
      count: sdpPresidents.length,
    },
    {
      id: "sra",
      label: "SRA Executive",
      mobileLabel: "SRA",
      count: sraPresidents.length,
    },
  ];

  return (
    <div className="space-y-12 sm:space-y-14">
      {/* Compact Balanced Neo-Brutalist Filter Control Bar */}
      <div className="flex flex-col justify-between gap-3 border-2 border-[#0B1F33] bg-white p-3 shadow-[4px_4px_0px_#0B1F33] sm:flex-row sm:items-center sm:gap-4 sm:p-4 sm:shadow-[5px_5px_0px_#0B1F33]">
        <div className="flex items-baseline justify-between gap-2 sm:block sm:space-y-0.5">
          <p className="font-mono text-[10px] font-bold tracking-[0.14em] text-[#4B5563] uppercase">
            Filter Historical Ledger
          </p>
          <p className="hidden font-display text-base font-bold text-[#0B1F33] sm:block">
            Select Governance Arm
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Filter leadership archive by governance arm"
          className="grid w-full grid-cols-3 gap-2 sm:flex sm:w-auto sm:items-center sm:gap-2.5"
        >
          {filterButtons.map((tab) => {
            const active = activeFilter === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveFilter(tab.id)}
                className={cn(
                  "inline-flex items-center justify-center gap-1.5 border-2 border-[#0B1F33] px-2 py-2 font-mono text-[11px] font-bold tracking-[0.06em] uppercase transition-all duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B1F33] sm:gap-2 sm:px-3.5 sm:py-2 sm:text-xs sm:tracking-[0.1em]",
                  active
                    ? "bg-[#0B1F33] text-white shadow-[2px_2px_0px_#475569] sm:shadow-[3px_3px_0px_#475569]"
                    : "bg-[#F5F5F0] text-[#0B1F33] shadow-[2px_2px_0px_#0B1F33] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#0B1F33] sm:shadow-[3px_3px_0px_#0B1F33] sm:hover:shadow-[2px_2px_0px_#0B1F33]"
                )}
              >
                <span className="sm:hidden">{tab.mobileLabel}</span>
                <span className="hidden sm:inline">{tab.label}</span>
                <span
                  className={cn(
                    "px-1 py-0.5 text-[9px] font-extrabold sm:px-1.5 sm:text-[10px]",
                    active
                      ? "bg-white text-[#0B1F33]"
                      : "bg-[#0B1F33] text-white"
                  )}
                >
                  {String(tab.count).padStart(2, "0")}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Section 01: SDP Senate Presidents */}
      {showSdp ? (
        <section aria-labelledby="sdp-archive-heading" className="space-y-8">
          <div className="flex flex-col justify-between gap-4 border-b-2 border-[#0B1F33] pb-5 sm:flex-row sm:items-end">
            <div className="space-y-2">
              <span className="inline-block border-2 border-[#0B1F33] bg-[#0B1F33] px-3 py-1 font-mono text-[11px] font-bold tracking-[0.14em] text-white uppercase">
                01 / Legislative Arm
              </span>
              <h2
                id="sdp-archive-heading"
                className="font-display text-3xl font-extrabold tracking-tight text-[#0B1F33] sm:text-4xl"
              >
                Student Delegatory Parliament (SDP)
              </h2>
            </div>

            <p className="max-w-sm font-mono text-xs font-semibold leading-relaxed tracking-[0.04em] text-[#4B5563] uppercase">
              Presidents of the Student Senate from the pioneer sitting to the
              4th Assembly.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {sdpPresidents.map((president) => (
              <ArchiveCard
                key={president.id}
                president={president}
                failedPhoto={Boolean(failedPhotos[president.id])}
                failedLogo={Boolean(failedLogos[president.id])}
                onPhotoError={markPhotoFailed}
                onLogoError={markLogoFailed}
              />
            ))}
          </div>
        </section>
      ) : null}

      {/* Section 02: SRA Executive Presidents */}
      {showSra ? (
        <section aria-labelledby="sra-archive-heading" className="space-y-8">
          <div className="flex flex-col justify-between gap-4 border-b-2 border-[#0B1F33] pb-5 sm:flex-row sm:items-end">
            <div className="space-y-2">
              <span className="inline-block border-2 border-[#0B1F33] bg-[#0B1F33] px-3 py-1 font-mono text-[11px] font-bold tracking-[0.14em] text-white uppercase">
                02 / Executive Arm
              </span>
              <h2
                id="sra-archive-heading"
                className="font-display text-3xl font-extrabold tracking-tight text-[#0B1F33] sm:text-4xl"
              >
                Student Representative Assembly (SRA)
              </h2>
            </div>

            <p className="max-w-sm font-mono text-xs font-semibold leading-relaxed tracking-[0.04em] text-[#4B5563] uppercase">
              Recorded Presidents of the Student Representative Assembly from
              the 12th to 14th Administration.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {sraPresidents.map((president) => (
              <ArchiveCard
                key={president.id}
                president={president}
                failedPhoto={Boolean(failedPhotos[president.id])}
                failedLogo={Boolean(failedLogos[president.id])}
                onPhotoError={markPhotoFailed}
                onLogoError={markLogoFailed}
              />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}