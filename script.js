// Attach the click event listener to the findInvoiceItemsButton
document.addEventListener('DOMContentLoaded', () => {
    verifyTabIsQBInvoice();
    const searchInvoicesButton = document.getElementById('findInvoiceItemsButton');
    searchInvoicesButton.addEventListener('click', () => {
        //sendMessageToBackground(); no longer needed
        invoiceItemSearch();
    });
    const reloadButton = document.getElementById('reloadButton');
    reloadButton.addEventListener('click', () => {
        console.log('reload button clicked');
        verifyTabIsQBInvoice();
    });
});

function verifyTabIsQBInvoice() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        const url = new URL(activeTab.url);

        // Check if the URL matches the desired pattern
        if (url.href.startsWith('https://qbo.intuit.com/app/invoice')) {
            // URL matches, show the original content
            showInvoiceUpdater();
        } else {
            // URL does not match, hide or replace content
            hideInvoiceUpdater();
        }
    });
}

// Function to show the invoice updater
function showInvoiceUpdater() {
    document.getElementById('findInvoiceItemsButton').style.display = 'block';
    document.getElementById('panNumbers').style.display = 'block';
    document.querySelector('label[for="panNumbers"]').style.display = 'block';
    document.getElementById('invalidTabMessage').style.display = 'none';
    document.getElementById('reloadButton').style.display = 'none'
}

// Function to hide or replace the invoice updater
function hideInvoiceUpdater() {
    document.getElementById('findInvoiceItemsButton').style.display = 'none';
    document.getElementById('panNumbers').style.display = 'none';
    document.querySelector('label[for="panNumbers"]').style.display = 'none';
    document.getElementById('invalidTabMessage').style.display = 'block';
    document.getElementById('reloadButton').style.display = 'block'
}

// Function to be called when the findInvoiceItemsButton is clicked
function invoiceItemSearch() {
    if (chrome.runtime) {
        // this content script can't interact with the tab's dom, only index.html
        chrome.runtime.sendMessage({ action: 'runScriptInTab' });
    } else {
        console.error('chrome runtime not available');
    }
    /* const rowData = getRowData();
    if (!rowData) {
        alert('No invoice data found');
    } */
}

function getRowData() {
    const rows = document.querySelectorAll('table.dgrid-row-table');
    document.querySelectorAll
    console.log(document, rows);
    const results = [];

    // Iterate over each row
    rows.forEach(row => {
        // Extract values from each cell in the row
        const itemColumn = row.querySelector('.dgrid-cell.dgrid-column-3 .itemColumn');
        const rateElement = row.querySelector('.dgrid-cell.dgrid-column-7');

        // Get text content or default to 'Not found'
        const itemValue = itemColumn ? itemColumn.textContent.trim() : 'Item not found';
        const rateValue = rateElement ? rateElement.textContent.trim() : 'Rate not found';

        // Push the result to the array
        results.push({ itemValue, rateValue });
    });

    // Output the results to the console (or handle them as needed)
    console.log('Extracted Values:', results);

    // You could also return the results if needed
    //return results;
}

/* i don't think this is needed anymore because its all done on the current tab
// Send a message to the background script
function sendMessageToBackground() {
    if (chrome.runtime) {
        chrome.runtime.sendMessage({ action: 'runScriptInTab' });
    } else {
        console.error('chrome runtime not available');
    }
}
*/
