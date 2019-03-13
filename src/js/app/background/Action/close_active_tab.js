export default (options) => {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    if (tabs.length > 0) {
      const activeTab = tabs[0];
      chrome.tabs.remove(activeTab.id);
    }
  });
};
