const tabs = await chrome.tabs.query({
  url: ["https://mail.google.com/*"],
});

for (const tab of tabs) {
  const title = tab.title;
  document.querySelector("p").textContent = title;
}
