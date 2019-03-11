export default (options) => {
  chrome.tabs.query({active: true, lastFocusedWindow: true}, function(tabs) {
    const activeTab = tabs[0];
    chrome.tabs.getAllInWindow(null, function(tabs) {
      tabs.forEach(function(tab) {
        if (tab.id != activeTab.id) {
          chrome.tabs.remove(tab.id);
        }
      });
    });
  });
};
