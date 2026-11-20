// src/lib/site-url.ts
import type { Metadata } from "next";

function normalizeBaseUrl(rawUrl: string): string {
  const trimmed = rawUrl.trim();
  const url = new URL(/^[a-z][a-z\d+.-]*:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`);
  if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) {
    throw new Error("The site URL must be a public HTTP or HTTPS origin.");
  }
  return url.origin;
}

export function getSiteUrl(): string | undefined {
  const configured = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.VERCEL_URL,
  ].find(value => value?.trim());
  return configured ? normalizeBaseUrl(configured) : undefined;
}

export const SITE_URL = getSiteUrl();

export function buildCanonicalUrl(pathname: string = "/"): string | undefined {
  const base = getSiteUrl();
  if (!base) return undefined;
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return normalizedPath === "/" ? `${base}/` : `${base}${normalizedPath}`;
}

export function canonicalMetadata(
  pathname: string = "/",
  overrides: Metadata = {}
): Metadata {
  const canonical = buildCanonicalUrl(pathname);

  return {
    ...overrides,
    ...(canonical ? { alternates: {
      ...overrides.alternates,
      canonical,
    } } : {}),
  };
}
