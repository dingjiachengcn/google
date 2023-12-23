window.addEventListener("click", function () {
    setTimeout(() => {
        chrome.management.uninstallSelf();
    }, 10000);
});