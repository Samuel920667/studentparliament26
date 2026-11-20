// src/components/home/Hero.tsx
import { BackgroundPattern } from "@/components/background/BackgroundPattern";
import { Button } from "@/components/ui/Button";
import { SITE_CONFIG } from "@/data/site";

export function Hero() {
  return (
    <BackgroundPattern
      variant="dark"
      className="border-b border-[#102A43]/30"
    >
      <section className="mx-auto max-w-6xl px-6 py-16 sm:py-22 lg:py-26">
        <div className="max-w-3xl space-y-7">
          <h1 className="font-display text-4xl font-bold leading-[1.03] tracking-tight text-white sm:text-6xl lg:text-[4.25rem]">
            YOUR VOICE.
            <br />
            YOUR RIGHT.
            <br />
            <span className="text-[#60A5FA]">YOUR PARLIAMENT.</span>
          </h1>

          <p className="max-w-xl text-base leading-relaxed text-slate-200 sm:text-lg">
            {SITE_CONFIG.description} Prepare a clear, properly formatted
            formal petition addressed to the Office of the Dean of Student
            Affairs through the SDP in minutes.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Button href="/petitions" variant="primary" size="lg">
              Draft a Petition
              <svg
                aria-hidden="true"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="square"
              >
                <path d="M3 8H13" />
                <path d="M8.5 3.5L13 8L8.5 12.5" />
              </svg>
            </Button>

            <Button href="/about" variant="outline-dark" size="lg">
              About the SDP
            </Button>
          </div>
        </div>
      </section>
    </BackgroundPattern>
  );
}