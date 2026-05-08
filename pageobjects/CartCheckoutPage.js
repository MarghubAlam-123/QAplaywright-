const { expect } = require('@playwright/test');

class CartCheckoutPage {
    constructor(page) {
        this.page = page;
        this.cartItems = page.locator('div li');
        this.checkoutButton = page.locator("text=Checkout");
        this.countryInput = page.locator("[placeholder*='Country']");
        this.countryDropdown = page.locator('.ta-results');
        this.countryOptions = this.countryDropdown.locator('button');
        this.userEmailSection = page.locator(".user__name").first();
        this.placeOrderButton = page.locator("a:has-text('Place Order')");
        this.orderSuccessMessage = page.locator('.hero-primary');
    }

    async waitForCartItems() {
        await this.cartItems.first().waitFor();
    }

    async verifyProductInCart(productName) {
        const isVisible = await this.page.locator(`h3:has-text("${productName}")`).isVisible();
        expect(isVisible).toBeTruthy();
    }

    async proceedToCheckout() {
        await this.checkoutButton.click();
    }

    async verifyCheckoutPageLoaded() {
        await expect(this.countryInput).toBeVisible();
        await expect(this.placeOrderButton).toBeVisible();
    }

    async selectCountry(countrySearch, countryName) {
        await this.countryInput.type(countrySearch, {delay: 100});
        await this.countryDropdown.waitFor();
        const optionCount = await this.countryOptions.count();
        for (let i = 0; i < optionCount; ++i) {
            const text = await this.countryOptions.nth(i).textContent();
            if (text && text.includes(countryName)) {
                await this.countryOptions.nth(i).click();
                break;
            }
        }
    }

    async verifyUserEmail(userEmail) {
        await expect(this.userEmailSection).toContainText(userEmail);
    }

    async placeOrder() {
        await this.placeOrderButton.click();
    }

    async verifyOrderSuccess(message) {
        await expect(this.orderSuccessMessage).toContainText(message, { ignoreCase: true });
    }
}

module.exports = { CartCheckoutPage };
