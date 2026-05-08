const {test,expect} = require("@playwright/test")


//test.describe.configure({mode:'parallel'})
test.describe.configure({mode:'serial'})

test('@web popup validation', async ({page})=>{

    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
    await page.goto("https://www.google.com");
    await page.goBack();
    // Wait for the text box to be visible
    await page.waitForSelector("#displayed-text", { state: "visible" });
    // Assert that the text box is visible
    await expect(page.locator("#displayed-text")).toBeVisible();
    await page.locator("#hide-textbox").click();
    await expect(page.locator("#displayed-text")).toBeHidden();
    // await page.pause();
    page.on('dialog',dialog =>dialog.accept());
    await page.locator("#confirmbtn").click();
    await page.locator("#mousehover").hover();
    const framesPage = page.frameLocator("#courses-iframe")
    await framesPage.locator("li a[href*='lifetime-access']:visible").click();
    const textCheck = await framesPage.locator(".text h2").textContent();
    console.log(textCheck.split(" ")[1])
})
test("@web screenshot and visual comparison", async ({page})=>{
    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");      
    await expect(page.locator("#displayed-text")).toBeVisible();
    await page.locator("#displayed-text").screenshot({path:'Partialtextbox.png'});
    await page.locator('#hide-textbox').click();
    await page.screenshot({path:'screenshot.png'});
    await expect(page.locator("#displayed-text")).toBeHidden();
});

test("@web visual testing",async({page})=>{
    await page.goto("https://www.google.com/");
    expect (await page.screenshot()).toMatchSnapshot('google-win32.png');
})