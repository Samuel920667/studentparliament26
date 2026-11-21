import { test, expect } from "@playwright/test";

test("uncreated URLs return 404 and the page offers a working route home", async ({ page, request }) => {
  for (const pathname of ["/page-we-never-created", "/admin", "/api/unknown", "/game/unknown", "/leadership/unknown"]) {
    const response = await request.get(pathname);
    expect(response.status(), pathname).toBe(404);
    expect(await response.text()).toContain("Page not found");
  }
  const response = await page.goto("/page-we-never-created");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();
  await page.getByRole("link", { name: "Return to Home" }).click();
  await expect(page).toHaveURL(/\/$/);
  expect((await request.get("/point-of-controversy")).status()).toBe(200);
});

test("production security headers restrict scripts, frames, connections, and unused device access", async ({ request, page }) => {
  const response = await request.get("/");
  const policy = response.headers()["content-security-policy"];
  expect(policy).toContain("default-src 'self'");
  expect(policy).toContain("connect-src 'self'");
  expect(policy).toContain("frame-src 'none'");
  expect(policy).not.toContain("unsafe-eval");
  expect(response.headers()["permissions-policy"]).toContain("camera=()");
  await page.goto("/");
  const blocked = await page.evaluate(() => new Promise<string>(resolve => {
    document.addEventListener("securitypolicyviolation", event => {
      if (event.blockedURI === "https://untrusted.invalid/payload.js") resolve(event.effectiveDirective);
    });
    const script = document.createElement("script");
    script.src = "https://untrusted.invalid/payload.js";
    document.body.appendChild(script);
  }));
  expect(blocked).toBe("script-src-elem");
});

test("petition PDF and Word downloads work under the production security policy", async ({ page }) => {
  const violations: string[] = [];
  page.on("console", message => {
    if (message.type() === "error" && /Content Security Policy/i.test(message.text())) violations.push(message.text());
  });
  await page.goto("/petitions");
  await page.locator("#petition-full-name").fill("Chinedu Okafor");
  await page.locator("#petition-matric-number").fill("VUG/CSC/22/1234");
  await page.locator("#petition-department").fill("Computer Science");
  await page.locator("#petition-phone").fill("08012345678");
  await page.getByRole("button", { name: /Continue to Petition Details/ }).click();
  await page.locator("#petition-title").fill("Water supply disruption in Hostel B");
  await page.locator("#petition-category").selectOption({ label: "Campus Welfare & Facilities" });
  await page.locator("#petition-account").fill("Water has not been available in Hostel B since Monday morning, affecting sanitation and student welfare.");
  await page.locator("#petition-requested-action").fill("Please restore the water supply in Hostel B.");
  await page.getByRole("button", { name: "Generate Formal Petition" }).click();
  for (const output of ["PDF", "Word"]) {
    const pending = page.waitForEvent("download");
    await page.getByRole("button", { name: new RegExp(`Download ${output}`) }).click();
    const download = await pending;
    expect(await download.failure()).toBeNull();
    expect(download.suggestedFilename()).toMatch(output === "PDF" ? /\.pdf$/ : /\.docx$/);
  }
  expect(violations).toEqual([]);
});
