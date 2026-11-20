// src/components/ui/SectionHeading.tsx
import { cn } from "@/lib/utils";

export interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  variant?: "light" | "dark";
  as?: "h1" | "h2" | "h3";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  variant = "light",
  as: HeadingTag = "h2",
  className,
}: SectionHeadingProps) {
  const isDark = variant === "dark";

  return (
    <div className={cn("max-w-3xl space-y-3", className)}>
      {eyebrow ? (
        <p
          className={cn(
            "sdp-eyebrow",
            isDark ? "text-blue-300" : "text-[var(--navy)]"
          )}
        >
          {eyebrow}
        </p>
      ) : null}

      <HeadingTag
        className={cn(
          "font-display font-bold leading-[1.05] tracking-tight",
          HeadingTag === "h1"
            ? "text-4xl sm:text-5xl lg:text-6xl"
            : HeadingTag === "h2"
              ? "text-3xl sm:text-4xl"
              : "text-2xl sm:text-3xl",
          isDark ? "text-white" : "text-[var(--navy)]"
        )}
      >
        {title}
      </HeadingTag>

      {description ? (
        <p
          className={cn(
            "max-w-2xl text-base leading-relaxed sm:text-lg",
            isDark ? "text-slate-300" : "text-[var(--muted)]"
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}