documentReady(function () {
    window.populateLocalTargets = function(data) {
        let url = new URL(location.href);
        url.hash = "";
    
        // Attempt to find the devtools window attached to this window. If the window is found, it
        // will be inspected.
        findDevToolsFrame(data, url.toString(), function (match) {
            if (!match) {
                return;
            }
            
            sendCommand("inspect", match.source, match.id);
        });
    }

    sendCommand("init-ui");
});

function findDevToolsFrame(targets, chromeInspectUrl, callback) {
    let match = targets.find(function (target) {
        if ((target.type === "other" || target.type === "page")
        && target.name === "DevTools - " + chromeInspectUrl
        && target.source === "local") {
            return true;
        }

        return false;
    });

    callback(match);
}

function documentReady(callback) {
    if (document.readyState === "complete" || document.readyState === "interactive") {
        callback();
    } else {
        document.addEventListener("DOMContentLoaded", callback);
    }
}