# Playwright E-commerce Test Suite - AI Coding Agent Instructions

## Project Overview
This is a **Playwright end-to-end test suite** for a Rahul Shetty Academy e-commerce application. The project tests authentication, product browsing, cart management, checkout flows, and API integrations using both UI automation and REST API calls. Tests are written in JavaScript with Playwright framework.

## Architecture & Key Components

### Test Structure (`/tests`)
- **UI Tests**: `clientApp.spec.js`, `UIBasics.spec.js`, `calender.spec.js` - Direct browser interaction tests
- **Hybrid Tests**: `webApiPart1.spec.js`, `webApiPart2.spec.js` - Combined API setup with UI validation
- **Specialized Tests**: `upload-download.spec.js` - File operations with ExcelJS library
- **Examples**: `tests-examples/demo-todo-app.spec.js` - Reference implementations

### Core Dependencies
- `@playwright/test@^1.53.1` - Test framework (ESM + CommonJS support)
- `exceljs@^4.4.0` - Excel file manipulation (required for upload-download tests)
- `@types/node@^24.0.4` - Type definitions

### Configuration (`playwright.config.js`)
- **Test Directory**: `./tests/` (recursively scans `.spec.js` files)
- **Timeout**: 30 seconds per test, 10 seconds for assertions
- **Reporter**: HTML report generation in `./playwright-report/`
- **Browser**: Chromium, non-headless mode by default
- **Screenshots & Traces**: Enabled for debugging (on/retain-on-failure modes)

### State Management
- `state.json` - Persisted browser storage (cookies, localStorage) for authenticated sessions
- Pattern: Use `test.beforeAll()` to login once, save state, reuse across tests via `storageState` option

## Critical Workflows

### Running Tests
```bash
# Run specific test (configured in package.json)
npm test

# Run all tests
npx playwright test

# Run with UI mode (interactive debugging)
npx playwright test --ui

# Run single file
npx playwright test tests/clientApp.spec.js --headed

# Run with specific browser
npx playwright test --chromium --headed
```

### Debugging Workflow
- Tests run **non-headless** by default (see UI)
- **Screenshots** captured for each step in `test-results/` directory
- **Traces** saved for failed tests (view with `npx playwright show-trace <trace-file>`)
- Check `playwright-report/index.html` for detailed HTML reports

## Project-Specific Patterns & Conventions

### 1. Locator Strategies
- **CSS Selectors**: Preferred when id/class available
  ```javascript
  page.locator('#userEmail')              // id
  page.locator('[type="password"]')       // attribute
  page.locator('.card-body')              // class
  ```
- **XPath**: Used for complex/text-based selectors
  ```javascript
  page.locator("//button[contains(text(), 'Checkout')]")
  page.locator("(//input[@type='text'])[1]")
  page.locator("//a[contains(text(), 'Place Order')]")
  ```
- **Text Matching**: Playwright's `:has-text()` for dynamic content
  ```javascript
  page.locator("h3:has-text('ZARA COAT 3')")
  page.locator("text = Add To Cart")
  ```

### 2. E-commerce Test Flow Pattern (See `webApiPart2.spec.js`)
All test flows follow: **Login → Browse Products → Add to Cart → Checkout → Verify Order**
- Use loops to iterate `.card-body` collection to find product by name
- Extract product title with `.locator("b").textContent()`
- Use XPath for form-heavy checkout flow (multiple overlapping inputs)

### 3. API + UI Hybrid Tests (See `webApiPart1.spec.js`)
- **API Setup**: Use `test.beforeAll()` with `request` context for login & order creation
- **Token Handling**: Store token in `window.localStorage` via `page.addInitScript()`
- **Pattern**: API creates order data → UI navigates with token → Verify order displayed
```javascript
page.addInitScript(value => {
    window.localStorage.setItem('token', value);
}, token);
```

### 4. Session Persistence (See `webApiPart2.spec.js`)
```javascript
test.beforeAll(async({browser})=> {
    const context = await browser.newContext();
    // ... login steps ...
    await context.storageState({path:'state.json'});  // Save session
    webContext = await browser.newContext({storageState:'state.json'});  // Reuse
})
test('test name', async () => {
    const page = await webContext.newPage();  // Authenticated page
})
```

### 5. Async/Await Discipline
- **All interactions require `await`** (navigation, clicks, fills, waits)
- Always declare `async` in test functions and callbacks
- Use `await page.waitForLoadState('networkidle')` after login/navigation
- Wait for dynamic elements: `await dropdown.waitFor()` before interaction

### 6. File Operations (See `upload-download.spec.js`)
- **Excel Library**: ExcelJS for read/write operations
- **File Paths**: Use `path.join(os.homedir(), 'Downloads', 'download.xlsx')`
- **Excel Operations**:
  ```javascript
  const workbook = new excelJS.Workbook();
  await workbook.xlsx.readFile(filepath);
  const worksheet = workbook.getWorksheet("Sheet1");
  const cell = worksheet.getRow(rowNum).getCell(colNum);
  cell.value = newValue;
  await workbook.xlsx.writeFile(filepath);
  ```

### 7. Dropdown Interactions (Recurring in Checkout)
```javascript
// For autocomplete dropdowns (country selection)
const dropdown = page.locator(".ta-results");
await dropdown.waitFor();
const options = await dropdown.locator("button").count();
for (let i=0; i<options; ++i) {
    const text = await dropdown.locator("button").nth(i).textContent();
    if (text === " India") {
        await dropdown.locator("button").nth(i).click();
        break;
    }
}

// For <select> elements (e.g., credit card month)
await page.selectOption('select.input.ddl', '04');
```

## Common Test Data

### Default Credentials (Application)
- **Email**: `marghub146@gmail.com`
- **Password**: `Wordpass@123`
- **Product IDs**: Use `68c7104bf669d6cb0accab5a` for ZARA COAT 3 in API calls
- **Target Product**: "ZARA COAT 3" (frequently used test case)

### Base URLs
- **UI**: `https://rahulshettyacademy.com/client` (modern Angular app)
- **API**: `https://rahulshettyacademy.com/api/ecom/`

## Integration Points

### API Endpoints (From `webAPIpart1.spec.js`)
- **Login**: `POST /auth/login` → Returns `token`
- **Create Order**: `POST /order/create-order` → Returns `{orders: [orderId]}`
- **Get Orders**: Used in UI after token stored locally

### Required Headers for Authenticated API Calls
```javascript
headers: {
    'Authorization': token,
    'Content-Type': 'application/json'
}
```

## When Adding New Tests

1. **Decide test type**: Pure UI, Pure API, or Hybrid (recommended for checkout flows)
2. **Use existing patterns**: Copy structure from similar test (e.g., UI pattern from `clientApp.spec.js`)
3. **Session handling**: Use `state.json` pattern for multi-test runs
4. **Locator specificity**: Prefer CSS selectors for performance; use XPath only when necessary
5. **File output**: Check `test-results/` after run for debugging (screenshots, traces)
6. **Run command**: Test via `npx playwright test --headed tests/newfile.spec.js`

## Key Files Reference
- [playwright.config.js](playwright.config.js) - Test configuration (timeout, reporter, trace settings)
- [package.json](package.json) - Dependencies and npm scripts
- [tests/webApiPart1.spec.js](tests/webApiPart1.spec.js) - Best example of API+UI hybrid pattern
- [tests/upload-download.spec.js](tests/upload-download.spec.js) - ExcelJS integration example
- [tests/UIBasics.spec.js](tests/UIBasics.spec.js) - CSS/XPath selector patterns
