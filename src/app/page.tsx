import {canonicalMetadata} from "@/lib/site-url";
export const metadata = canonicalMetadata("/");
// src/app/page.tsx
import { BackgroundPattern } from "@/components/background/BackgroundPattern";
import { AboutPreview } from "@/components/home/AboutPreview";
import { ContactPreview } from "@/components/home/ContactPreview";
import { Hero } from "@/components/home/Hero";
import { PhotoCarousel } from "@/components/home/PhotoCarousel";

export default function HomePage() {
  return (
    <>
      <Hero />
      <BackgroundPattern variant="light">
        <PhotoCarousel />
        <AboutPreview />
        <ContactPreview />
      </BackgroundPattern>
    </>
  );
}