// src/app/petitions/page.tsx
import type { Metadata } from "next";
import { canonicalMetadata } from "@/lib/site-url";
import { BackgroundPattern } from "@/components/background/BackgroundPattern";
import { PetitionWorkspace } from "@/components/petitions/PetitionWorkspace";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  ...canonicalMetadata("/petitions"),
  title: "Draft a Petition",
  description:
    "Prepare a formal petition addressed to the Office of the Dean of Student Affairs through the Student Delegatory Parliament, Veritas University Abuja.",
};

export default function PetitionsPage() {
  return (
    <>
      {/* Focused Document Tool Header */}
      <BackgroundPattern
        variant="dark"
        className="border-b border-[#102A43]/25"
      >
        <section className="mx-auto max-w-4xl px-6 py-14 sm:py-16">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 font-mono text-xs tracking-[0.14em] text-slate-300 uppercase">
            <span>SDP / PETITION GENERATOR</span>
            <span className="rounded-[2px] border border-white/20 bg-white/5 px-2.5 py-1 text-[11px] text-blue-300">
              DOCUMENT TOOL
            </span>
          </div>

          <SectionHeading
            as="h1"
            variant="dark"
            title="Let's put it in writing."
            description="Provide the necessary details to prepare a formal petition to the Office of the Dean of Student Affairs through the Student Delegatory Parliament."
          />
        </section>
      </BackgroundPattern>

      {/* Petition Workspace */}
      <BackgroundPattern variant="light">
        <section className="mx-auto max-w-4xl px-6 py-10 sm:py-14">
          <PetitionWorkspace />
        </section>
      </BackgroundPattern>
    </>
  );
}
