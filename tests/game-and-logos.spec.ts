import { test, expect } from "@playwright/test";

for (const width of [1280, 390]) {
  test(`loss screen text remains readable and Retry starts a new round at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.addInitScript(() => { Math.random = () => 0; });
    await page.goto("/game");
    await page.getByRole("button", { name: "Unbeatable", exact: true }).click();
    const board = page.getByRole("group", { name: "Tic-Tac-Toe Board" });
    await board.getByRole("button", { name: "Row 1, Column 1: Empty", exact: true }).click();
    await expect(board.getByRole("button", { name: "Row 2, Column 2: O", exact: true })).toBeVisible();
    await board.getByRole("button", { name: "Row 1, Column 2: Empty", exact: true }).click();
    await expect(board.getByRole("button", { name: "Row 1, Column 3: O", exact: true })).toBeVisible();
    await board.getByRole("button", { name: "Row 2, Column 1: Empty", exact: true }).click();

    const dialog = page.getByRole("dialog", { name: "YOU LOST." });
    await expect(dialog).toBeVisible();
    const caption = dialog.getByText(/The AI closed out the board/);
    const contrast = await caption.evaluate(element => {
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = 1;
      const context = canvas.getContext("2d")!;
      const rgba = (color: string) => {
        context.clearRect(0, 0, 1, 1);
        context.fillStyle = color;
        context.fillRect(0, 0, 1, 1);
        return [...context.getImageData(0, 0, 1, 1).data];
      };
      const background = rgba(getComputedStyle(element.closest("dialog")!).backgroundColor);
      const text = rgba(getComputedStyle(element).color);
      // A white page underneath is the least favorable case for this dark overlay.
      const opacity = background[3] / 255;
      const luminance = (rgb: number[]) => rgb.slice(0, 3).map(value => {
        const channel = value / 255;
        return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
      }).reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index], 0);
      const backdrop = background.slice(0, 3).map(channel => channel * opacity + 255 * (1 - opacity));
      const light = luminance(text), dark = luminance(backdrop);
      return (Math.max(light, dark) + 0.05) / (Math.min(light, dark) + 0.05);
    });
    expect(contrast).toBeGreaterThanOrEqual(4.5);
    await expect(dialog.getByRole("button", { name: "Retry", exact: true })).toBeVisible();
    await expect(dialog.getByRole("button", { name: "View Board", exact: true })).toBeVisible();
    await page.screenshot({ path: testInfo.outputPath("loss-screen.png") });
    await dialog.getByRole("button", { name: "Retry", exact: true }).click();
    await expect(dialog).toHaveCount(0);
    await expect(board.getByRole("button", { name: /Empty$/ })).toHaveCount(9);
  });
}

test("opening navigation renders already loaded logos on its first frame", async ({ page }) => {
  const logoRequests: string[] = [];
  page.on("request", request => {
    const url = new URL(request.url());
    if (["/sdp-logo.png", "/veritas-logo.png"].includes(url.searchParams.get("url") || url.pathname)) {
      logoRequests.push(request.url());
    }
  });
  await page.goto("/");
  const headerLogos = page.locator("header img");
  await expect(headerLogos).toHaveCount(2);
  await expect.poll(() => headerLogos.evaluateAll(nodes => nodes.every(node => {
    const image = node as HTMLImageElement;
    return image.complete && image.naturalWidth > 0;
  }))).toBe(true);
  const loadedRequests = [...logoRequests];

  for (let opening = 0; opening < 2; opening++) {
    await page.getByRole("button", { name: "Open navigation menu" }).click();
    const dialog = page.getByRole("dialog", { name: "Site navigation" });
    await expect(dialog.locator("img")).toHaveCount(2);
    const ready = await dialog.locator("img").evaluateAll(nodes => new Promise<boolean>(resolve => {
      requestAnimationFrame(() => resolve(nodes.every(node => {
        const image = node as HTMLImageElement;
        return image.complete && image.naturalWidth > 0;
      })));
    }));
    expect(ready).toBe(true);
    expect(logoRequests).toEqual(loadedRequests);
    await dialog.getByRole("button", { name: "Close navigation menu" }).click();
  }
});
