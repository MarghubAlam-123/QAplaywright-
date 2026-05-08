const { expect } = require('@playwright/test');

class LoginPage {
    constructor(page) {
        this.page = page;
        this.signInButton = page.locator("input[value='Login']");
        this.userName = page.locator("#userEmail");
        this.password = page.locator("#userPassword");
        this.loginErrorMessage = page.locator(".alert-danger");
    }

    async goTo() {
        await this.page.goto("https://rahulshettyacademy.com/client/", {
            waitUntil: "domcontentloaded",
            timeout: 60000
        });
    }

    async validLogin(userEmail, password) {
        await this.userName.fill(userEmail);
        await this.password.fill(password);
        await this.signInButton.click();
        await this.page.locator(".card-body").first().waitFor({
            state: "visible",
            timeout: 60000
        });
    }

    async invalidLogin(userEmail, password) {
        await this.userName.fill(userEmail);
        await this.password.fill(password);
        await this.signInButton.click();
    }

    async verifyLoginErrorMessage(errorMessage) {
        await expect(this.loginErrorMessage).toContainText(errorMessage);
    }
}

module.exports = { LoginPage };
