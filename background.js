// Function to execute a script in a specific tab by ID
function executeScriptInTab(tabId) {
    chrome.scripting.executeScript({
        target: { tabId: tabId },
        function: queryDgridRowTables
    }, (results) => {
        // Results will be an array of results from the executed script
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
        } else {
            console.log('Results:', results);
        }
    });
}

// Function to query '.dgrid-row-table' elements in the page
function queryDgridRowTables() {
    const tables = document.querySelectorAll('.dgrid-row-table');
    const rows = document.querySelectorAll('.dgrid-row');
    const rowsResult = Array.from(rows).map(row => {
        return {
            html: row.outerHTML
        };
    });
    const result = Array.from(tables).map(table => {
        return {
            html: table.outerHTML
        };
    });
    console.log('rows found:', rowsResult);
    console.log('Tables found:', result);
    return result;
}

// Query tabs based on certain criteria and execute script in the found tab
function queryAndExecuteScript(scriptFile) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
            const currentTab = tabs[0];
            executeScriptInTab(currentTab.id);
        } else {
            console.log('No active tab found.');
        }
    });
}

// Handle messages from popup or other parts of the extension
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'runScriptInTab') {
        queryAndExecuteScript('script.js');
    }
});

