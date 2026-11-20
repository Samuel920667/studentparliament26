// src/lib/utils.ts
export type ClassValue = string | number | boolean | null | undefined;

export function getInitials(name: string, fallback = "SP"): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return fallback;
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function cn(...inputs: ClassValue[]): string {
  return inputs
    .filter((input): input is string | number => {
      return typeof input === "string" || typeof input === "number";
    })
    .map((input) => String(input).trim())
    .filter(Boolean)
    .join(" ");
}
