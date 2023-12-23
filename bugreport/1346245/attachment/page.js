var webview;

function create_webview() {
  webview = document.createElement("webview");
  document.body.appendChild(webview);
}

function test() {
  create_webview();

  webview.addEventListener("permissionrequest", function(event) {
    var parent_node = webview.parentNode;
    parent_node.removeChild(webview);
  })
  
  webview.src = "http://localhost:8000/poc.html";
}


window.onload = test;