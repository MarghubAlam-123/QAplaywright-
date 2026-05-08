// Login UI-> .json
//test browser ->.json, cart-,order, orderdetails,orderhistory;

const { test, expect } = require('@playwright/test');
let webContest;
test.beforeAll(async({browser})=> {
    const context = await browser.newContext();
    const page = await context.newPage();   
    // run once before all tests
    await page.goto("https://rahulshettyacademy.com/client");
    await page.locator("#userEmail").type("marghub146@gmail.com");
    await page.locator("#userPassword").type("Wordpass@123");
    await page.locator("[value='Login']").click();
    await page.waitForLoadState('networkidle');
    await context.storageState({path:'state.json'});
    webContest = await browser.newContext({storageState:'state.json'});
})

test('@API Client app login',async () => {

    //get product title.
    const email= "";
    const productName = 'ZARA COAT 3';
    //multiple product on page with this ".card-body" class
    const page = await webContest.newPage();
    await page.
    goto("https://rahulshettyacademy.com/client");
    const products =await page.locator(".card-body");
    const title = await page.locator(".card-body b").allTextContents();
    console.log(title);
    const count = await products.count();
    console.log(count);

    await page
      .locator(".card-body")
      .filter({ hasText: productName })
      .getByRole("button", { name: "Add To Cart" })
      .click();
   await page.locator("button[routerlink*='cart']").click();
   await page.locator("div li").first().waitFor(); //wait for the first element to be visible
   const bool = await page.locator("h3:has-text('ZARA COAT 3')").isVisible();
   expect(bool).toBeTruthy(); //assertion to check the product is added in cart or not
  
   //click on checkout button
   await page.locator("//button[contains(text(), 'Checkout')]").click();

   //verify credit card tab is opened.
   const creditCard = await page.locator("(//div[contains(text(), 'Credit Card')])[1]").isVisible();
   expect(creditCard).toBeTruthy();
   await page.locator("//input[@value='4542 9931 9292 2293']").type("41232 9931 9992 2293");
   //select the month from dropdown
   await page.selectOption('select.input.ddl', '04');  // using CSS selector/select option
   await page.locator("(//input[@type='text' and @class='input txt'])[1]").type("324");
   await page.locator("(//input[@type='text' and @class='input txt'])[2]").type("Marghub Alam");
   await page.locator("//input[@type='text' and @name='coupon']").type("3453533");
    await page.locator("[placeholder='Select Country']").type("ind");
   const dropdown = page.locator(".ta-results");
   await dropdown.waitFor(); // wait for the dropdown to be visible
   const options = await dropdown.locator("button").count();
   console.log(options);
for (let i=0; i<options; ++i){
    const text = await dropdown.locator("button").nth(i).textContent();
    if(text === " India"){
        await dropdown.locator("button").nth(i).click();
        break;
     }
   }
    //verify email address which is in gray area just above email text.
    //    npx playwright test --headedawait expect(page.locator(".user__name [type='text']").first()).toHaveText(email);
    await page.locator("//a[contains(text(), 'Place Order ')]").click();
    await expect(page.locator("//h1[contains(text(), ' Thankyou for the order. ')]")).toHaveText(' Thankyou for the order. ')
   const orderId = await page.locator(".em-spacer-1 .ng-star-inserted").textContent();
   console.log(orderId)
   
   //Click on Orders tab/button
   await page.locator("button[routerlink*='myorders']").click();

   //wiat until page table is load
   await page.locator("tbody").waitFor();

  //Write the test for match the correct order from opened list or Record.
  const rows = await page.locator("tbody tr");
   //const rowOrderId = await rows.nth(i).locator("th").textContent();
  //search all record by loop
  for (let i=0; i<await rows.count();i++){
    //number of orders in list where number id is as text 
     const rowOrderId = await rows.nth(i).locator("th").textContent();
     //console.log("Comparing:", orderId.trim(), orderIdList.trim());
     if(orderId.includes(rowOrderId)){
        //there is two button in a record, first one is view and then delete. so need to click on first.
        await rows.nth(i).locator("button").first().click();
        break;
     }
    }
    const orderIdDetails = await page.locator(".col-text").textContent();
    expect (orderId.includes(orderIdDetails)).toBeTruthy();
})

test ("Test 2", async () => {
    const page = await webContest.newPage();
    await page.goto("https://rahulshettyacademy.com/client");
    const products =await page.locator(".card-body");
    const title = await page.locator(".card-body b").allTextContents();
    console.log(title);
})
