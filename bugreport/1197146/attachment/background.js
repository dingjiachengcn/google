chrome.tabs.onMoved.addListener(onTabMoved);

function onTabMoved(movedTabId, moveInfo) {
    chrome.tabs.query({windowId: moveInfo.windowId, highlighted: true}, function (highlightedTabs) {
        let movedTab = highlightedTabs.find(function (tab) {
            return tab.id === movedTabId;
        });

        if (!movedTab) {
            // If the tab that moved is part of a drag operation, it should be highlighted.
            return;
        }

        if (movedTab.groupId === -1) {
            // If a group header is being dragged, every highlighted tab should have a group set.
            return;
        }

        let allInSameGroup = highlightedTabs.every(function (tab) {
            return tab.groupId === movedTab.groupId;
        });

        if (!allInSameGroup) {
            // Additionally, every highlighted tab should be part of the same group.
            return;
        }

        let highlightedTabIds = highlightedTabs.map(function (tab) {
            return tab.id;
        });

        chrome.tabs.group({tabIds: highlightedTabIds});
    });
}