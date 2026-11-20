// src/components/background/DoodlePattern.tsx
import { useId } from "react";
import { cn } from "@/lib/utils";

export interface DoodlePatternProps {
  variant?: "light" | "dark";
  opacity?: number;
  className?: string;
}

export function DoodlePattern({
  variant = "light",
  opacity,
  className,
}: DoodlePatternProps) {
  const rawId = useId();
  const patternId = `sdp-doodle-pattern-${rawId.replace(/:/g, "")}`;

  const resolvedOpacity = opacity ?? (variant === "dark" ? 0.14 : 0.085);
  const strokeColor =
    variant === "dark"
      ? "var(--navy-doodle-dark, #3B648E)"
      : "var(--navy, #102A43)";

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden select-none",
        className
      )}
    >
      <svg
        className="h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <defs>
          <pattern
            id={patternId}
            width="640"
            height="640"
            patternUnits="userSpaceOnUse"
          >
            <g
              fill="none"
              stroke={strokeColor}
              strokeWidth="1.45"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={resolvedOpacity}
            >
              {/* ==================== ROW 1 ==================== */}

              {/* 1. Gavel */}
              <g transform="translate(28 32) rotate(-18 32 32)">
                <rect x="20" y="10" width="24" height="12" rx="1.5" />
                <line x1="16" y1="8" x2="16" y2="24" />
                <line x1="48" y1="8" x2="48" y2="24" />
                <line x1="32" y1="22" x2="32" y2="50" />
                <line x1="29" y1="50" x2="35" y2="50" />
                <rect x="8" y="48" width="18" height="6" rx="1" />
                <line x1="5" y1="56" x2="29" y2="56" />
              </g>

              {/* 2. Scales of Justice */}
              <g transform="translate(188 22) rotate(7 36 36)">
                <line x1="36" y1="10" x2="36" y2="56" />
                <circle cx="36" cy="8" r="2.5" />
                <line x1="12" y1="18" x2="60" y2="18" />
                {/* Left Pan */}
                <line x1="14" y1="18" x2="6" y2="38" />
                <line x1="14" y1="18" x2="22" y2="38" />
                <path d="M4 38 Q14 48 24 38 Z" />
                {/* Right Pan */}
                <line x1="58" y1="18" x2="50" y2="38" />
                <line x1="58" y1="18" x2="66" y2="38" />
                <path d="M48 38 Q58 48 68 38 Z" />
                {/* Pedestal Base */}
                <path d="M22 56 H50 L54 62 H18 Z" />
              </g>

              {/* 3. Parliament Building */}
              <g transform="translate(362 24) rotate(-5 40 36)">
                <path d="M24 22 A16 14 0 0 1 56 22" />
                <line x1="40" y1="3" x2="40" y2="8" />
                <path d="M40 3 L48 5.5 L40 8" />
                <polygon points="12,30 40,18 68,30" />
                <line x1="10" y1="34" x2="70" y2="34" />
                {/* Facade Columns */}
                <line x1="18" y1="34" x2="18" y2="54" />
                <line x1="29" y1="34" x2="29" y2="54" />
                <line x1="40" y1="34" x2="40" y2="54" />
                <line x1="51" y1="34" x2="51" y2="54" />
                <line x1="62" y1="34" x2="62" y2="54" />
                {/* Steps */}
                <line x1="10" y1="54" x2="70" y2="54" />
                <line x1="6" y1="60" x2="74" y2="60" />
              </g>

              {/* 4. Fountain Pen */}
              <g transform="translate(534 28) rotate(32 32 32)">
                <path d="M32 6 L41 24 L37 34 H27 L23 24 Z" />
                <line x1="32" y1="6" x2="32" y2="20" />
                <circle cx="32" cy="22" r="2" />
                <rect x="26" y="34" width="12" height="5" />
                <path d="M27 39 L29 58 H35 L37 39" />
              </g>

              {/* ==================== ROW 2 ==================== */}

              {/* 5. Open Book */}
              <g transform="translate(26 178) rotate(-8 38 30)">
                <path d="M8 16 Q23 10 38 18 Q53 10 68 16 V50 Q53 44 38 52 Q23 44 8 50 Z" />
                <line x1="38" y1="18" x2="38" y2="52" />
                <line x1="15" y1="24" x2="31" y2="25" />
                <line x1="15" y1="32" x2="31" y2="33" />
                <line x1="15" y1="40" x2="28" y2="41" />
                <line x1="45" y1="25" x2="61" y2="24" />
                <line x1="45" y1="33" x2="61" y2="32" />
                <line x1="45" y1="41" x2="58" y2="40" />
              </g>

              {/* 6. Legislative Document */}
              <g transform="translate(186 168) rotate(10 32 36)">
                <path d="M12 8 H42 L54 20 V62 H12 Z" />
                <path d="M42 8 V20 H54" />
                <line x1="20" y1="26" x2="46" y2="26" />
                <line x1="20" y1="33" x2="46" y2="33" />
                <line x1="20" y1="40" x2="38" y2="40" />
                {/* Official Seal & Ribbons */}
                <circle cx="42" cy="50" r="6" />
                <path d="M39 55 L37 66 L42 63 L47 66 L45 55" />
              </g>

              {/* 7. Microphone */}
              <g transform="translate(342 172) rotate(-14 28 36)">
                <rect x="20" y="8" width="16" height="28" rx="8" />
                <line x1="22" y1="16" x2="34" y2="16" />
                <line x1="20" y1="22" x2="36" y2="22" />
                <line x1="22" y1="28" x2="34" y2="28" />
                <path d="M13 24 V28 A15 15 0 0 0 43 28 V24" />
                <line x1="28" y1="43" x2="28" y2="56" />
                <line x1="16" y1="56" x2="40" y2="56" />
              </g>

              {/* 8. Ballot Box */}
              <g transform="translate(502 168) rotate(8 36 36)">
                <rect x="10" y="28" width="52" height="34" rx="1.5" />
                <line x1="10" y1="38" x2="62" y2="38" />
                <line x1="24" y1="33" x2="48" y2="33" />
                {/* Ballot Slip Entering Slot */}
                <path d="M27 33 L30 10 L48 13 L45 33" />
                <path d="M34 21 L37 24 L43 17" />
              </g>

              {/* ==================== ROW 3 ==================== */}

              {/* 9. Pillars */}
              <g transform="translate(64 328) rotate(9 36 36)">
                <line x1="10" y1="12" x2="62" y2="12" />
                <line x1="12" y1="17" x2="60" y2="17" />
                {/* Left Column */}
                <rect x="16" y="17" width="14" height="4" />
                <line x1="18" y1="21" x2="18" y2="54" />
                <line x1="23" y1="21" x2="23" y2="54" />
                <line x1="28" y1="21" x2="28" y2="54" />
                <rect x="15" y="54" width="16" height="4" />
                {/* Right Column */}
                <rect x="42" y="17" width="14" height="4" />
                <line x1="44" y1="21" x2="44" y2="54" />
                <line x1="49" y1="21" x2="49" y2="54" />
                <line x1="54" y1="21" x2="54" y2="54" />
                <rect x="41" y="54" width="16" height="4" />
                {/* Plinth */}
                <line x1="10" y1="58" x2="62" y2="58" />
                <line x1="8" y1="63" x2="64" y2="63" />
              </g>

              {/* 10. Handshake */}
              <g transform="translate(226 336) rotate(-7 42 28)">
                {/* Left Sleeve */}
                <path d="M6 16 L18 12 L24 32 L12 36 Z" />
                {/* Right Sleeve */}
                <path d="M78 16 L66 12 L60 32 L72 36 Z" />
                {/* Clasped Hands */}
                <path d="M19 16 L33 14 L42 21 L52 15 L65 18" />
                <path d="M23 30 L34 38 Q39 41 44 37 L58 29" />
                <path d="M35 23 L46 31" />
                <path d="M39 20 L51 28" />
                <path d="M44 18 L55 25" />
                <path d="M28 33 Q31 37 35 35" />
              </g>

              {/* Secondary Scatter: Gavel */}
              <g transform="translate(396 330) rotate(22 32 32) scale(0.84)">
                <rect x="20" y="10" width="24" height="12" rx="1.5" />
                <line x1="16" y1="8" x2="16" y2="24" />
                <line x1="48" y1="8" x2="48" y2="24" />
                <line x1="32" y1="22" x2="32" y2="50" />
                <rect x="8" y="48" width="18" height="6" rx="1" />
                <line x1="5" y1="56" x2="29" y2="56" />
              </g>

              {/* Secondary Scatter: Legislative Document */}
              <g transform="translate(534 326) rotate(-12 32 36) scale(0.86)">
                <path d="M12 8 H42 L54 20 V62 H12 Z" />
                <path d="M42 8 V20 H54" />
                <line x1="20" y1="27" x2="45" y2="27" />
                <line x1="20" y1="35" x2="45" y2="35" />
                <line x1="20" y1="43" x2="36" y2="43" />
                <circle cx="42" cy="52" r="5" />
              </g>

              {/* ==================== ROW 4 ==================== */}

              {/* Secondary Scatter: Microphone */}
              <g transform="translate(38 492) rotate(16 28 36) scale(0.85)">
                <rect x="20" y="8" width="16" height="28" rx="8" />
                <line x1="22" y1="16" x2="34" y2="16" />
                <line x1="20" y1="22" x2="36" y2="22" />
                <line x1="22" y1="28" x2="34" y2="28" />
                <path d="M13 24 V28 A15 15 0 0 0 43 28 V24" />
                <line x1="28" y1="43" x2="28" y2="56" />
                <line x1="16" y1="56" x2="40" y2="56" />
              </g>

              {/* Secondary Scatter: Parliament Building */}
              <g transform="translate(178 490) rotate(6 40 36) scale(0.82)">
                <path d="M24 22 A16 14 0 0 1 56 22" />
                <line x1="40" y1="3" x2="40" y2="8" />
                <polygon points="12,30 40,18 68,30" />
                <line x1="10" y1="34" x2="70" y2="34" />
                <line x1="20" y1="34" x2="20" y2="54" />
                <line x1="33" y1="34" x2="33" y2="54" />
                <line x1="47" y1="34" x2="47" y2="54" />
                <line x1="60" y1="34" x2="60" y2="54" />
                <line x1="10" y1="54" x2="70" y2="54" />
                <line x1="6" y1="60" x2="74" y2="60" />
              </g>

              {/* Secondary Scatter: Scales of Justice */}
              <g transform="translate(344 488) rotate(-9 36 36) scale(0.85)">
                <line x1="36" y1="10" x2="36" y2="56" />
                <circle cx="36" cy="8" r="2.5" />
                <line x1="12" y1="18" x2="60" y2="18" />
                <line x1="14" y1="18" x2="6" y2="38" />
                <line x1="14" y1="18" x2="22" y2="38" />
                <path d="M4 38 Q14 48 24 38 Z" />
                <line x1="58" y1="18" x2="50" y2="38" />
                <line x1="58" y1="18" x2="66" y2="38" />
                <path d="M48 38 Q58 48 68 38 Z" />
                <path d="M22 56 H50 L54 62 H18 Z" />
              </g>

              {/* Secondary Scatter: Fountain Pen */}
              <g transform="translate(514 486) rotate(-26 32 32) scale(0.86)">
                <path d="M32 6 L41 24 L37 34 H27 L23 24 Z" />
                <line x1="32" y1="6" x2="32" y2="20" />
                <circle cx="32" cy="22" r="2" />
                <rect x="26" y="34" width="12" height="5" />
                <path d="M27 39 L29 58 H35 L37 39" />
              </g>

              {/* ==================== SUBTLE MICRO-MARKS ==================== */}

              <g transform="translate(132 118) rotate(-12)">
                <path d="M8 2 C3 2 2 6 6 8 L10 10 C14 12 13 17 8 17" />
                <path d="M10 6 C14 7 13 12 9 13 L5 15 C2 16 3 21 8 21" />
              </g>

              <g transform="translate(476 116) rotate(10)">
                <path d="M8 2 C3 2 2 6 6 8 L10 10 C14 12 13 17 8 17" />
                <path d="M10 6 C14 7 13 12 9 13 L5 15 C2 16 3 21 8 21" />
              </g>

              <g transform="translate(310 282)">
                <line x1="0" y1="5" x2="10" y2="5" />
                <line x1="5" y1="0" x2="5" y2="10" />
              </g>

              <g transform="translate(154 446)">
                <line x1="0" y1="5" x2="10" y2="5" />
                <line x1="5" y1="0" x2="5" y2="10" />
              </g>

              <g transform="translate(468 440)">
                <circle cx="5" cy="5" r="3" />
              </g>

              <g transform="translate(292 126)">
                <circle cx="4" cy="4" r="2.5" />
              </g>

              <g transform="translate(598 286)">
                <line x1="0" y1="4" x2="8" y2="4" />
                <line x1="4" y1="0" x2="4" y2="8" />
              </g>
            </g>
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
    </div>
  );
}