/**
 * Upload-Download Test Suite
 * Tests for downloading files, modifying Excel spreadsheets, and uploading them back
 * Uses exceljs library to manipulate Excel files
 */

const excelJS = require('exceljs');
const path = require('path');
const os = require('os');
const {test,expect} = require('@playwright/test');

// Define downloads directory in a cross-platform way
const downloads = path.join(os.homedir(), 'Downloads');

/**
 * Function to update a single fruit price in Excel
 * @param {string} searchText - Fruit name to search for
 * @param {string} replaceText - New price value
 * @param {object} change - Object with colChange property to specify column offset
 * @param {string} filepath - Path to the Excel file
 */
async function writeExcelTest(searchText,replaceText,change,filepath){
  
    // Read the Excel file and get the active workbook
    const workbook = new excelJS.Workbook();
    await workbook.xlsx.readFile(filepath);
    
    // Get the first worksheet named "Sheet1"
    const worksheet = workbook.getWorksheet("Sheet1");
    
    // Find the cell containing the search text (fruit name)
    const output = await readExcel(worksheet,searchText);
    
    // Get the cell at the found row and calculate column with offset
    const cell = worksheet.getRow(output.row).getCell(output.col+change.colChange);
    console.log('Original value:', cell.value);
    
    // Update the cell value with the new price
    cell.value = replaceText;
    console.log('New value:', cell.value);
    
    // Save the modified workbook back to the file
    await workbook.xlsx.writeFile(filepath);
}

/**
 * Function to update multiple fruit prices at once
 * Iterates through the fruitPrices object and updates each fruit's price in the Excel file
 * @param {object} fruitPrices - Object with fruit names as keys and new prices as values
 * @param {string} filepath - Path to the Excel file
 */
async function updateMultipleFruits(fruitPrices, filepath){
    // Read the Excel file
    const workbook = new excelJS.Workbook();
    await workbook.xlsx.readFile(filepath);
    const worksheet = workbook.getWorksheet("Sheet1");
    
    // Loop through each fruit and its corresponding price
    for (const [fruitName, newPrice] of Object.entries(fruitPrices)){
        // Find the cell containing the fruit name
        const output = await readExcel(worksheet, fruitName);
        
        // If fruit is found (row !== -1), update its price
        if(output.row !== -1){
            // Get the price cell (2 columns to the right of the fruit name)
            const cell = worksheet.getRow(output.row).getCell(output.col + 2);
            console.log(`Updating ${fruitName}: ${cell.value} -> ${newPrice}`);
            cell.value = newPrice;
        } else {
            console.log(`${fruitName} not found in the spreadsheet`);
        }
    }
    
    // Save all changes to the Excel file
    await workbook.xlsx.writeFile(filepath);
    console.log('All fruits updated successfully');
}

/**
 * Function to find a cell value in Excel worksheet
 * Searches through all rows and columns to locate the searchText
 * @param {object} worksheet - The Excel worksheet object
 * @param {string} searchText - The text to search for (e.g., fruit name)
 * @returns {object} Object with row and col properties indicating cell position, or {row:-1, col:-1} if not found
 */
async function readExcel(worksheet,searchText){
    let output = {row:-1, col:-1};
    
    // Iterate through each row in the worksheet
    worksheet.eachRow((row, rowNumber) => {
      // Iterate through each cell in the current row
      row.eachCell((cell, colNumber) => { 
        // If cell value matches the search text, save its position
        if (cell.value === searchText) {
            output.row = rowNumber;
            output.col = colNumber;      
        }
      });
    });
    return output;
}
//writeExcelTest("Mango", 211, {rowChange:0, colChange: 2}, filePath)

/**
 * Test: Download Excel file, update fruit prices, and upload the modified file
 * 
 * Steps:
 * 1. Navigate to the upload-download test page
 * 2. Download the Excel file
 * 3. Update prices for multiple fruits (Mango, Apple, Papaya, Banana, Orange, Kivi)
 * 4. Upload the modified Excel file back to the website
 */
test ("upload downloaded excel file and write to it", async ({ page }) => {
    // Navigate to the test website
    await page.goto('https://rahulshettyacademy.com/upload-download-test/index.html');
    
    // Set up a promise to wait for the file download event
    const downloadPagePromise = page.waitForEvent('download');
    
    // Click the Download button to initiate file download
    await page.getByRole('button', { name: 'Download' }).click();
    
    // Wait for the download to complete
    const download = await downloadPagePromise;
    const downloadedFilePath = path.join(downloads, download.suggestedFilename());
    await download.saveAs(downloadedFilePath);
    //await writeExcelTest("Mango", "211", {rowChange:0, colChange: 2}, filePath);
    // Define fruit prices to update
    const fruitPrices = {
        "Mango": "100",
        "Apple": "200",
        "Papaya": "300",
        "Banana": "400",
        "Kivi": "500",
        "Orange": "500"
    };
    
    // Update all fruit prices in the Excel file
    await updateMultipleFruits(fruitPrices, downloadedFilePath);
    
    // Click the file input element to open file picker
    await page.locator('input[type="file"]').click();
    
    // Upload the modified Excel file
    await page.locator('input[type="file"]').setInputFiles(downloadedFilePath);
});
