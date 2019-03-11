export default (options) => {
  chrome.tabs.query({active: true, lastFocusedWindow: true}, function(tabs) {
    const activeTab = tabs[0];
    chrome.tabs.getAllInWindow(null, function(tabs) {
      if (activeTab.index == tabs.length-1) {
        chrome.tabs.update(tabs[0].id, {active: true});
      } else {
        chrome.tabs.update(tabs[activeTab.index+1].id, {active: true});
      }
    });
  });
};
