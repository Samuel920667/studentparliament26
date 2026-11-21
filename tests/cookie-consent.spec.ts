import { test, expect } from "@playwright/test";

const storageKey = "sdp-cookie-consent-v1";
const notice = (page: import("@playwright/test").Page) => page.getByRole("region", { name: "Cookie preferences" });

for (const option of ["Accept", "Decline"] as const) {
  test(`${option} is remembered across routes, reloads, and another visit`, async ({ page, context, browser }) => {
    await page.goto("/");
    await expect(notice(page)).toBeVisible();
    await notice(page).getByRole("button", { name: option, exact: true }).click();
    await expect(notice(page)).toHaveCount(0);
    expect(await page.evaluate(key => localStorage.getItem(key), storageKey)).toBe(option === "Accept" ? "accepted" : "declined");
    await page.goto("/game");
    await expect(notice(page)).toHaveCount(0);
    await page.reload();
    await expect(notice(page)).toHaveCount(0);
    const returning = await context.newPage();
    await returning.goto("/contact");
    await expect(notice(returning)).toHaveCount(0);
    await returning.close();
    const restored = await browser.newContext({ storageState: await context.storageState() });
    const laterVisit = await restored.newPage();
    await laterVisit.goto("http://127.0.0.1:3187/");
    await expect(notice(laterVisit)).toHaveCount(0);
    await restored.close();
  });
}

test("a visitor can change their cookie choice from the footer and other tabs update", async ({ page, context }) => {
  await page.goto("/");
  await notice(page).getByRole("button", { name: "Accept", exact: true }).click();
  const other = await context.newPage();
  await other.goto("/contact");
  await expect(notice(other)).toHaveCount(0);
  await other.getByRole("button", { name: "Cookie preferences", exact: true }).click();
  await expect(notice(other)).toBeVisible();
  await page.getByRole("button", { name: "Cookie preferences", exact: true }).click();
  await notice(page).getByRole("button", { name: "Decline", exact: true }).click();
  await expect(notice(other)).toHaveCount(0);
  expect(await other.evaluate(key => localStorage.getItem(key), storageKey)).toBe("declined");
  await other.close();
});

test("invalid saved choices show the banner and blocked storage still permits declining", async ({ page }) => {
  await page.addInitScript(key => localStorage.setItem(key, "invalid"), storageKey);
  await page.goto("/");
  await expect(notice(page)).toBeVisible();
  await page.evaluate(() => {
    Storage.prototype.setItem = () => { throw new DOMException("Storage unavailable", "SecurityError"); };
  });
  await notice(page).getByRole("button", { name: "Decline", exact: true }).click();
  await expect(notice(page)).toHaveCount(0);
  await page.getByRole("button", { name: "Open navigation menu" }).click();
  await expect(page.getByRole("dialog", { name: "Site navigation" })).toBeVisible();
});

test("cookie choices are visible and usable on a narrow screen", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto("/");
  await expect(notice(page)).toBeInViewport();
  for (const option of ["Accept", "Decline"]) {
    await expect(notice(page).getByRole("button", { name: option, exact: true })).toBeInViewport();
  }
  await page.screenshot({ path: testInfo.outputPath("cookie-banner-mobile.png") });
  await notice(page).getByRole("button", { name: "Accept", exact: true }).click();
  await expect(notice(page)).toHaveCount(0);
});
