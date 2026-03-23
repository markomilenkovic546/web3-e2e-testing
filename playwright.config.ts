// Import necessary Playwright and Synpress modules
import { defineConfig, devices } from '@playwright/test';
import 'dotenv/config';

// Define Playwright configuration
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 1,
  workers: 4,
  reporter: [
    ['list'],
    ['monocart-reporter', {  
        name: "Web3 E2E Tests",
        outputFile: './test-results/report.html'
    }]
  ],
  timeout: 120000,
  use: {
    // Set base URL for tests from environment variable
    baseURL: process.env.BASE_URL || 'http://localhost:3000/',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    actionTimeout: 30_000,
    navigationTimeout: 60_000
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  // Additional Synpress-specific configuration can be added here
});
