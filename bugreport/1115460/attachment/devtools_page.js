chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message === "create-and-show-panel") {
        createAndShowPanel(sendResponse);
        return true;
    } else if (message === "update-homepage-setting") {
        updateHomepageSetting(sendResponse);
        return true;
    }
});

chrome.runtime.sendMessage(undefined, "devtools-page-loaded");

function createAndShowPanel(sendResponse) {
    let channel = new MessageChannel();
    parent.postMessage("registerExtension", "*", [channel.port2]);

    const panelCreationRequestId = 1;
    channel.port1.postMessage({command: "createPanel", id: "extension-panel",
        title: "Extension panel", page: "panel.html", requestId: panelCreationRequestId});

    channel.port1.addEventListener("message", function (event) {
        let request = event.data;

        if (request.command === "callback" && request.requestId === panelCreationRequestId) {
            channel.port1.postMessage({command: "showPanel", id: "extension-panel"});

            setTimeout(() => {
                sendResponse();
            }, 1000);
        }
    });

    channel.port1.start();
}

function updateHomepageSetting(sendResponse) {
    // The homepage URL needs to be contained on a single line, which is why the newlines here are
    // escaped. Also, note that homepage_is_newtabpage needs to be set to false, otherwise the new
    // tab page will be returned when requesting the homepage:
    //
    // https://source.chromium.org/chromium/chromium/src/+/master:chrome/browser/profiles/profile_impl.cc;l=1505;drc=23f61cb65a94208dc2c4728e895e87d47f64a8b6
    let homepageUrl = `javascript:window.debuggerInputEx = {};\
    window.debuggerInputEx.chromeInspectScriptUrl = "${chrome.runtime.getURL("chrome_inspect.js")}";\
    window.debuggerInputEx.devtoolsScriptUrl = "${chrome.runtime.getURL("devtools.js")}";\
    window.debuggerInputEx.notifierPageUrl = "${chrome.runtime.getURL("notifier.html")}";\
    let script = document.createElement("script");\
    script.src = "${chrome.runtime.getURL("devtools_not_connected.js")}";\
    document.head.appendChild(script);`;
    chrome.devtools.inspectedWindow.eval(`chrome.settingsPrivate.setPref('homepage_is_newtabpage', false);
    chrome.settingsPrivate.setPref('homepage', '${homepageUrl}');`);

    setTimeout(() => {
        sendResponse();
    }, 1000);
}