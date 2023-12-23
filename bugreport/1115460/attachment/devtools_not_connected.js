documentReady(function () {
    // Note that properties within debuggerInputEx are set up before this script is executed.
    let pin = pinnedFunction.toString() + `pinnedFunction("${debuggerInputEx.chromeInspectScriptUrl}",
        "${debuggerInputEx.devtoolsScriptUrl}");`;
    localStorage.consolePins = JSON.stringify([pin]);

    // When loading the devtools, it's important that the selected panel is the console panel. This
    // is because the pin set above will only run when the console panel is selected.
    InspectorFrontendHost.setPreference("panel-selectedTab", JSON.stringify("console"));

    // This frame will notify the extension that the script here has finished.
    let iframe = document.createElement("iframe");
    iframe.src = debuggerInputEx.notifierPageUrl;
    document.body.appendChild(iframe);
});

// As console pins are re-evaluated regularly, this function is designed to be called multiple
// times.
function pinnedFunction(chromeInspectScriptUrl, devtoolsScriptUrl) {
    if (location.origin === "chrome://inspect" && !window.debuggerInputExCompletedProcess) {
        if (window.debuggerInputExScriptFetched) {
            // The reason the code is evaluated here and not in the fetch call below is that the
            // chrome://inspect/ page blocks eval calls via CSP. Code that's run synchronously from
            // the devtools (or from a pin) bypasses CSP. This doesn't apply to any asynchronous
            // callbacks, however. So although the eval call works here, it wouldn't work below.
            eval(window.debuggerInputExScript);
            window.debuggerInputExCompletedProcess = true;
        } else {
            fetch(chromeInspectScriptUrl).then(function (response) {
                response.text().then(function (text) {
                    window.debuggerInputExScript = text;

                    window.debuggerInputExScriptFetched = true;
                });
            });
        }
    } else if (location.origin == "devtools://devtools" && !window.debuggerInputExScriptAppended) {
        let script = document.createElement("script");
        script.src = devtoolsScriptUrl;
        document.head.appendChild(script);

        window.debuggerInputExScriptAppended = true;
    }
}

function documentReady(callback) {
    if (document.readyState === "complete" || document.readyState === "interactive") {
        callback();
    } else {
        document.addEventListener("DOMContentLoaded", callback);
    }
}