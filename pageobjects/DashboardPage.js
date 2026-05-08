class DashboardPage {
    constructor(page) {
        this.page = page;
        this.products = page.locator('.card-body');
        this.cart = page.locator("button[routerlink*='cart']");
    }

    async searchProductAddCart(productName) {
        const count = await this.products.count();
        for (let i = 0; i < count; ++i) {
            const currentName = await this.products.nth(i).locator("b").textContent();
            if (
                currentName &&
                currentName.trim().toLowerCase() === productName.trim().toLowerCase()
            ) {
                await this.products.nth(i).locator("text=Add To Cart").click();
                break;
            }
        }
    }

    async navigateToCart() {
        await this.cart.click();
    }
}

module.exports = { DashboardPage };
