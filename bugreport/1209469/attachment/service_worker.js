chrome.runtime.onInstalled.addListener(function () {
    let urls = new Array(3);
    urls.fill("about:blank");

    chrome.windows.create({url: urls}, function (newWindow) {
        let sortedTabs = newWindow.tabs;
        sortedTabs.sort(function (first, second) {
            return first.index - second.index;
        });

        chrome.tabs.group({tabIds: [sortedTabs[0].id, sortedTabs[1].id]}, function (groupId) {
            onTabsGrouped(newWindow, groupId);
        });
    });
});

function onTabsGrouped(newWindow, groupId) {
    // Note that index 1 is in the middle of the existing group. Therefore, the tab will be added to
    // that group, even though it's pinned.
    chrome.tabs.create({windowId: newWindow.id, index: 1, pinned: true, url: "about:blank"},
        function (tab) {
            onPinnedTabCreated(tab, groupId);
        });
}

function onPinnedTabCreated(pinnedTab, groupId) {
    chrome.tabGroups.move(groupId, {index: -1}, function () {
        chrome.tabs.move(pinnedTab.id, {index: 0});
    });
}