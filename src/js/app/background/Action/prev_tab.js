export default (options) => {
  chrome.tabs.query({active: true, lastFocusedWindow: true}, function(tabs) {
    const activeTab = tabs[0];
    chrome.tabs.getAllInWindow(null, function(tabs) {
      if (activeTab.index == 0) {
        chrome.tabs.update(tabs[tabs.length-1].id, {active: true});
      } else {
        chrome.tabs.update(tabs[activeTab.index-1].id, {active: true});
      }
    });
  });
};
