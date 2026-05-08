#You can run multiple scenarios in feature file parallel, but you can not run multiple feature file parallel.
Feature: Ecommerce Validation
   @smoke
  Scenario: Placing the Order
    Given a login to Ecommerce application with "marghub146@gmail.com" and "Wordpass@123"
    When Add "Zara Coat 3" to the cart
    Then verify "Zara Coat 3" is displayed in the cart
    When Enter valid details and palce the order
    Then Verify order in present in orderHistory

  Scenario: Validate the user can proceed to checkout
    Given the user has added a product to the cart
    When the user clicks on "Cart"
    And the user clicks on "Proceed to Checkout"
    Then the user should be redirected to the checkout page

