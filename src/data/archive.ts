// src/data/archive.ts
export type GovernanceArm = "sdp" | "sra";

export interface ArchivePresident {
  id: string;
  arm: GovernanceArm;
  armLabel: string;
  ordinal: string;
  session: string;
  name: string;
  title: string;
  tenureNote: string;
  isCurrent?: boolean;
  /**
   * Optional explicit portrait path. Any matching portrait dropped inside
   * /public/archive (e.g. "/archive/ore-adeniran.jpg") is also auto-detected.
   */
  photo?: string;
  /**
   * Optional administration logo path shown in the small header badge
   * beside the session year (e.g. "/archive/ore-adeniran-logo.png").
   */
  logo?: string;
}

export const SDP_ARCHIVE_PRESIDENTS: readonly ArchivePresident[] = [
  {
    id: "bemoh-samson-edet",
    arm: "sdp",
    armLabel: "SDP Senate",
    ordinal: "1ST",
    session: "2023/2024",
    name: "Bemoh Samson Edet",
    title: "1st President of the Senate",
    tenureNote: "Pioneer Senate Presidency",
  },
  {
    id: "stephanie-anadumaka",
    arm: "sdp",
    armLabel: "SDP Senate",
    ordinal: "2ND & 3RD",
    session: "2024/2025 & 2025/2026",
    name: "Stephanie Anadumaka",
    title: "2nd & 3rd President of the Senate",
    tenureNote: "Two Consecutive Terms",
  },
  {
    id: "samuel-peters",
    arm: "sdp",
    armLabel: "SDP Senate",
    ordinal: "4TH",
    session: "2026/2027",
    name: "Samuel Peters",
    title: "4th President of the Senate",
    tenureNote: "Current Presiding Officer",
    isCurrent: true,
    photo: "/senators/samuel-peters.jpg",
  },
];

export const SRA_ARCHIVE_PRESIDENTS: readonly ArchivePresident[] = [
  {
    id: "justin-anazor",
    arm: "sra",
    armLabel: "SRA Executive",
    ordinal: "12TH",
    session: "2024/2025",
    name: "Justin Anazor",
    title: "12th SRA President",
    tenureNote: "Student Representative Assembly",
  },
  {
    id: "kehinde-celeb-oyetade",
    arm: "sra",
    armLabel: "SRA Executive",
    ordinal: "13TH",
    session: "2025/2026",
    name: "Kehinde Celeb Oyetade",
    title: "13th SRA President",
    tenureNote: "Student Representative Assembly",
  },
  {
    id: "ore-adeniran",
    arm: "sra",
    armLabel: "SRA Executive",
    ordinal: "14TH",
    session: "2026/2027",
    name: "Ore Adeniran",
    title: "14th SRA President",
    tenureNote: "Current Executive President",
    isCurrent: true,
  },
];

export function getArchiveInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "VU";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}