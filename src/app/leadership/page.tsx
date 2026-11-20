// src/app/leadership/page.tsx
import type { Metadata } from "next";
import { canonicalMetadata } from "@/lib/site-url";
import Link from "next/link";
import { BackgroundPattern } from "@/components/background/BackgroundPattern";
import { LeadershipOrbital } from "@/components/leadership/LeadershipOrbital";
import { SITE_CONFIG } from "@/data/site";

export const metadata: Metadata = {
  ...canonicalMetadata("/leadership"),
  title: "Parliament Leadership 2026/2027",
  description:
    "Meet the Principal Officers of the 2026/2027 Veritas University Abuja Student Delegatory Parliament led by Senate President Samuel Peters.",
};

export default function LeadershipPage() {
  return (
    <>
      {/* Editorial Deep Navy Hero */}
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
                Parliament Leadership.
              </h1>
            </div>

            <div className="space-y-6 lg:col-span-5">
              <p className="border-l-2 border-white/40 pl-5 text-base leading-relaxed text-slate-200 sm:text-lg">
                The Principal Officers guiding plenary sittings, parliamentary
                order, and student representation in the Student Delegatory
                Parliament of Veritas University, Abuja.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/senators"
                  className="inline-flex items-center justify-center gap-2 rounded-[2px] bg-white px-5 py-3 font-mono text-xs font-semibold tracking-[0.1em] text-[#0B1F33] uppercase transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <span>Full Senator Directory</span>
                  <span aria-hidden="true">&rarr;</span>
                </Link>

                <Link
                  href="/petitions"
                  className="inline-flex items-center justify-center rounded-[2px] border border-white/25 bg-white/5 px-5 py-3 font-mono text-xs font-semibold tracking-[0.1em] text-white uppercase transition-colors hover:border-white/50 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Draft a Petition
                </Link>
              </div>
            </div>
          </div>
        </section>
      </BackgroundPattern>

      {/* Main Orbital Showcase */}
      <BackgroundPattern variant="light">
        <div className="mx-auto max-w-6xl space-y-16 px-6 py-14 sm:py-18">
          <LeadershipOrbital />

          {/* Closing Banner */}
          <section className="rounded-[2px] border border-[#102A43]/25 bg-[#0B1F33] p-8 text-white shadow-[0_4px_18px_rgba(11,31,51,0.1)] sm:p-10">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
              <div className="space-y-2 lg:col-span-8">
                <p className="font-mono text-xs font-semibold tracking-[0.14em] text-slate-300 uppercase">
                  Constituency Representation
                </p>
                <h2 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Looking for your departmental Senator?
                </h2>
                <p className="max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
                  Browse all 21 Senators-Elect by department or name to connect
                  directly with your representative in the Senate.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 lg:col-span-4 lg:justify-end">
                <Link
                  href="/senators"
                  className="inline-flex items-center justify-center gap-2 rounded-[2px] bg-white px-5 py-3 font-mono text-xs font-semibold tracking-[0.1em] text-[#0B1F33] uppercase transition-colors hover:bg-slate-100"
                >
                  <span>View All Senators</span>
                  <span aria-hidden="true">&rarr;</span>
                </Link>

                <Link
                  href="/about"
                  className="inline-flex items-center justify-center rounded-[2px] border border-white/25 bg-white/5 px-5 py-3 font-mono text-xs font-semibold tracking-[0.1em] text-white uppercase transition-colors hover:border-white/50 hover:bg-white/10"
                >
                  Committees
                </Link>
              </div>
            </div>
          </section>
        </div>
      </BackgroundPattern>
    </>
  );
}
