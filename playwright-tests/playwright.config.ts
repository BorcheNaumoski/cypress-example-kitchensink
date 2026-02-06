import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: [
  ['line'],
  ['html'],
  ['allure-playwright']
],

  use: {
    baseURL: 'http://localhost:8080',

    // Show browser UI (headed mode)
    headless: false,

    // Collect trace on retry for debugging
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  // Automatically start Todo app server before tests
  webServer: {
    command: 'npm start',
    url: 'http://localhost:8080',
    reuseExistingServer: true,
  },
});
