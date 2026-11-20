import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/ContactIcons";
import { DEBATE_EVENT } from "@/data/debate";
import { CLERK_OFFICE } from "@/data/site";

export const metadata: Metadata = {
  title: `${DEBATE_EVENT.title} | Student Delegatory Parliament`,
  description: `${DEBATE_EVENT.headline} Time: ${DEBATE_EVENT.time}. Venue: ${DEBATE_EVENT.venue}.`,
  openGraph: {
    title: `${DEBATE_EVENT.title}: ${DEBATE_EVENT.headline}`,
    description: `Time: ${DEBATE_EVENT.time} · Venue: ${DEBATE_EVENT.venue}. Tap to register.`,
  },
};

export default function PointOfControversyPage() {
  const clerk = CLERK_OFFICE.primary;

  return (
    <main className="mx-auto max-w-6xl px-6 pt-10 pb-20 sm:pt-14 sm:pb-24">
      {/* Back Link */}
      <div className="mb-8">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 font-mono text-xs font-medium tracking-[0.1em] text-[var(--navy)] uppercase transition-opacity hover:opacity-70"
        >
          <svg
            aria-hidden="true"
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="square"
            className="transition-transform duration-150 group-hover:-translate-x-0.5"
          >
            <path d="M13 8H3" />
            <path d="M7.5 3.5L3 8L7.5 12.5" />
          </svg>
          <span>Back to SDP Portal</span>
        </Link>
      </div>

      {/* Main 12-Column Neo-Brutalist Grid */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Main Block */}
        <div className="sdp-card flex flex-col justify-between gap-8 p-7 sm:p-10 lg:col-span-7">
          <div className="space-y-5">
            <p className="sdp-eyebrow text-slate-600">
              {DEBATE_EVENT.eyebrow} · {DEBATE_EVENT.title.toUpperCase()}
            </p>

            <h1 className="font-display text-4xl leading-[1.05] font-bold tracking-tight text-[var(--navy)] sm:text-5xl">
              {DEBATE_EVENT.headline}
            </h1>

            <p className="max-w-xl text-base leading-relaxed text-slate-700 sm:text-lg">
              {DEBATE_EVENT.description}
            </p>

            {/* Spicy Topics List */}
            <div className="space-y-3 pt-2">
              <p className="font-mono text-xs font-bold tracking-[0.1em] text-[var(--navy)] uppercase">
                ON THE FLOOR:
              </p>

              <ul className="space-y-2.5">
                {DEBATE_EVENT.topics.map((topic) => (
                  <li
                    key={topic}
                    className="flex items-start gap-3 rounded-[2px] border-[1.5px] border-[var(--foreground)] bg-white px-4 py-3 text-sm font-medium text-[var(--navy)] shadow-[3px_3px_0px_0px_#111827] sm:text-base"
                  >
                    <svg
                      aria-hidden="true"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="square"
                      className="mt-1 shrink-0 text-[var(--navy)]"
                    >
                      <path d="M3 8H13" />
                      <path d="M8.5 3.5L13 8L8.5 12.5" />
                    </svg>
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-2">
            <Button
              href={DEBATE_EVENT.formUrl}
              external
              variant="primary"
              size="md"
              className="w-full sm:w-auto"
            >
              <span>Register</span>
              <svg
                aria-hidden="true"
                width="15"
                height="15"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="square"
              >
                <path d="M4.5 11.5L11.5 4.5" />
                <path d="M5.5 4.5H11.5V10.5" />
              </svg>
            </Button>
          </div>
        </div>

        {/* Right Dark Info Card */}
        <div className="flex flex-col justify-between gap-8 rounded-[2px] border-[1.5px] border-[var(--foreground)] bg-[var(--navy)] p-7 text-white shadow-[4px_4px_0px_0px_#111827] sm:p-10 lg:col-span-5">
          <div className="space-y-6">
            <p className="sdp-eyebrow text-slate-300">POINT OF CONTROVERSY</p>

            <div className="space-y-5">
              <div className="space-y-1 border-l-2 border-white pl-4">
                <p className="font-mono text-xs tracking-[0.08em] text-slate-300 uppercase">
                  Time
                </p>
                <p className="font-display text-2xl font-bold text-white">
                  {DEBATE_EVENT.time}
                </p>
              </div>

              <div className="space-y-1 border-l-2 border-white pl-4">
                <p className="font-mono text-xs tracking-[0.08em] text-slate-300 uppercase">
                  Venue
                </p>
                <p className="font-display text-xl font-bold text-white">
                  {DEBATE_EVENT.venue}
                </p>
                <p className="pt-1 font-mono text-xs leading-relaxed text-slate-300">
                  Only registered students get the location.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              href={DEBATE_EVENT.formUrl}
              external
              variant="primary"
              size="md"
              className="w-full"
            >
              <span>Register</span>
              <svg
                aria-hidden="true"
                width="15"
                height="15"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="square"
              >
                <path d="M4.5 11.5L11.5 4.5" />
                <path d="M5.5 4.5H11.5V10.5" />
              </svg>
            </Button>

            <Button
              href={clerk.whatsappHref}
              external
              variant="outline-dark"
              size="md"
              className="w-full"
            >
              <WhatsAppIcon size={15} />
              Ask the Clerk
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}