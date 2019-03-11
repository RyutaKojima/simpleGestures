export default (options) => {
  chrome.tabs.query({active: true, lastFocusedWindow: true}, function(tabs) {
    const activeTab = tabs[0];
    chrome.tabs.reload(activeTab.id);
  });
};
