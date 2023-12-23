let urls = new Array(3);
urls.fill("about:blank");

chrome.windows.create({url: urls, focused: true}, function (newWindow) {
    let secondTab = newWindow.tabs.find(function (tab) {
        return tab.index === 1;
    });

    let thirdTab = newWindow.tabs.find(function (tab) {
        return tab.index === 2;
    });

    if (!secondTab || !thirdTab) {
        return;
    }

    chrome.tabs.group({tabIds: secondTab.id});
    chrome.tabs.group({tabIds: thirdTab.id});

    setTimeout(() => {
        chrome.tabs.ungroup(secondTab.id);
    }, 5000);
});