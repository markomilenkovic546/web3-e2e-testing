// Import necessary Playwright and Synpress modules
import { defineConfig, devices } from '@playwright/test';
import 'dotenv/config';

// Define Playwright configuration
export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  timeout: 120000,
  use: {
    // Set base URL for tests from environment variable
    baseURL: process.env.BASE_URL || 'http://localhost:3000/',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  // Additional Synpress-specific configuration can be added here
});
