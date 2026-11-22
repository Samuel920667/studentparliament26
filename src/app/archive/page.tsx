// src/app/archive/page.tsx
import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import Link from "next/link";
import { LeadershipArchiveView } from "@/components/archive/LeadershipArchiveView";
import { BackgroundPattern } from "@/components/background/BackgroundPattern";
import {
  SDP_ARCHIVE_PRESIDENTS,
  SRA_ARCHIVE_PRESIDENTS,
  type ArchivePresident,
} from "@/data/archive";

export const metadata: Metadata = {
  title: "Leadership Archive",
  description:
    "Official historical record of past and present Presidents of the Student Delegatory Parliament (SDP) and the Student Representative Assembly (SRA) at Veritas University, Abuja.",
};

const IMAGE_EXTENSIONS = /\.(jpe?g|png|webp|avif|gif)$/i;

function normalizeKey(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function attachArchiveAssets(
  records: readonly ArchivePresident[]
): readonly ArchivePresident[] {
  const archiveDir = path.join(process.cwd(), "public", "archive");

  try {
    if (!fs.existsSync(archiveDir)) {
      return records;
    }

    const files = fs
      .readdirSync(archiveDir)
      .filter((file) => IMAGE_EXTENSIONS.test(file));

    if (files.length === 0) {
      return records;
    }

    const allEntries = files.map((file) => {
      const stem = path.parse(file).name;
      const stemLower = stem.toLowerCase().trim();
      const isLogo = /(?:^|[-_\s])logo(?:$|[-_\s])|logo$/i.test(stemLower);
      const baseStem = stemLower.replace(/(?:^|[-_\s])logo(?:$|[-_\s])/g, "");

      return {
        file,
        stemLower,
        normalized: normalizeKey(stem),
        baseNormalized: normalizeKey(baseStem),
        isLogo,
      };
    });

    const portraitEntries = allEntries.filter((entry) => !entry.isLogo);
    const logoEntries = allEntries.filter((entry) => entry.isLogo);

    const sharedSraLogo = logoEntries.find(
      (entry) =>
        entry.stemLower === "sra-logo" || entry.normalized === "sralogo"
    );

    const allRecords = [...SDP_ARCHIVE_PRESIDENTS, ...SRA_ARCHIVE_PRESIDENTS];

    return records.map((record) => {
      const idNorm = normalizeKey(record.id);
      const nameNorm = normalizeKey(record.name);
      const ordinalNorm = normalizeKey(record.ordinal);
      const ordinalDigits = record.ordinal.replace(/[^0-9]/g, "");

      // Match main face portrait (ignores *-logo files)
      let resolvedPhoto = record.photo;

      const exactPortrait = portraitEntries.find(
        (entry) =>
          entry.stemLower === record.id ||
          entry.normalized === idNorm ||
          entry.normalized === nameNorm
      );

      if (exactPortrait) {
        resolvedPhoto = `/archive/${encodeURIComponent(exactPortrait.file)}`;
      } else {
        const tokenPortrait = portraitEntries.find((entry) => {
          if (entry.normalized.length < 4) return false;
          const matches = allRecords.filter((candidate) =>
            candidate.name
              .toLowerCase()
              .split(/\s+/)
              .some((part) => normalizeKey(part) === entry.normalized)
          );
          return matches.length === 1 && matches[0].id === record.id;
        });

        if (tokenPortrait) {
          resolvedPhoto = `/archive/${encodeURIComponent(tokenPortrait.file)}`;
        }
      }

      // Match small header logo (*-logo files)
      let resolvedLogo = record.logo;

      const exactLogo = logoEntries.find(
        (entry) =>
          entry.baseNormalized === idNorm ||
          entry.baseNormalized === nameNorm ||
          (ordinalNorm.length > 0 &&
            (entry.baseNormalized === ordinalNorm ||
              entry.baseNormalized === `sra${ordinalNorm}` ||
              (ordinalDigits.length > 0 &&
                entry.baseNormalized === `sra${ordinalDigits}`)))
      );

      if (exactLogo) {
        resolvedLogo = `/archive/${encodeURIComponent(exactLogo.file)}`;
      } else {
        const tokenLogo = logoEntries.find((entry) => {
          if (entry.baseNormalized.length < 3) return false;
          const matches = allRecords.filter((candidate) =>
            candidate.name
              .toLowerCase()
              .split(/\s+/)
              .some((part) => normalizeKey(part) === entry.baseNormalized)
          );
          return matches.length === 1 && matches[0].id === record.id;
        });

        if (tokenLogo) {
          resolvedLogo = `/archive/${encodeURIComponent(tokenLogo.file)}`;
        } else if (record.arm === "sra" && sharedSraLogo) {
          resolvedLogo = `/archive/${encodeURIComponent(sharedSraLogo.file)}`;
        }
      }

      return {
        ...record,
        photo: resolvedPhoto,
        logo: resolvedLogo,
      };
    });
  } catch {
    return records;
  }
}

export default function LeadershipArchivePage() {
  const sdpPresidents = attachArchiveAssets(SDP_ARCHIVE_PRESIDENTS);
  const sraPresidents = attachArchiveAssets(SRA_ARCHIVE_PRESIDENTS);

  return (
    <>
      {/* Neo-Brutalist Deep Navy Hero */}
      <BackgroundPattern variant="dark" className="border-b-2 border-[#0B1F33]">
        <section className="mx-auto max-w-6xl px-6 py-16 sm:py-22">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end">
            <div className="space-y-5 lg:col-span-7">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="border-2 border-white bg-white px-3 py-1 font-mono text-xs font-extrabold tracking-[0.14em] text-[#0B1F33] uppercase">
                  Official Ledger
                </span>
                <span className="border-2 border-white/35 px-3 py-1 font-mono text-xs font-bold tracking-[0.14em] text-slate-200 uppercase">
                  Veritas University Abuja
                </span>
              </div>

              <h1 className="font-display text-4xl font-extrabold leading-[1.02] tracking-tight text-white sm:text-5xl lg:text-[3.75rem]">
                Leadership Archive.
              </h1>
            </div>

            <div className="space-y-6 lg:col-span-5">
              <div className="border-2 border-white/30 bg-white/5 p-5 shadow-[6px_6px_0px_rgba(255,255,255,0.14)]">
                <p className="text-base leading-relaxed text-slate-100">
                  A permanent record of past and present Presidents of the
                  Student Delegatory Parliament (SDP) and the Student
                  Representative Assembly (SRA).
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/leadership"
                  className="inline-flex items-center justify-center gap-2 border-2 border-white bg-white px-5 py-3 font-mono text-xs font-extrabold tracking-[0.1em] text-[#0B1F33] uppercase shadow-[4px_4px_0px_rgba(255,255,255,0.3)] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_rgba(255,255,255,0.3)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <span>Current Leadership</span>
                  <span aria-hidden="true">&rarr;</span>
                </Link>

                <Link
                  href="/senators"
                  className="inline-flex items-center justify-center border-2 border-white/40 bg-transparent px-5 py-3 font-mono text-xs font-bold tracking-[0.1em] text-white uppercase transition-colors hover:border-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Senator Directory
                </Link>
              </div>
            </div>
          </div>
        </section>
      </BackgroundPattern>

      {/* Main Neo-Brutalist Archive Canvas */}
      <BackgroundPattern variant="light">
        <div className="mx-auto max-w-6xl space-y-16 px-6 py-14 sm:py-18">
          <LeadershipArchiveView
            sdpPresidents={sdpPresidents}
            sraPresidents={sraPresidents}
          />

          {/* Brutalist Closing Ledger Banner */}
          <section className="border-2 border-[#0B1F33] bg-[#0B1F33] p-8 text-white shadow-[8px_8px_0px_#475569] sm:p-10">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
              <div className="space-y-2 lg:col-span-8">
                <span className="inline-block border border-white/40 px-2.5 py-0.5 font-mono text-[11px] font-bold tracking-[0.14em] text-slate-200 uppercase">
                  Continuity of Service
                </span>
                <h2 className="font-display text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                  Explore the 2026/2027 Student Senate.
                </h2>
                <p className="max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
                  Meet the Principal Officers presiding over the 4th Assembly or
                  draft an official student petition through the Parliament.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 lg:col-span-4 lg:justify-end">
                <Link
                  href="/leadership"
                  className="inline-flex items-center justify-center gap-2 border-2 border-white bg-white px-5 py-3 font-mono text-xs font-extrabold tracking-[0.1em] text-[#0B1F33] uppercase transition-colors hover:bg-slate-100"
                >
                  <span>Senate Leadership</span>
                  <span aria-hidden="true">&rarr;</span>
                </Link>

                <Link
                  href="/petitions"
                  className="inline-flex items-center justify-center border-2 border-white/40 px-5 py-3 font-mono text-xs font-bold tracking-[0.1em] text-white uppercase transition-colors hover:border-white hover:bg-white/10"
                >
                  Draft a Petition
                </Link>
              </div>
            </div>
          </section>
        </div>
      </BackgroundPattern>
    </>
  );
}