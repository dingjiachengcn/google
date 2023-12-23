

      chrome.tabs.getCurrent(function(tab8833) {
        chrome.tabs.duplicate(tab8833.id, function(tab7012) {
            chrome.tabs.create({index:99, openerTabId:tab7012.id}, function(tab5017) {
                chrome.tabs.update(tab5017.id, {url:chrome.extension.getURL("poc/poc.html"), active:true, highlighted:true, selected:true, pinned:true, muted:true, autoDiscardable:true}, function(tab8304) {
                    chrome.tabs.group({tabIds:[tab5017.id]}, function(tab1107) {
                        console.log('aha!')
                      });
                  });
              });
          });

      });      

