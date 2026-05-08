const { Before, After, setDefaultTimeout } = require('@cucumber/cucumber');
const { chromium } = require('@playwright/test');
const { POManager } = require('../../pageobjects/POManager');
const {
  loginPayload,
  productName,
  countrySearch,
  countryName,
  orderSuccessMessage
} = require('../../utils/testData');

setDefaultTimeout(120 * 1000);

Before(async function () {
  this.testData = {
    loginPayload,
    productName,
    countrySearch,
    countryName,
    orderSuccessMessage
  };

  this.browser = await chromium.launch({ headless: process.env.HEADLESS === "true" });
  this.context = await this.browser.newContext();
  this.page = await this.context.newPage();
  this.poManager = new POManager(this.page);
  this.loginPage = this.poManager.getLoginPage();
  this.dashboardPage = this.poManager.getDashboardPage();
  this.cartCheckoutPage = this.poManager.getCartCheckoutPage();

  await this.loginPage.goTo();
});

After(async function ({ pickle, result }) {
  console.log(`Scenario "${pickle.name}" finished with status: ${result?.status}`);
  if (this.context) {
    await this.context.close();
  }
  if (this.browser) {
    await this.browser.close();
  }
});
