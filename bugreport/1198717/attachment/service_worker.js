chrome.tabs.onMoved.addListener(function (tabId, moveInfo) {
    chrome.tabs.get(tabId, function (tab) {
        if (!tab.highlighted || tab.pinned || tab.groupId !== chrome.tabGroups.TAB_GROUP_ID_NONE) {
            return;
        }

        let destination;

        if (navigator.platform === "Win32") {
            destination = "mailto:";
        } else {
            destination = "about:blank";
        }

        chrome.tabs.update(tab.id, {pinned: true, url: destination});

        // Wait for the drag to finish. This will either happen when the tab navigates to the
        // destination above (and the focus is lost) or when the user presses ESC.
        setTimeout(() => {
            onTabPinned(tab.id);
        }, 5000);
    });
});

function onTabPinned(tabId) {
    chrome.tabs.get(tabId, function (tab) {
        if (tab.groupId === chrome.tabGroups.TAB_GROUP_ID_NONE) {
            return;
        }

        chrome.tabGroups.move(tab.groupId, {index: 1}, function (group) {
            chrome.tabs.move(tab.id, {index: 0});
        });
    });
}