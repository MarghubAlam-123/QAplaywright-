// @ts-check
import { defineConfig, devices } from '@playwright/test';
import { trace } from 'node:console';
import { Channel } from 'node:diagnostics_channel';
import { report } from 'node:process';

/**
 * @see https://playwright.dev/docs/test-configuration
 */

export default defineConfig({
  testDir: './tests',
  //retries: 1,
  //workers: 1,
  timeout: 30 * 1000,

  expect: {
    timeout: 40 * 1000,
  },
  reporter: 'html',
  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
        headless: false,
        screenshot: 'only-on-failure',
        trace: 'on',
      },
    },
    {
      name: 'firefox',
      use: {
        browserName: 'firefox',
        headless: false,
        screenshot: 'only-on-failure',
        trace: 'on',
      },
    },
    {
      name: 'msedge',
      use: {
        browserName: 'chromium',
        channel: 'msedge',
        headless: false,
        screenshot: 'only-on-failure',
        trace: 'on',
      },
    },
  ],
});