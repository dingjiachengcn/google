chrome.bookmarks.create({'title': 'Extension bookmarks'});
chrome.bookmarks.create(
    {'title': 'triger_folder'},
    function(newFolder) {
        console.log("added folder: " + newFolder.title);
        chrome.bookmarks.create({'parentId': newFolder.id,
            'title': 'Extensions doc',
            'url': 'http://code.google.com/chrome/extensions'
            },function(aa){
            setTimeout(function() {
                chrome.bookmarks.remove(aa.id);
                chrome.bookmarks.remove(newFolder.id);
            },12000);
    });
        //setTimeout(function(){chrome.bookmarks.remove(newFolder.id);},3000);
    },
);