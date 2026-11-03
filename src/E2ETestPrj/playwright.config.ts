import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  reporter: 'html',
  expect: {
    timeout: 15_000,
  },
  use: {
    baseURL: 'https://localhost:7241',
    ignoreHTTPSErrors: true,
    trace: 'retain-on-failure',
    headless: false,
  },
});