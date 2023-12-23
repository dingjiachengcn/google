

function test() {
    chrome.processes.onCreated.addListener(function(){
        // console.log("ok");
        // chrome.management.uninstallSelf();
        // chrome.processes.onCreated.removeListener();
        for(var i=0; i<10; i++){
            chrome.processes.getProcessInfo([1,2,3,4,5,6,7,8,9], false, function(object) {console.log(object);});
        }
        // chrome.processes.onCreated.addListener(function(){
            // test();
        // });
    })
}

test();




