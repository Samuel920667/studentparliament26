// src/components/home/AboutPreview.tsx
import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function AboutPreview() {
  return (
    <section className="mx-auto max-w-6xl px-6 pt-16 pb-10 sm:pt-20 sm:pb-12">
      <div className="sdp-card grid grid-cols-1 gap-8 p-7 sm:p-10 lg:grid-cols-12 lg:items-start">
        <div className="lg:col-span-5">
          <SectionHeading
            eyebrow="01 — ABOUT THE SDP"
            title="The legislative voice of the student body."
          />
        </div>

        <div className="space-y-5 lg:col-span-7">
          <p className="text-base leading-relaxed text-[var(--foreground)] sm:text-lg">
            The Student Delegatory Parliament is the legislative arm of the
            Veritas University student body, committed to representation,
            deliberation, and accountability.
          </p>

          <p className="text-sm leading-relaxed text-[var(--muted)] sm:text-base">
            Through structured parliamentary advocacy, the SDP ensures student
            concerns are articulated clearly, documented properly, and routed
            through established university channels.
          </p>

          <div className="pt-2">
            <Link
              href="/about"
              className="group inline-flex items-center gap-2 border-b-[1.5px] border-[var(--navy)] pb-1 font-display text-sm font-bold tracking-wide text-[var(--navy)] uppercase transition-colors hover:border-[var(--blue)] hover:text-[var(--blue)]"
            >
              <span>Learn about the SDP</span>
              <svg
                aria-hidden="true"
                width="15"
                height="15"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="square"
                className="transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              >
                <path d="M4.5 11.5L11.5 4.5" />
                <path d="M5.5 4.5H11.5V10.5" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}