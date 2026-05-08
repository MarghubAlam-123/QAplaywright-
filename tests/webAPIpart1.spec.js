const { test, expect, request } = require('@playwright/test');

const loginPayload = {userEmail: "marghub146@gmail.com", userPassword: "Wordpass@123" };
let token; // Declare token outside to share between hooks and tests
let orderId;

test.beforeAll( async () => {
    const apiContext = await request.newContext();

    //First API Call
    const loginResponse = await apiContext.post("https://rahulshettyacademy.com/api/ecom/auth/login",
     {
        data: loginPayload
     });//200, 201, 400, 401
     expect(loginResponse.ok()).toBeTruthy();
     const loginResponseJson = await loginResponse.json(); // Await the promise
     token = loginResponseJson.token;
     console.log(token);

    //Fetch live product list to avoid stale hardcoded product ids
    const productResponse = await apiContext.post("https://rahulshettyacademy.com/api/ecom/product/get-all-products",
      {
        headers: { 'Authorization': token, 'Content-Type': 'application/json' },
        data: {}
      }
    );
    expect(productResponse.ok()).toBeTruthy();
    const productResponseJson = await productResponse.json();
    const product = productResponseJson.data.find((item) => item.productName === "ZARA COAT 3");
    expect(product).toBeTruthy();

    //add another new api call
    const orderResponse = await apiContext.post("https://rahulshettyacademy.com/api/ecom/order/create-order",
        {
            data: {
              orders: [
                {
                  country: "Cuba",
                  productOrderedId: product._id,
                }
              ]
            },
            headers: {  'Authorization': token,
                        'Content-Type': 'application/json'
                     },
        }
    );
    expect(orderResponse.ok()).toBeTruthy();
    const orderResponseJson = await orderResponse.json();
    console.log(orderResponseJson);
    orderId = orderResponseJson.orders[0];
});



test('@API place the order',async ({page}) => {

     page.addInitScript( value => {
     window.localStorage.setItem('token', value);
     }, token);
    await page.goto("https://rahulshettyacademy.com/client/#/auth/login");
   
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
     if(orderId.includes(rowOrderId.trim())){
        //there is two button in a record, first one is view and then delete. so need to click on first.
        await rows.nth(i).locator("button").first().click();
        break;
     }
    }
    const orderIdDetails = await page.locator(".col-text").textContent();
    expect (orderId.includes(orderIdDetails.trim())).toBeTruthy();
})
