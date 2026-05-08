const { When, Then, Given } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

Given('a login to Ecommerce application with {string} and {string}', async function (username, password) {
  await this.loginPage.validLogin(username, password);
});

Given('a login to Ecommerce2 application with {string} and {string}', async function (username, password) {
  await this.loginPage.invalidLogin(username, password);
});

When('Add {string} to the cart', async function (productName) {
  await this.dashboardPage.searchProductAddCart(productName);
});

Then('verify {string} is displayed in the cart', async function (productName) {
  await this.dashboardPage.navigateToCart();
  await this.cartCheckoutPage.waitForCartItems();
  await this.cartCheckoutPage.verifyProductInCart(productName);
});

When('Enter valid details and palce the order', async function () {
  await this.cartCheckoutPage.proceedToCheckout();
  await this.cartCheckoutPage.selectCountry(this.testData.countrySearch, this.testData.countryName);
  await this.cartCheckoutPage.verifyUserEmail(this.testData.loginPayload.userEmail);
  await this.cartCheckoutPage.placeOrder();
});

Then('Verify order in present in orderHistory', async function () {
  await this.cartCheckoutPage.verifyOrderSuccess(this.testData.orderSuccessMessage);
});

Given('the user has added a product to the cart', async function () {
  await this.loginPage.validLogin(
    this.testData.loginPayload.userEmail,
    this.testData.loginPayload.userPassword
  );
  await this.dashboardPage.searchProductAddCart(this.testData.productName);
});

When('the user clicks on {string}', async function (buttonName) {
  if (buttonName === "Cart") {
    await this.dashboardPage.navigateToCart();
  } else if (buttonName === "Proceed to Checkout") {
    await this.cartCheckoutPage.proceedToCheckout();
  }
});

Then('the user should be redirected to the checkout page', async function () {
  await this.cartCheckoutPage.verifyCheckoutPageLoaded();
  await expect(this.page).toBeDefined();
});

Then('verify error message is displayed', async function () {
  await this.loginPage.verifyLoginErrorMessage('Incorrect');
});


