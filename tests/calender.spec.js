const {test,expect} = require("@playwright/test")

test("Verify calender",async ({page})=>{
    const month = "6";
    const date = "15";
    const year = "2027";
    const expectedDate = `${year}-${month.padStart(2, "0")}-${date.padStart(2, "0")}`;

    await page.goto("https://rahulshettyacademy.com/seleniumPractise/#/offers");
    await page.locator(".react-date-picker__inputGroup").click();
    await page.locator(".react-calendar__navigation__label").click();
    await page.locator(".react-calendar__navigation__label").click();
    await page.getByText(year).click();
    await page.locator('.react-calendar__year-view__months__month').nth(Number(month)- 1).click();
    await page.locator("//abbr[text()='"+date+"']").click();
    const value = await page.locator('.react-date-picker__inputGroup input').first().inputValue();
    expect(value).toEqual(expectedDate);
})
