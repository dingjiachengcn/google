let tabUpdatedListener = null;

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    console.log(tabId, changeInfo, tab);

    if (tabUpdatedListener) {
        tabUpdatedListener(tabId, changeInfo, tab);
    }
});

startProcess();

function startProcess() {
    let targetTab = null;

    chrome.tabs.create({url: "about:blank"}, function (tab) {
        targetTab = tab;
    });

    tabUpdatedListener = function (tabId, changeInfo, updatedTab) {
        if (targetTab
            && tabId === targetTab.id
            && changeInfo.status === "complete") {
            tabUpdatedListener = null;

            onTargetTabLoaded(targetTab);
        }
    };
}

function onTargetTabLoaded(tab) {
    chrome.debugger.attach({tabId: tab.id}, "1.3", function () {
        onDebuggerAttachedToTargetTab(tab);
    });
}

function onDebuggerAttachedToTargetTab(tab) {
    chrome.debugger.sendCommand({tabId: tab.id}, "Input.dispatchKeyEvent",
        {type: "rawKeyDown", key: "W", windowsVirtualKeyCode: 87, nativeVirtualKeyCode: 87,
            modifiers: 2});
}