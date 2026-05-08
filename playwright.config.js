// @ts-check
const { defineConfig } = require('@playwright/test');


/**
 * @see https://playwright.dev/docs/test-configuration
 */
const config = defineConfig({
  testDir: './tests',
  timeout: 30*1000,
  expect: { timeout: 40*1000 },
  reporter: 'html',
  
  use: {
    browserName: 'chromium',
    headless: true,
    screenshot: 'only-on-failure',
    trace: 'on', // off, on,'retain-on-failure' use only for failed test cases 
  },
});
module.exports = config;

