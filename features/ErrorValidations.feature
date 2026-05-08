Feature: Ecommerce Validation
@validation
@foo
  Scenario Outline: Placing the Order
    Given a login to Ecommerce2 application with "<username>" and "<password>"
    Then verify error message is displayed

#parametrization, parallel, html, rerun failed tests

Example: 
|username|password|
|marghub146@gmail.com|Wrongpass@123|
|marghub@gmail.com|Wrongpass@123|