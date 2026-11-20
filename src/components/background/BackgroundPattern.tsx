// src/components/background/BackgroundPattern.tsx
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { GridBackground } from "./GridBackground";
import { DoodlePattern } from "./DoodlePattern";

export interface BackgroundPatternProps {
  children?: ReactNode;
  variant?: "light" | "dark";
  showGrid?: boolean;
  showDoodles?: boolean;
  doodleOpacity?: number;
  className?: string;
  contentClassName?: string;
}

export function BackgroundPattern({
  children,
  variant = "light",
  showGrid = true,
  showDoodles = true,
  doodleOpacity,
  className,
  contentClassName,
}: BackgroundPatternProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden",
        variant === "dark"
          ? "bg-[var(--navy-deep)] text-white"
          : "bg-[var(--background)] text-[var(--foreground)]",
        className
      )}
    >
      {showGrid && <GridBackground variant={variant} />}
      {showDoodles && (
        <DoodlePattern variant={variant} opacity={doodleOpacity} />
      )}

      {children ? (
        <div className={cn("relative z-10", contentClassName)}>{children}</div>
      ) : null}
    </div>
  );
}