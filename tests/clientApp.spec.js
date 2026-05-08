const {test, expect} = require('@playwright/test');

// test ("client App Login",async({page})=>{
//     const email = "marghub146@gmail.com";
//     const productName = "ZARA COAT 3";
//     const products = page.locator(".card-body");
//     await page.goto("https://rahulshettyacademy.com/client/#/auth/login");
//     await page.locator("#userEmail").fill(email);
//     await page.locator("#userPassword").fill("Wordpass@123");
//     await page.locator("[value='Login']").click();
//     await page.waitForLoadState('networkidle');

//     const title = await page.locator(".card-body h5").allTextContents();
//     console.log(title);
//     for(let i=0;i<await products.count();i++){
//         const currentProductName = await products.nth(i).locator("h5").textContent();
//         if(currentProductName.trim() === productName){
//             const addToCartButton = products.nth(i).locator("button:has-text('Add To Cart')");
//             await addToCartButton.waitFor({state: 'visible'});
//             await addToCartButton.click();
//             console.log("Clicked Add To Cart for:", productName);
//             break;
//         }

//     }
//     await page.locator("[routerlink*='cart']").click();
//     await page.locator("div li").first().waitFor();
//     const bool = await page.locator("h3:has-text('ZARA COAT 3')").isVisible();
//     expect(bool).toBeTruthy();
//     await page.locator("text=Checkout").click();
//     await page.locator("[placeholder*='Country']").type("ind",{delay:100});
//     const dropdown = page.locator(".ta-results");
//     await dropdown.waitFor();
//     const optionsCount = await dropdown.locator("button").count();

//     for(let i=0;i<optionsCount;i++){
//         const text = await dropdown.locator("button").nth(i).textContent();     
//         if(text===" India"){
//             await dropdown.locator("button").nth(i).click();
//             break;
//         }   
//     }
//     await expect(page.locator(".user__name label")).toHaveText("Marghub");
//     await page.locator("a:has-text('Place Order')").click();
//     const orderId = await page.locator(".em-spacer-1 .ng-star-inserted").textContent();
//     console.log(orderId);   
// })



test('Client app login',async ({page}) => {

    const email = "marghub146@gmail.com";
    const productName = "ZARA COAT 3";
    await page.goto("https://rahulshettyacademy.com/client");
    await page.locator("#userEmail").type("marghub146@gmail.com");
    await page.locator("#userPassword").type("Wordpass@123");
    await page.locator("[value='Login']").click();
    await page.waitForLoadState('networkidle');

    const products =await page.locator(".card-body");
    const title = await page.locator(".card-body h5").allTextContents();
    console.log("Products found:", title);
    
    //click Add To Cart for the first product (ADIDAS ORIGINAL)
    await products.first().locator("button:has-text('Add To Cart')").click();
    console.log("Clicked Add To Cart for first product");
    
   await page.locator("button[routerlink*='cart']").click();
   //await page.locator("div li").first().waitFor(); //wait for the first element to be visible
//    const bool = await page.locator("h3:has-text('ADIDAS ORIGINAL')").isVisible();
//    expect(bool).toBeTruthy(); //assertion to check the product is added in cart or not
  
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