chrome.webNavigation.onDOMContentLoaded.addListener(({ tabId, url, frameId }) => {
    if (!url.startsWith("http") || frameId) {
        // Only change http (e.g. not chrome://) and top-level URLs.
        return;
    }
    console.info(`Going to attach and script on tab ${tabId}. url = ${url}`);
    chrome.debugger.attach({ tabId }, "1.3", () => {
        checkError("debugger.attach");
        chrome.debugger.sendCommand({ tabId }, "Runtime.evaluate", {
            expression: `
                document.documentElement.style.backgroundColor = "yellow";
                document.body.textContent = "";
                document.documentElement.appendChild(document.createElement("div")).textContent = "Added by chrome.debugger API";
            `,
        }), () => {
            checkError("debugger.sendCommand + Runtime.evaluate");
            chrome.debugger.detach({ tabId }, () => {
                checkError("debugger.detach");
                console.log("Done");
            });
        };
    });
});

function checkError(description) {
    const msg = chrome.runtime.lastError?.message;
    if (msg) {
        console.error(`Error while trying ${description}, error = ${msg}`);
    }
}
