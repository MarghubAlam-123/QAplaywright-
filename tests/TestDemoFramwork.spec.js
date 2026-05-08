const { test } = require('@playwright/test');
const { POManager } = require('../pageobjects/POManager');
const {
    clientAppTestData,
    countrySearch,
    countryName,
    orderSuccessMessage
} = require('../utils/testData');

clientAppTestData.forEach(({ testName, loginPayload, productName }) => {
    test(`@web client app login - ${testName}`, async ({ page }) => {
        const userName = loginPayload.userEmail;
        const password = loginPayload.userPassword;

        const poManager = new POManager(page);
        const loginPage = poManager.getLoginPage();
        const dashboardPage = poManager.getDashboardPage();
        const cartCheckoutPage = poManager.getCartCheckoutPage();

        await loginPage.goTo();
        await loginPage.validLogin(userName, password);
        await dashboardPage.searchProductAddCart(productName);
        await dashboardPage.navigateToCart();
        await cartCheckoutPage.waitForCartItems();
        await cartCheckoutPage.verifyProductInCart(productName);
        await cartCheckoutPage.proceedToCheckout();
        await cartCheckoutPage.selectCountry(countrySearch, countryName);
        await cartCheckoutPage.verifyUserEmail(userName);
        await cartCheckoutPage.placeOrder();
        await cartCheckoutPage.verifyOrderSuccess(orderSuccessMessage);
    });
});
