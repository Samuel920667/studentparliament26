// src/components/home/PhotoCarousel.tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { GALLERY_PHOTOS, type GalleryPhoto } from "@/data/gallery";
import { cn } from "@/lib/utils";

export interface PhotoCarouselProps {
  photos?: readonly GalleryPhoto[];
  /**
   * Time in milliseconds between automatic slide transitions.
   * Defaults to 4000ms (4 seconds).
   */
  autoPlayInterval?: number;
}

export function PhotoCarousel({
  photos = GALLERY_PHOTOS,
  autoPlayInterval = 4000,
}: PhotoCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [failedIds, setFailedIds] = useState<Record<string, boolean>>({});

  const totalSlides = photos.length;

  const scrollToSlide = useCallback(
    (index: number) => {
      const track = trackRef.current;
      if (!track || totalSlides === 0) return;

      const wrappedIndex = ((index % totalSlides) + totalSlides) % totalSlides;
      track.scrollTo({
        left: wrappedIndex * track.clientWidth,
        behavior: "smooth",
      });
      setActiveIndex(wrappedIndex);
    },
    [totalSlides]
  );

  // Auto-advance slides when there is more than one photo and user is not interacting
  useEffect(() => {
    if (totalSlides <= 1 || isPaused) return;

    const timer = window.setTimeout(() => {
      scrollToSlide(activeIndex + 1);
    }, autoPlayInterval);

    return () => {
      window.clearTimeout(timer);
    };
  }, [activeIndex, autoPlayInterval, isPaused, scrollToSlide, totalSlides]);

  if (totalSlides === 0) return null;

  const handleScroll = () => {
    const track = trackRef.current;
    if (!track || track.clientWidth === 0) return;

    const nextIndex = Math.round(track.scrollLeft / track.clientWidth);
    const clamped = Math.max(0, Math.min(totalSlides - 1, nextIndex));

    if (clamped !== activeIndex) {
      setActiveIndex(clamped);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      scrollToSlide(activeIndex + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      scrollToSlide(activeIndex - 1);
    }
  };

  return (
    <section
      aria-label="SDP Photo Gallery"
      className="mx-auto max-w-6xl px-6 pt-14 sm:pt-16"
    >
      <div
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onPointerEnter={(event) => {
          if (event.pointerType === "mouse") {
            setIsPaused(true);
          }
        }}
        onPointerLeave={(event) => {
          if (event.pointerType === "mouse") {
            setIsPaused(false);
          }
        }}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
        onTouchCancel={() => setIsPaused(false)}
        className="relative overflow-hidden rounded-[2px] border-[1.5px] border-[#102A43]/25 bg-[#0B1F33] shadow-[0_2px_10px_rgba(16,42,67,0.06)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2563EB]"
      >
        {/* Swipeable / Scroll-Snap Track */}
        <div
          ref={trackRef}
          onScroll={handleScroll}
          className="flex snap-x snap-mandatory items-center overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {photos.map((photo, index) => {
            const hasValidImage = Boolean(photo.src) && !failedIds[photo.id];

            return (
              <div
                key={photo.id}
                className="flex w-full shrink-0 snap-center items-center justify-center bg-[#0B1F33] select-none"
              >
                {hasValidImage && photo.src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    loading={index === 0 ? "eager" : "lazy"}
                    draggable={false}
                    onError={() =>
                      setFailedIds((prev) => ({ ...prev, [photo.id]: true }))
                    }
                    className="block h-auto max-h-[75vh] w-full object-contain"
                  />
                ) : (
                  <div className="flex min-h-[320px] w-full flex-col items-center justify-center gap-3 bg-[#0B1F33] text-slate-300 sm:min-h-[420px]">
                    <svg
                      aria-hidden="true"
                      width="36"
                      height="36"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="square"
                      className="text-slate-400"
                    >
                      <rect x="3" y="4" width="18" height="16" />
                      <circle cx="9" cy="10" r="1.5" />
                      <path d="M21 16L16 11L11 16L8 13L3 18" />
                    </svg>
                    <span className="font-mono text-xs tracking-[0.12em] text-slate-400 uppercase">
                      Photo {index + 1}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Previous Slide Button */}
        {totalSlides > 1 ? (
          <button
            type="button"
            onClick={() => scrollToSlide(activeIndex - 1)}
            aria-label="Previous photo"
            className="absolute top-1/2 left-3 z-10 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-[2px] border border-white/20 bg-[#0B1F33]/80 text-white backdrop-blur-sm transition-colors duration-150 hover:bg-[#0B1F33] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:left-4 sm:h-11 sm:w-11"
          >
            <svg
              aria-hidden="true"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="square"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        ) : null}

        {/* Next Slide Button */}
        {totalSlides > 1 ? (
          <button
            type="button"
            onClick={() => scrollToSlide(activeIndex + 1)}
            aria-label="Next photo"
            className="absolute top-1/2 right-3 z-10 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-[2px] border border-white/20 bg-[#0B1F33]/80 text-white backdrop-blur-sm transition-colors duration-150 hover:bg-[#0B1F33] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:right-4 sm:h-11 sm:w-11"
          >
            <svg
              aria-hidden="true"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="square"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        ) : null}
      </div>

      {/* Slim Slide Indicator Bars */}
      {totalSlides > 1 ? (
        <div
          role="tablist"
          aria-label="Choose a photo"
          className="mt-4 flex items-center justify-center gap-2"
        >
          {photos.map((photo, index) => {
            const active = index === activeIndex;

            return (
              <button
                key={photo.id}
                type="button"
                role="tab"
                aria-selected={active}
                aria-label={`View photo ${index + 1}`}
                onClick={() => scrollToSlide(index)}
                className="py-1.5 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]"
              >
                <span
                  className={cn(
                    "block h-[3px] transition-all duration-200",
                    active
                      ? "w-8 bg-[#0B1F33]"
                      : "w-3.5 bg-[#102A43]/25 hover:bg-[#102A43]/50"
                  )}
                />
              </button>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}