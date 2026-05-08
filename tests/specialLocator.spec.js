import {test, expect } from '@playwright/test';

test('palywright special locator',async ({page })=>{
    await page.goto("https://rahulshettyacademy.com/angularpractice/");
    await page.getByLabel("Check me out if you Love IceCreams!").click();
    await page.getByLabel("Student").click();
    await page.getByLabel("Gender").selectOption("Female");
    await page.getByPlaceholder("Password").fill("Wordpass@123");
    await page.getByRole("button", { name: "Submit" }).click();
    await page.getByText("Success! The Form has been submitted successfully!.").isVisible();
    await page.getByRole("link",{name:"Shop"}).click();

    //first get the card then filter your choices card and then use getby method to click on the content of that card.
    await page.locator("app-card").filter({hasText: "Nokia Edge"}).getByRole("button", {name:"Add"}).click();
});

test("end to end testing",async ({page})=>{
    const email = "marghub146@gmail.com";
    const password = "Wordpass@123";
    await page.goto("https://rahulshettyacademy.com/client/#/auth/login");
    await page.getByPlaceholder("Email").fill(email);
    await page.getByPlaceholder("enter your passsword").fill(password);
    await page.getByRole("button", { name: "login" }).click();
    await page.waitForLoadState('networkidle');
    await page.locator(".card-body").filter({hasText: "ZARA COAT 3"}).getByRole("button",{name:"Add To Cart"}).click();
    await page.getByRole("listitem").getByRole('button',{name:"Cart"}).click();
    //await page pause
    await page.locator("div li").first().waitFor()
    await expect(page.getByText("ZARA COAT 3")).toBeVisible();
    await page.getByRole("button",{name:"Checkout"}).click();
    await page.getByPlaceholder("Select Country").pressSequentially("ind");
    await page.getByRole("button",{name:"india"}).nth(1).click();
    await page.getByText("Place Order ").click();
    await expect(page.getByText(" Thankyou for the order. ")).toBeVisible();
});