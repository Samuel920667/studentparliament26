import { test, expect } from "@playwright/test";

for (const width of [1280, 768, 390]) {
  test(`contact disclosure preserves neighboring card sizes and focus at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/senators");
    await page.evaluate(() => document.fonts.ready);
    const cards = page.locator("article");
    const before = await cards.evaluateAll(nodes => nodes.map(node => {
      const { width, height } = node.getBoundingClientRect();
      return { width, height };
    }));
    const first = cards.first();
    const toggle = first.getByRole("button", { name: "View Contact" });
    await toggle.focus();
    await page.keyboard.press("Enter");
    const hide = first.getByRole("button", { name: "Hide" });
    await expect(hide).toBeFocused();
    await expect(hide).toHaveAttribute("aria-expanded", "true");
    await expect(first.getByRole("link", { name: "WhatsApp" })).toBeVisible();
    const after = await cards.evaluateAll(nodes => nodes.map(node => {
      const { width, height } = node.getBoundingClientRect();
      return { width, height };
    }));
    expect(after[0].height).toBeGreaterThan(before[0].height);
    expect(after.slice(1)).toEqual(before.slice(1));
    await cards.nth(1).getByRole("button", { name: "View Contact" }).click();
    await expect(page.getByRole("button", { name: "Hide", exact: true })).toHaveCount(2);
    await hide.click();
    await expect(toggle).toBeFocused();
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(cards.nth(1).getByRole("link", { name: "WhatsApp" })).toBeVisible();
    await page.getByRole("searchbox").fill("no matching senator");
    await expect(page.getByText(/No senator found/)).toBeVisible();
    await page.getByRole("button", { name: "Show All" }).click();
    await expect(cards).toHaveCount(before.length);
  });
}

for (const modal of [
  { route: "/leadership", trigger: /Samuel Peters.*View Profile/, close: "Close officer profile" },
  { route: "/about", trigger: /Committee on Welfare & Security.*Read details/, close: "Close committee details" },
]) {
  test(`${modal.route} modal has one close button, traps focus, and restores scrolling`, async ({ page }, testInfo) => {
    await page.goto(modal.route);
    const trigger = page.getByRole("button", { name: modal.trigger }).filter({ visible: true });
    const dialog = page.getByRole("dialog");
    const overflow = await page.evaluate(() => document.body.style.overflow);
    for (const method of ["button", "escape", "backdrop"]) {
      await trigger.click();
      await expect(dialog).toBeVisible();
      await expect(dialog.getByRole("button", { name: /close/i })).toHaveCount(1);
      expect(await dialog.evaluate(node => node.matches(":modal"))).toBe(true);
      expect(await page.evaluate(() => document.body.style.overflow)).toBe("hidden");
      if (method === "button") await page.screenshot({ path: testInfo.outputPath("modal.png") });
      for (let i = 0; i < 6; i++) {
        await page.keyboard.press(i % 2 ? "Shift+Tab" : "Tab");
        expect(await dialog.evaluate(node => node.contains(document.activeElement))).toBe(true);
      }
      if (method === "button") await dialog.getByRole("button", { name: modal.close }).click();
      if (method === "escape") await page.keyboard.press("Escape");
      if (method === "backdrop") await page.mouse.click(8, 8);
      await expect(dialog).toHaveCount(0);
      await expect(trigger).toBeFocused();
      expect(await page.evaluate(() => document.body.style.overflow)).toBe(overflow);
    }
  });
}

test("navigation scrolls on a short viewport and closes on navigation", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 450 });
  await page.goto("/leadership");
  const open = page.getByRole("button", { name: "Open navigation menu" });
  await open.click();
  const dialog = page.getByRole("dialog", { name: "Site navigation" });
  expect(await dialog.evaluate(node => node.matches(":modal"))).toBe(true);
  await dialog.getByRole("link", { name: "Draft a Petition" }).scrollIntoViewIfNeeded();
  await expect(dialog.getByRole("link", { name: "Draft a Petition" })).toBeInViewport();
  await page.keyboard.press("Escape");
  await expect(open).toBeFocused();
  await open.click();
  await dialog.getByRole("link", { name: "Draft a Petition" }).click();
  await expect(page).toHaveURL(/\/petitions$/);
  await expect(dialog).toHaveCount(0);
  expect(await page.evaluate(() => document.body.style.overflow)).toBe("");
  await open.click();
  await page.goBack();
  await expect(dialog).toHaveCount(0);
  await page.goForward();
  await expect(dialog).toHaveCount(0);
});

test("failed profile photos render initials without changing avatar dimensions", async ({ page }) => {
  await page.route("**/senators/samuel-peters.jpg", route => route.abort());
  await page.goto("/senators");
  await page.getByRole("searchbox").fill("Samuel Peters");
  const first = page.locator("article").first();
  await expect(first.getByText("SP", { exact: true })).toBeVisible();
  const avatar = first.getByText("SP", { exact: true }).locator("..");
  const bounds = await avatar.boundingBox();
  expect(bounds?.width).toBe(96);
  expect(bounds?.height).toBe(96);
});
