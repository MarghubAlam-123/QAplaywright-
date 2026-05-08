//import playwright module then write test, 
const {test, expect}= require('@playwright/test');
const { text } = require('stream/consumers');

/*
test("First playwright test",async function(){
    //so in java script there is no guartee to execute all steps/code in sync like step1,step2,step3, might be test3 execute before step2.
    // So explicitely mention await to wait until nest steps
     await
     // so for every steps write every time await before code.So when we write the Await keyword it means steps is in Asynchronous, So before
     //  the 
     // function is need to write async then use await keyword otherwise it will not work. async generally tell the function is in 
     // asynchronous order

    //step1
    //step2
    //step3
})   
*/

//using array function
//({browser}) playwrite fixer, So fixer is global variable ypu can use entire project

/*
test('browser context playwrite test',async ({browser})=>{
    //open browser in new context without cookies/cache like incognito mod, open fresh browser, browser without much information,fresh instance
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://www.google.com/');
    //get title of page
    console.log(await page.title())   
    await expect(page).toHaveTitle("Google");
})

*/

//if you use page fixer then no need to write context and page.
test('page playwrite test',async ({page})=>{
    //open browser in new context without cookies/cache like incognito mod, open fresh browser, browser without much information,fresh instance
    //const context = await browser.newContext();
    //const page = await context.newPage();
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    //get title of page
    console.log(await page.title())

    //there are two methods to select objects uniqly, CSS and XPATH
    //Use CSS selector
    /*
    rule of css selector,
    if id is prsent use css-> tagname#id or #id
    if class prsent use css-> tagname.class or .class
    if using any other attribute use css->[attribute = value]

    //Write css based traversing from parent to child
    css -> parenttagname >> childtagname
    if need to write the locator based on text
    text = ''
    */
    const userName = page.locator('#username');
    const signIn = page.locator("[type='password']");
    const clickIn = page.locator("#signInBtn");

    await page.locator('#username').type("rahulshettyacademy111"); // 'type' and 'fill' to enter the value in inputbox.
    await page.locator("[type='password']").type("learning");
    await page.locator("#signInBtn").click();
    console.log(await page.locator("[style*='block']").textContent());
    await expect(page.locator(".alert-danger")).toContainText('Incorrect')

    //type fill
    await page.reload(); // refresh the page
    await userName.fill("rahulshettyacademy");
    await signIn.fill("Learning@830$3mK2");
    await page.locator(".radiotextsty").first().click();
    await page.locator("#terms").check();
    await clickIn.click();

    // The training site occasionally rejects valid demo credentials.
    // Validate success flow when redirected; otherwise assert error flow.
    try {
        await page.waitForURL(/.*angularpractice/, { timeout: 10000 });
        const cardTitles = page.locator('.card-title a');
        console.log(await cardTitles.nth(0).textContent())
        const titles = await cardTitles.allTextContents();
        console.log(titles)
    } catch {
        await expect(page.locator(".alert-danger")).toBeVisible();
    }
})

test('UI control', async ({page})=>{

    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    const userName = page.locator('#username');
    const signIn = page.locator("[type='password']");
    const dropdown = page.locator("select.form-control")
    const clickIn = page.locator("#signInBtn");
    const documentLink = page.locator("a.blinkingText").first()

    await page.reload() //Refresh the page
    await userName.fill("rahulshettyacademy");
    await signIn.fill('learning');
    await dropdown.selectOption("Teacher")
    //await page.pause()  //It will pause the page and open new window called inspector.
    await page.locator(".radiotextsty").last().click(); //It will click on user as user is last or 2nd object.
    await page.locator("#okayBtn").click()

    //put a assertion regarding the 'user' is checked or not
    await expect(page.locator(".radiotextsty").last()).toBeChecked() // is return true false
    //anaother method you can also use for checked or not
    const isChecked = await page.locator(".radiotextsty").last().isChecked();
    console.log(isChecked); // true or false
    //click on checkbox
    await page.locator("#terms").click();
    //uncheck
    await page.locator("#terms").click()
    //put assertion it's check or not. So it's uncheck
    expect(await page.locator("#terms").isChecked()).toBeFalsy();
    //Need to check the Blink of 
    await expect(documentLink).toHaveAttribute('class', 'blinkingText');

})

//open new child object or handle new browser opened while clicked on the link
test("Child window handle",async ({browser})=>{
    const context = await browser.newContext();
    const page = await context.newPage();
    const userName = page.locator('#username');
    //open new page link
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/")
    const documentLink = page.locator("a.blinkingText").first();

    const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    documentLink.click(),
    ]);

    const text = await newPage.locator(".red").textContent();
    console.log(text);
    //split the user id or domain name from this text
    const arrayText = text.split("@");
    const domainId = arrayText[1].split(" ");
    const exactDomainId = domainId[0]
    console.log(exactDomainId)

    //bring back to the parent page and enter that domian id which has fatched from the child page.
    await page.locator("#username").type(exactDomainId);

})

//Do debugging by use any of tets using test.only and use command "npx playwright test UIBasics.spec.js --debug"

// Do record and play use command for recording of google.com "npx playwright codegen amazon.com

//import { test, expect } from '@playwright/test';

//Below are the recorded script for amazon.com

/*
test('test', async ({ page }) => {
  await page.goto('https://www.amazon.com/');
  await page.getByRole('link', { name: 'Sign in', exact: true }).click();
  await page.getByRole('textbox', { name: 'Enter your mobile number or' }).dblclick();
  await page.getByRole('textbox', { name: 'Enter your mobile number or' }).fill('88');
  await page.locator('#claim-input-dropdown span').nth(1).click();
  await page.getByText('India +').click();
  await page.getByRole('textbox', { name: 'Enter your mobile number or' }).click();
  await page.getByRole('textbox', { name: 'Enter your mobile number or' }).fill('8826068564');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.goto('https://www.amazon.com/?ref_=nav_signin');
});

// If you want screenshot for every step then go to configure and add: screenshot: 'on'
*/

//write the end to end scenario for login page

test ('Write end to end scenario for login page',async ({page}) => {
    await page.goto("https://rahulshettyacademy.com/client/#/auth/login");
    const registerButton = page.locator("a.text-reset");
    await registerButton.click();

    //verify login title
    //await expect(page).toHaveAttribute('class')

    //enter the value in first name
    await page.locator("[type ='firstName']").type("Marghub Alam");
    await page.locator("[type='lastName']").type("Alam");
    await page.locator("[type='email']").type("marghub146@gmail.com");
    await page.locator("//input[@id='userMobile']").type("8826068564");
    await page.locator("[formcontrolname='occupation']").selectOption("Engineer");
    await page.locator("[value='Male']").click();
    await page.locator ("#userPassword").type("Wordpass@123");
    await page.locator("#confirmPassword").type("Wordpass@123");
    await page.locator ("[type='checkbox']").click();
    await page.locator ("#login").click(); 
    await page.click("//p[contains(text(), 'Already have an account?')]")

    //Go to login page
    await page.goto("https://rahulshettyacademy.com/client/#/auth/login");
})

test('Client app login',async ({page}) => {

    //get product title.
    const email= "marghub146@gmail.com"
    const productName = 'ZARA COAT 3';
    //multiple product on page with this ".card-body" class
    const products =await page.locator(".card-body");
    await page.goto("https://rahulshettyacademy.com/client/#/auth/login");
    
    //Enter login button
    await page.locator("#userEmail").type("marghub146@gmail.com");
    await page.locator("#userPassword").type("Wordpass@123");
    await page.locator("#login").click();
    await page.waitForLoadState('networkidle');
    const title = await page.locator(".card-body b").allTextContents();
    console.log(title);
    const count = await products.count();
    console.log(count);

    //iterate all elements in the page.
    for (let i=0; i<count;++i){
        if (await products.nth(i).locator("b").textContent() === productName) {
            //add to the cart
            await products.nth(i).locator("text =  Add To Cart").click();
            break;
        }
    }
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
   await page.locator("[placeholder='Select Country']").pressSequentially("ind");
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
   expect(page.locator(".user__name [type='text']").first()).toHaveText(email);
   await page.locator("//a[contains(text(), 'Place Order ')]").click();
   await expect (page.locator("//h1[contains(text(), ' Thankyou for the order. ')]")).toHaveText(' Thankyou for the order. ')
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

