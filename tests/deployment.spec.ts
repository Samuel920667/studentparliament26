import { test, expect } from "@playwright/test";
import { buildCanonicalUrl, canonicalMetadata, getSiteUrl } from "../src/lib/site-url";
import robots from "../src/app/robots";
import sitemap from "../src/app/sitemap";

function withEnvironment(values: Record<string, string>, check: () => void) {
  const keys = ["NEXT_PUBLIC_SITE_URL", "SITE_URL", "VERCEL_PROJECT_PRODUCTION_URL", "VERCEL_URL", "VERCEL_ENV"];
  const original = keys.map(key => process.env[key]);
  try {
    for (const key of keys) delete process.env[key];
    Object.assign(process.env, values);
    check();
  } finally {
    keys.forEach((key, index) => {
      if (original[index] === undefined) delete process.env[key];
      else process.env[key] = original[index];
    });
  }
}

test("production domains resolve consistently for canonical URLs and sitemap", () => {
  withEnvironment({ VERCEL_PROJECT_PRODUCTION_URL: "sdp.example.edu", VERCEL_URL: "preview.example.app" }, () => {
    expect(getSiteUrl()).toBe("https://sdp.example.edu");
    expect(buildCanonicalUrl("leadership")).toBe("https://sdp.example.edu/leadership");
    expect(sitemap()).toHaveLength(7);
    expect(robots().sitemap).toBe("https://sdp.example.edu/sitemap.xml");
  });
  withEnvironment({ NEXT_PUBLIC_SITE_URL: " https://custom.example.edu/ ", VERCEL_PROJECT_PRODUCTION_URL: "sdp.example.edu" }, () => {
    expect(buildCanonicalUrl()).toBe("https://custom.example.edu/");
  });
  withEnvironment({ NEXT_PUBLIC_SITE_URL: " ", VERCEL_URL: "sdp.example.app" }, () => {
    expect(getSiteUrl()).toBe("https://sdp.example.app");
  });
});

test("unconfigured origins omit canonical links and previews discourage indexing", () => {
  withEnvironment({}, () => {
    expect(getSiteUrl()).toBeUndefined();
    expect(canonicalMetadata("/contact", { title: "Contact" })).toEqual({ title: "Contact" });
    expect(sitemap()).toEqual([]);
    expect(robots().sitemap).toBeUndefined();
  });
  withEnvironment({ VERCEL_ENV: "preview", VERCEL_URL: "preview.example.app" }, () => {
    expect(robots().rules).toEqual({ userAgent: "*", disallow: "/" });
    expect(sitemap()).toEqual([]);
  });
  withEnvironment({ NEXT_PUBLIC_SITE_URL: "ftp://example.edu" }, () => {
    expect(() => getSiteUrl()).toThrow(/HTTP or HTTPS/);
  });
});

test("production routes, public assets, and response headers are served", async ({ request }) => {
  for (const route of ["/", "/about", "/leadership", "/senators", "/contact", "/petitions", "/game", "/robots.txt", "/sitemap.xml"]) {
    const response = await request.get(route);
    expect(response.status(), route).toBe(200);
    expect(response.headers()["x-content-type-options"]).toBe("nosniff");
    expect(response.headers()["x-frame-options"]).toBe("DENY");
    expect(response.headers()["content-security-policy"]).toContain("frame-ancestors 'none'");
    if (route === "/" || route === "/sitemap.xml") expect(await response.text()).not.toContain("http://localhost:3000");
  }
  for (const asset of ["/fonts/SourceSerif4-Regular.otf", "/fonts/SourceSerif4-Bold.otf", "/sdp-logo.png", "/veritas-logo.png", "/social-preview.png"]) {
    expect((await request.get(asset)).status(), asset).toBe(200);
  }
});
