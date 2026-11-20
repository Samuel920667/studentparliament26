// src/components/background/GridBackground.tsx
import { cn } from "@/lib/utils";

export interface GridBackgroundProps {
  variant?: "light" | "dark";
  className?: string;
}

export function GridBackground({
  variant = "light",
  className,
}: GridBackgroundProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 select-none",
        variant === "dark" ? "sdp-grid-dark" : "sdp-grid-light",
        className
      )}
    />
  );
}