// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Inter, Space_Grotesk } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { CookieConsent } from "@/components/layout/CookieConsent";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

/**
 * Drop both logos inside /public and update the filenames below.
 * Example: "/veritas-logo.png" and "/sdp-logo.png".
 */
const VERITAS_LOGO_SRC: string | undefined = "/veritas-logo.png";
const SDP_LOGO_SRC: string | undefined = "/sdp-logo.png";
const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  ...(siteUrl ? {
    metadataBase: new URL(siteUrl),
    openGraph: {
      type: "website",
      siteName: "SDP Portal",
      title: "SDP Portal | Student Delegatory Parliament",
      description: "The Student Delegatory Parliament at Veritas University Abuja: leadership, senators, contacts, and petition drafting.",
      images: [{ url: "/social-preview.png", alt: "Student Delegatory Parliament at Veritas University Abuja" }],
    },
    twitter: {
      card: "summary_large_image",
      images: ["/social-preview.png"],
    },
  } : {}),
  ...(process.env.VERCEL_ENV === "preview" ? { robots: { index: false, follow: false } } : {}),
  title: {
    default: "SDP Portal | Student Delegatory Parliament — Veritas University Abuja",
    template: "%s | SDP Portal — Veritas University Abuja",
  },
  description:
    "Official student petition drafting platform of the Student Delegatory Parliament, Veritas University Abuja. Prepare formal petitions addressed to the Office of the Dean of Student Affairs.",
  keywords: [
    "Veritas University Abuja",
    "Student Delegatory Parliament",
    "SDP Portal",
    "Student Petition",
    "Dean of Student Affairs",
  ],
};

export const viewport: Viewport = {
  themeColor: "#0B1F33",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${spaceGrotesk.variable} ${inter.variable} ${ibmPlexMono.variable}`}
    >
      <body className="flex min-h-screen flex-col bg-[var(--background)] text-[var(--foreground)] antialiased selection:bg-[var(--blue)] selection:text-white">
        <Navbar veritasLogoSrc={VERITAS_LOGO_SRC} logoSrc={SDP_LOGO_SRC} />
        <main className="flex-1">{children}</main>
        <Footer logoSrc={SDP_LOGO_SRC} />
        <CookieConsent />
      </body>
    </html>
  );
}
