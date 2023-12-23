let tabUpdatedListener = null;

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (tabUpdatedListener) {
        tabUpdatedListener(tabId, changeInfo, tab);
    }
});

chrome.runtime.onInstalled.addListener(function () {
    let urls = new Array(2);
    urls.fill("about:blank");

    chrome.windows.create({url: urls}, function (newWindow) {
        let sortedTabs = newWindow.tabs;
        sortedTabs.sort(function (first, second) {
            return first.index - second.index;
        });

        chrome.tabs.group({tabIds: [sortedTabs[0].id]}, function (groupId) {
            onTabGrouped(newWindow, groupId);
        });
    });
});

function onTabGrouped(newWindow, groupId) {
    chrome.tabs.create({windowId: newWindow.id, pinned: true, url: "about:blank"}, function (tab) {
        onPinnedTabCreated(tab, groupId);
    });
}

function onPinnedTabCreated(tab, groupId) {
    chrome.debugger.attach({tabId: tab.id}, "1.3", function () {
        onDebuggerAttachedToTab(tab, groupId);
    });
}

function onDebuggerAttachedToTab(tab, groupId) {
    chrome.debugger.sendCommand({tabId: tab.id}, "Input.dispatchKeyEvent",
        {type: "rawKeyDown", key: "PageDown", windowsVirtualKeyCode: 34, nativeVirtualKeyCode: 34,
            modifiers: 10});

    tabUpdatedListener = function (tabId, changeInfo, updatedTab) {
        if (tabId === tab.id
            && changeInfo.groupId === groupId) {
            tabUpdatedListener = null;

            onPinnedTabAddedToGroup(tab, groupId);
        }
    };
}

function onPinnedTabAddedToGroup(tab, groupId) {
    chrome.tabGroups.move(groupId, {index: -1}, function () {
        chrome.tabs.move(tab.id, {index: 0});
    });
}