chrome.runtime.onInstalled.addListener(function () {
    setTimeout(() => {
        chrome.runtime.reload();
    }, 3000);


    debugger;
});