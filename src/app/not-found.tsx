import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-20 text-center sm:py-28">
      <p className="sdp-eyebrow text-[var(--muted)]">404</p>
      <h1 className="mt-3 font-display text-4xl font-bold text-[var(--navy)] sm:text-5xl">
        Page not found
      </h1>
      <p className="mt-4 text-base text-[var(--muted)]">
        This page does not exist on the SDP Portal.
      </p>
      <Button href="/" variant="navy" className="mt-8">Return to Home</Button>
    </section>
  );
}
