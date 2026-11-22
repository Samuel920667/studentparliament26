import { test, expect } from "@playwright/test";

test("mobile logos are ready on a cold visit even when image downloads are unavailable", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 390, height: 664 });
  await page.route("**/*", route => route.request().resourceType() === "image" ? route.abort() : route.continue());
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const headerLogos = page.locator("header img");
  const readyOnNextFrame = (logos: import("@playwright/test").Locator) => logos.evaluateAll(nodes => new Promise<boolean>(resolve => {
    requestAnimationFrame(() => resolve(nodes.length === 2 && nodes.every(node => {
      const image = node as HTMLImageElement;
      return image.complete && image.naturalWidth > 0;
    })));
  }));
  expect(await readyOnNextFrame(headerLogos)).toBe(true);
  for (let opening = 0; opening < 2; opening++) {
    await page.getByRole("button", { name: "Open navigation menu" }).click();
    const dialog = page.getByRole("dialog", { name: "Site navigation" });
    expect(await readyOnNextFrame(dialog.locator("img"))).toBe(true);
    if (!opening) await page.screenshot({ path: testInfo.outputPath("mobile-logos.png") });
    await dialog.getByRole("button", { name: "Close navigation menu" }).click();
  }
});

for (const viewport of [
  { width: 320, height: 568 },
  { width: 390, height: 664 },
  { width: 430, height: 740 },
  { width: 844, height: 390 },
  { width: 1280, height: 900 },
]) {
  test(`navigation stays clean and its actions are reachable at ${viewport.width}x${viewport.height}`, async ({ page }, testInfo) => {
    await page.setViewportSize(viewport);
    await page.goto("/leadership");
    await page.evaluate(() => document.fonts.ready);
    const trigger = page.getByRole("button", { name: "Open navigation menu" });
    if (testInfo.project.use.hasTouch) await trigger.tap();
    else await trigger.click();
    const dialog = page.getByRole("dialog", { name: "Site navigation" });
    const close = dialog.getByRole("button", { name: "Close navigation menu" });
    const brand = dialog.getByRole("link", { name: "SDP Portal Home" });
    await expect(close).toBeFocused();
    await expect(brand).not.toBeFocused();
    await expect(dialog).toHaveCSS("background-color", "rgb(11, 31, 51)");
    const surface = dialog.locator(":scope > div");
    await expect(surface).toHaveCSS("background-color", "rgb(11, 31, 51)");
    await expect(surface).toHaveCSS("background-image", "none");
    await expect(surface).toHaveCSS("backdrop-filter", "none");
    const menuBounds = await dialog.boundingBox();
    expect(menuBounds).toEqual({ x: 0, y: 0, ...viewport });
    const rows = dialog.getByRole("navigation").getByRole("link").filter({ has: page.locator("span.font-display") });
    const bounds = await rows.evaluateAll(nodes => nodes.map(node => {
      const { top, bottom, height } = node.getBoundingClientRect();
      return { top, bottom, height, width: node.clientWidth, contentWidth: node.scrollWidth };
    }));
    for (let index = 0; index < bounds.length; index++) {
      expect(bounds[index].height).toBeGreaterThanOrEqual(44);
      expect(bounds[index].contentWidth).toBeLessThanOrEqual(bounds[index].width);
      if (index) expect(bounds[index].top).toBeGreaterThanOrEqual(bounds[index - 1].bottom);
    }
    const closeBounds = await close.boundingBox();
    const social = dialog.getByRole("link", { name: "Follow on Instagram" });
    await social.scrollIntoViewIfNeeded();
    const cta = dialog.getByRole("link", { name: "Draft a Petition" });
    await expect(cta).toBeInViewport({ ratio: 1 });
    await expect(social).toBeInViewport({ ratio: 1 });
    const socialBounds = (await social.boundingBox())!;
    expect(socialBounds.y + socialBounds.height).toBeLessThanOrEqual(viewport.height - 16);
    expect(await close.boundingBox()).toEqual(closeBounds);
    expect(await dialog.evaluate(node => node.scrollWidth <= node.clientWidth)).toBe(true);
    await page.screenshot({ path: testInfo.outputPath("navigation.png") });
    await close.click();
    await expect(dialog).toHaveCount(0);
    await expect(trigger).toBeFocused();
  });
}

test("keyboard focus remains visible, trapped, and returns to the menu trigger", async ({ page }) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Open navigation menu" });
  await trigger.focus();
  await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog", { name: "Site navigation" });
  const close = dialog.getByRole("button", { name: "Close navigation menu" });
  const brand = dialog.getByRole("link", { name: "SDP Portal Home" });
  await expect(close).toBeFocused();
  await expect(close).toHaveCSS("outline-style", "solid");
  await page.keyboard.press("Shift+Tab");
  await expect(brand).toBeFocused();
  await expect(brand).toHaveCSS("outline-width", "2px");
  await expect(brand).toHaveCSS("outline-style", "solid");
  await page.keyboard.press("Shift+Tab");
  await expect(dialog.getByRole("link", { name: "Follow on Instagram" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(brand).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe("");
});

test("an open menu adapts to viewport changes and scrolling preserves the page position", async ({ page }) => {
  await page.goto("/leadership");
  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = "auto";
    window.scrollTo(0, 350);
  });
  let scrollBefore = await page.evaluate(() => window.scrollY);
  const trigger = page.getByRole("button", { name: "Open navigation menu" });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Site navigation" });
  for (const viewport of [{ width: 390, height: 450 }, { width: 390, height: 740 }, { width: 844, height: 390 }]) {
    await page.setViewportSize(viewport);
    await expect.poll(async () => (await dialog.boundingBox())?.height).toBe(viewport.height);
    scrollBefore = await page.evaluate(() => window.scrollY);
    await dialog.getByRole("link", { name: "Draft a Petition" }).scrollIntoViewIfNeeded();
    await expect(dialog.getByRole("link", { name: "Draft a Petition" })).toBeInViewport({ ratio: 1 });
    await expect(dialog.getByRole("button", { name: "Close navigation menu" })).toBeInViewport({ ratio: 1 });
    expect(await page.evaluate(() => window.scrollY)).toBe(scrollBefore);
  }
  await page.keyboard.press("Escape");
  expect(await page.evaluate(() => window.scrollY)).toBe(scrollBefore);
});

for (const device of [
  { name: "portrait", viewport: { width: 390, height: 664 }, insets: { top: 47, right: 0, bottom: 34, left: 0 } },
  { name: "landscape", viewport: { width: 844, height: 390 }, insets: { top: 0, right: 47, bottom: 21, left: 47 } },
]) {
  test(`notch and home-indicator insets leave menu actions clear in ${device.name}`, async ({ page }, testInfo) => {
    await page.setViewportSize(device.viewport);
    // Emulators do not supply real device insets. Substitute OS values in the
    // served stylesheet so the production layout handles these values itself.
    await page.route("**/*.css", async route => {
      const response = await route.fetch();
      const css = (await response.text()).replace(
        /env\(safe-area-inset-(top|right|bottom|left)(?:,\s*0px)?\)/g,
        (_, side: keyof typeof device.insets) => `${device.insets[side]}px`,
      );
      await route.fulfill({ response, body: css });
    });
    await page.goto("/leadership");
    const headerBrand = page.locator("header").getByRole("link", { name: "SDP Portal Home" });
    expect((await headerBrand.boundingBox())!.x).toBeGreaterThanOrEqual(device.insets.left + 24);
    await page.getByRole("button", { name: "Open navigation menu" }).click();
    const dialog = page.getByRole("dialog", { name: "Site navigation" });
    const brand = (await dialog.getByRole("link", { name: "SDP Portal Home" }).boundingBox())!;
    expect(brand.y).toBeGreaterThanOrEqual(device.insets.top);
    expect(brand.x).toBeGreaterThanOrEqual(device.insets.left + 24);
    const social = dialog.getByRole("link", { name: "Follow on Instagram" });
    await social.scrollIntoViewIfNeeded();
    const cta = dialog.getByRole("link", { name: "Draft a Petition" });
    await expect(cta).toBeInViewport({ ratio: 1 });
    const socialBounds = (await social.boundingBox())!;
    const ctaBounds = (await cta.boundingBox())!;
    expect(socialBounds.y + socialBounds.height).toBeLessThanOrEqual(device.viewport.height - device.insets.bottom - 16);
    expect(ctaBounds.x).toBeGreaterThanOrEqual(device.insets.left + 24);
    expect(ctaBounds.x + ctaBounds.width).toBeLessThanOrEqual(device.viewport.width - device.insets.right - 24);
    await page.screenshot({ path: testInfo.outputPath("navigation-safe-area.png") });
  });
}
