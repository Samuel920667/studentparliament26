// src/app/senators/page.tsx
import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import { canonicalMetadata } from "@/lib/site-url";
import { BackgroundPattern } from "@/components/background/BackgroundPattern";
import { SenatorDirectory } from "@/components/senators/SenatorDirectory";
import { SENATORS_2026_2027, type SenatorRecord } from "@/data/senators";

export const metadata: Metadata = {
  ...canonicalMetadata("/senators"),
  title: "Senator Directory 2026/2027",
  description:
    "Search the 2026/2027 Veritas University Abuja Student Delegatory Parliament Senator Directory by department or name to find your departmental representative.",
};

const IMAGE_EXTENSIONS = /\.(jpe?g|png|webp|avif|gif)$/i;

function normalizeKey(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function loadSenatorsWithPhotos(): readonly SenatorRecord[] {
  const senatorsDir = path.join(process.cwd(), "public", "senators");

  try {
    if (!fs.existsSync(senatorsDir)) {
      return SENATORS_2026_2027;
    }

    const files = fs
      .readdirSync(senatorsDir)
      .filter((file) => IMAGE_EXTENSIONS.test(file));

    if (files.length === 0) {
      return SENATORS_2026_2027;
    }

    const fileEntries = files.map((file) => {
      const stem = path.parse(file).name;
      return {
        file,
        stemLower: stem.toLowerCase().trim(),
        normalized: normalizeKey(stem),
      };
    });

    return SENATORS_2026_2027.map((senator, index) => {
      if (senator.photo) {
        return senator;
      }

      const idNorm = normalizeKey(senator.id);
      const nameNorm = normalizeKey(senator.name);
      const listNumber = String(index + 1);
      const paddedNumber = listNumber.padStart(2, "0");

      const exactMatch = fileEntries.find(
        (entry) =>
          entry.stemLower === senator.id ||
          entry.normalized === idNorm ||
          entry.normalized === nameNorm
      );

      if (exactMatch) {
        return {
          ...senator,
          photo: `/senators/${encodeURIComponent(exactMatch.file)}`,
        };
      }

      const numberedMatch = fileEntries.find(
        (entry) =>
          entry.stemLower === listNumber ||
          entry.stemLower === paddedNumber ||
          entry.normalized === `senator${listNumber}` ||
          entry.normalized === `senator${paddedNumber}` ||
          entry.normalized === `photo${listNumber}` ||
          entry.normalized === `photo${paddedNumber}`
      );

      if (numberedMatch) {
        return {
          ...senator,
          photo: `/senators/${encodeURIComponent(numberedMatch.file)}`,
        };
      }

      const uniqueTokenMatch = fileEntries.find((entry) => {
        if (entry.normalized.length < 4) return false;
        const matchingSenators = SENATORS_2026_2027.filter((candidate) =>
          candidate.name
            .toLowerCase()
            .split(/\s+/)
            .some((part) => normalizeKey(part) === entry.normalized)
        );
        return (
          matchingSenators.length === 1 && matchingSenators[0].id === senator.id
        );
      });

      if (uniqueTokenMatch) {
        return {
          ...senator,
          photo: `/senators/${encodeURIComponent(uniqueTokenMatch.file)}`,
        };
      }

      return senator;
    });
  } catch {
    return SENATORS_2026_2027;
  }
}

export default function SenatorsPage() {
  const senators = loadSenatorsWithPhotos();

  return (
    <>
      <BackgroundPattern
        variant="dark"
        className="border-b border-[#102A43]/30"
      >
        <section className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <h1 className="font-display text-4xl font-bold leading-[1.04] tracking-tight text-white sm:text-5xl lg:text-[3.5rem]">
                Find your departmental{" "}
                <span className="text-[#60A5FA]">Senator.</span>
              </h1>
            </div>

            <div className="lg:col-span-5">
              <p className="border-l-2 border-[#2563EB] pl-5 text-base leading-relaxed text-slate-200 sm:text-lg">
                Search by department or name to connect with your 2026/2027
                Senator Elect in the Student Delegatory Parliament.
              </p>
            </div>
          </div>
        </section>
      </BackgroundPattern>

      <BackgroundPattern variant="light">
        <section className="mx-auto max-w-6xl px-6 py-10 sm:py-14">
          <SenatorDirectory senators={senators} />
        </section>
      </BackgroundPattern>
    </>
  );
}
