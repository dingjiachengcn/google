chrome.tabs.create({url: "page.html"});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message === "close-tab" && sender.tab) {
        chrome.tabs.remove(sender.tab.id);
    }
});