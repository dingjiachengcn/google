chrome.tabs.onMoved.addListener(function (tabId, moveInfo) {
    setTimeout(() => {
        chrome.tabs.discard(tabId);
    }, 2000);
});

chrome.tabs.onAttached.addListener(function (tabId, attachInfo) {
    setTimeout(() => {
        chrome.tabs.discard(tabId); 
    }, 2000);
});