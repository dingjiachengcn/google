chrome.app.window.create('page.html', {
  id: 'main',
  bounds: { width: 620, height: 500 }
}, function(app_window) {
  setTimeout(() => {
    app_window.close();
  }, 3000);
});