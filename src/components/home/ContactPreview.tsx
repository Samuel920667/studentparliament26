// src/components/home/ContactPreview.tsx
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { PhoneIcon, WhatsAppIcon } from "@/components/ui/ContactIcons";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CLERK_OFFICE } from "@/data/site";

export function ContactPreview() {
  const clerk = CLERK_OFFICE.primary;

  return (
    <section className="mx-auto max-w-6xl px-6 pt-4 pb-20 sm:pb-24">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Message Block */}
        <div className="sdp-card flex flex-col justify-between gap-6 p-7 sm:p-10 lg:col-span-7">
          <SectionHeading
            eyebrow="02 — NEED ASSISTANCE?"
            title="We're here to listen."
            description="Contact the Office of the Clerk for enquiries about the Student Delegatory Parliament and the petition drafting process."
          />

          <div>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 border-b-[1.5px] border-[var(--navy)] pb-1 font-display text-sm font-bold tracking-wide text-[var(--navy)] uppercase transition-colors hover:border-[var(--blue)] hover:text-[var(--blue)]"
            >
              <span>Contact the Clerk</span>
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

        {/* Right Direct Clerk Contact Card */}
        <div className="flex flex-col justify-between gap-6 rounded-[2px] border-[1.5px] border-[var(--foreground)] bg-[var(--navy)] p-7 text-white shadow-[4px_4px_0px_0px_#111827] sm:p-10 lg:col-span-5">
          <div className="space-y-4">
            <p className="sdp-eyebrow text-blue-300">OFFICE OF THE CLERK</p>

            <div className="space-y-1 border-l-2 border-[var(--blue)] pl-4">
              <p className="font-display text-xl font-bold text-white">
                {clerk.name}
              </p>
              <p className="font-mono text-xs tracking-[0.08em] text-slate-300 uppercase">
                {clerk.role}
              </p>
              <p className="pt-1 font-mono text-sm font-medium text-white">
                {clerk.phoneDisplay}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
            <Button
              href={clerk.phoneHref}
              variant="outline-dark"
              size="md"
              className="flex-1"
            >
              <PhoneIcon size={15} />
              Call Clerk
            </Button>

            <Button
              href={clerk.whatsappHref}
              external
              variant="primary"
              size="md"
              className="flex-1"
            >
              <WhatsAppIcon size={15} />
              WhatsApp
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}