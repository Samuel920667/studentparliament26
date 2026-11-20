import {canonicalMetadata} from "@/lib/site-url";
// src/app/contact/page.tsx
import type { Metadata } from "next";
import { BackgroundPattern } from "@/components/background/BackgroundPattern";
import { Button } from "@/components/ui/Button";
import { PhoneIcon, WhatsAppIcon } from "@/components/ui/ContactIcons";
import { CLERK_OFFICE } from "@/data/site";

export const metadata: Metadata = {
  ...canonicalMetadata("/contact"),
  title: "Contact the Office of the Clerk",
  description:
    "Contact the Office of the Clerk of the Student Delegatory Parliament, Veritas University Abuja for enquiries regarding the SDP and petition drafting.",
};

export default function ContactPage() {
  const { primary, deputy } = CLERK_OFFICE;

  return (
    <>
      {/* Page Header (No Square Dot) */}
      <BackgroundPattern
        variant="dark"
        className="border-b border-[#102A43]/25"
      >
        <section className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
          <div className="max-w-3xl space-y-3">
            <p className="font-mono text-xs font-semibold tracking-[0.14em] text-blue-300 uppercase">
              Office of the Clerk
            </p>
            <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
              WE&apos;RE HERE TO HELP.
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
              Contact the Office of the Clerk for enquiries regarding the
              Student Delegatory Parliament and the petition drafting process.
            </p>
          </div>
        </section>
      </BackgroundPattern>

      {/* Contact Details */}
      <BackgroundPattern variant="light">
        <section className="mx-auto max-w-5xl space-y-6 px-6 py-14 sm:py-20">
          {/* Primary Clerk Card */}
          <div className="rounded-[2px] border-[1.5px] border-[#102A43]/25 bg-white p-7 shadow-[0_2px_10px_rgba(16,42,67,0.05)] sm:p-10">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
              <div className="space-y-5 lg:col-span-7">
                <div className="space-y-1">
                  <h2 className="font-display text-3xl font-bold text-[#102A43]">
                    {primary.name}
                  </h2>
                  <p className="font-mono text-xs tracking-[0.1em] text-[#4B5563] uppercase">
                    {primary.role}
                  </p>
                </div>

                <dl className="grid grid-cols-1 gap-4 border-t border-[#102A43]/15 pt-5 sm:grid-cols-2">
                  <div>
                    <dt className="font-mono text-[11px] font-semibold tracking-[0.1em] text-[#4B5563] uppercase">
                      Telephone
                    </dt>
                    <dd className="mt-1 font-mono text-base font-semibold text-[#102A43]">
                      {primary.phoneDisplay}
                    </dd>
                  </div>

                  <div>
                    <dt className="font-mono text-[11px] font-semibold tracking-[0.1em] text-[#4B5563] uppercase">
                      WhatsApp Line
                    </dt>
                    <dd className="mt-1 font-mono text-base font-semibold text-[#102A43]">
                      {primary.phoneDisplay}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Two Rectangular Action Buttons */}
              <div className="flex flex-col gap-3.5 lg:col-span-5">
                <Button
                  href={primary.phoneHref}
                  variant="navy"
                  size="lg"
                  fullWidth
                >
                  <PhoneIcon size={17} />
                  Call the Clerk
                </Button>

                <Button
                  href={primary.whatsappHref}
                  external
                  variant="primary"
                  size="lg"
                  fullWidth
                >
                  <WhatsAppIcon size={17} />
                  WhatsApp the Clerk
                </Button>
              </div>
            </div>
          </div>

          {/* Deputy Clerk Alternate Contact */}
          <div className="flex flex-col justify-between gap-6 rounded-[2px] border-[1.5px] border-[#102A43]/20 bg-white/85 p-6 sm:flex-row sm:items-center sm:px-8">
            <div className="space-y-1">
              <p className="font-mono text-[11px] font-semibold tracking-[0.12em] text-[#4B5563] uppercase">
                {deputy.role}
              </p>
              <p className="font-display text-xl font-bold text-[#102A43]">
                {deputy.name}
              </p>
              <p className="font-mono text-sm text-[#374151]">
                {deputy.phoneDisplay}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button href={deputy.phoneHref} variant="outline" size="sm">
                Call Deputy Clerk
              </Button>
              <Button
                href={deputy.whatsappHref}
                external
                variant="navy"
                size="sm"
              >
                WhatsApp Deputy Clerk
              </Button>
            </div>
          </div>
        </section>
      </BackgroundPattern>
    </>
  );
}