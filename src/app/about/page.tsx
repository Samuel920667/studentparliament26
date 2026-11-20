// src/app/about/page.tsx
import type { Metadata } from "next";
import { canonicalMetadata } from "@/lib/site-url";
import Link from "next/link";
import { BackgroundPattern } from "@/components/background/BackgroundPattern";
import { CommitteesShowcase } from "@/components/about/CommitteesShowcase";
import { SITE_CONFIG } from "@/data/site";

export const metadata: Metadata = {
  ...canonicalMetadata("/about"),
  title: "About the SDP",
  description:
    "Learn about the Student Delegatory Parliament (Student Senate) of Veritas University Abuja, its constitutional responsibilities, and its Standing Oversight Committees.",
};

const PARLIAMENTARY_PILLARS = [
  {
    number: "01",
    label: "Representation",
    title: "Departmental Voice",
    description:
      "Each academic department elects a Senator to bring student concerns, welfare requests, and academic feedback directly to the Senate floor.",
  },
  {
    number: "02",
    label: "Oversight",
    title: "Accountable Governance",
    description:
      "Through five standing committees, the Senate scrutinizes student budgets, monitors campus sanitation and healthcare, and safeguards student rights.",
  },
  {
    number: "03",
    label: "Advocacy",
    title: "Structured Petitioning",
    description:
      "Formal petitions drafted through the SDP are reviewed, documented, and channeled properly to the Office of the Dean of Student Affairs.",
  },
] as const;

export default function AboutPage() {
  return (
    <>
      {/* Editorial Deep Navy Hero matching the Homepage */}
      <BackgroundPattern
        variant="dark"
        className="border-b border-[#102A43]/30"
      >
        <section className="mx-auto max-w-6xl px-6 py-16 sm:py-22">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end">
            <div className="space-y-5 lg:col-span-7">
              <p className="font-mono text-xs font-semibold tracking-[0.14em] text-slate-300 uppercase">
                {SITE_CONFIG.session}
              </p>

              <h1 className="font-display text-4xl font-bold leading-[1.03] tracking-tight text-white sm:text-5xl lg:text-[3.5rem]">
                The Student Senate of Veritas University.
              </h1>
            </div>

            <div className="space-y-6 lg:col-span-5">
              <p className="border-l-2 border-white/40 pl-5 text-base leading-relaxed text-slate-200 sm:text-lg">
                The Student Delegatory Parliament (SDP) serves as the
                legislative and oversight arm of student governance, ensuring
                every constituency is represented with transparency and
                integrity.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/petitions"
                  className="inline-flex items-center justify-center gap-2 rounded-[2px] bg-white px-5 py-3 font-mono text-xs font-semibold tracking-[0.1em] text-[#0B1F33] uppercase transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <span>Draft a Petition</span>
                  <span aria-hidden="true">&rarr;</span>
                </Link>

                <Link
                  href="/senators"
                  className="inline-flex items-center justify-center rounded-[2px] border border-white/25 bg-white/5 px-5 py-3 font-mono text-xs font-semibold tracking-[0.1em] text-white uppercase transition-colors hover:border-white/50 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Meet Your Senators
                </Link>
              </div>
            </div>
          </div>
        </section>
      </BackgroundPattern>

      {/* Light Editorial Body */}
      <BackgroundPattern variant="light">
        <div className="mx-auto max-w-6xl space-y-16 px-6 py-14 sm:space-y-20 sm:py-18">
          {/* Core Constitutional Pillars */}
          <section aria-labelledby="mandate-heading" className="space-y-8">
            <div className="flex flex-col justify-between gap-4 border-b border-[#102A43]/15 pb-5 sm:flex-row sm:items-end">
              <div className="space-y-1.5">
                <p className="font-mono text-xs font-semibold tracking-[0.14em] text-[#4B5563] uppercase">
                  Constitutional Mandate
                </p>
                <h2
                  id="mandate-heading"
                  className="font-display text-3xl font-bold tracking-tight text-[#0B1F33] sm:text-4xl"
                >
                  What the Parliament Does
                </h2>
              </div>

              <p className="max-w-md text-sm leading-relaxed text-[#4B5563]">
                Acting as the Student Senate, the SDP bridges students, the
                Student Representative Assembly (SRA), and university
                management.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {PARLIAMENTARY_PILLARS.map((pillar) => (
                <article
                  key={pillar.number}
                  className="flex flex-col justify-between rounded-[2px] border-[1.5px] border-[#102A43]/25 bg-white p-6 shadow-[0_2px_10px_rgba(16,42,67,0.05)]"
                >
                  <div className="space-y-3">
                    <p className="font-mono text-[11px] font-semibold tracking-[0.12em] text-[#4B5563] uppercase">
                      {pillar.number} / {pillar.label}
                    </p>
                    <h3 className="font-display text-xl font-bold tracking-tight text-[#0B1F33]">
                      {pillar.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-[#4B5563]">
                      {pillar.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Standing Oversight Committees with Chairperson Profiles */}
          <CommitteesShowcase />

          {/* Closing Editorial CTA Panel */}
          <section className="rounded-[2px] border border-[#102A43]/25 bg-[#0B1F33] p-8 text-white shadow-[0_4px_18px_rgba(11,31,51,0.1)] sm:p-10">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
              <div className="space-y-2 lg:col-span-8">
                <p className="font-mono text-xs font-semibold tracking-[0.14em] text-slate-300 uppercase">
                  Take Action
                </p>
                <h2 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Have a welfare, health, or academic concern?
                </h2>
                <p className="max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
                  Prepare a formal student petition addressed through the Student
                  Delegatory Parliament or contact your departmental Senator
                  directly.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 lg:col-span-4 lg:justify-end">
                <Link
                  href="/petitions"
                  className="inline-flex items-center justify-center gap-2 rounded-[2px] bg-white px-5 py-3 font-mono text-xs font-semibold tracking-[0.1em] text-[#0B1F33] uppercase transition-colors hover:bg-slate-100"
                >
                  <span>Draft a Petition</span>
                  <span aria-hidden="true">&rarr;</span>
                </Link>

                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-[2px] border border-white/25 bg-white/5 px-5 py-3 font-mono text-xs font-semibold tracking-[0.1em] text-white uppercase transition-colors hover:border-white/50 hover:bg-white/10"
                >
                  Contact Clerk
                </Link>
              </div>
            </div>
          </section>
        </div>
      </BackgroundPattern>
    </>
  );
}
