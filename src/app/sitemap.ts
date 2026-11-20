import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  if (!siteUrl || process.env.VERCEL_ENV === "preview") return [];
  return ["/", "/about", "/leadership", "/senators", "/contact", "/petitions", "/game"]
    .map(pathname => ({ url: `${siteUrl}${pathname}` }));
}
