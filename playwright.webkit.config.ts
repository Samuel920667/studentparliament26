import { defineConfig, devices } from "@playwright/test";
import config from "./playwright.config";

export default defineConfig({
  ...config,
  testMatch: "**/navigation.spec.ts",
  outputDir: ".next/test-results-webkit",
  use: {
    ...config.use,
    ...devices["iPhone 13"],
    channel: undefined,
  },
});
