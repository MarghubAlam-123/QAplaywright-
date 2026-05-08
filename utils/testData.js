
const loginPayload = {
    userEmail: "marghub146@gmail.com",
    userPassword: "Wordpass@123"
};

const orderPayload = {
    orders: [{
        country: "India",
        ProductOrderId: "6960eac0c941646b7a8b3e68"
    }]
};

const productName = "ZARA COAT 3";
const countrySearch = "ind";
const countryName = "India";
const orderSuccessMessage = "THANKYOU FOR THE ORDER.";
const clientAppTestData = [{
    testName: "Login Payload 1",
    loginPayload:{
        userEmail: "marghub146@gmail.com",
        userPassword: "Wordpass@123"    
    },
    productName: "ZARA COAT 3",
}, 
{
    testName: "Login Payload 2",
    loginPayload:{
        userEmail: "marghub146@gmail.com",
        userPassword: "Wordpass@123"    
    },
    productName: "ADIDAS ORIGINAL",
}];
module.exports = { loginPayload, orderPayload, productName, countrySearch, countryName, orderSuccessMessage, clientAppTestData };
