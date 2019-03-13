export default (options) => {
  chrome.tabs.query({currentWindow: true}, function(tabsInCurrentWindow) {
    const activeTab = tabsInCurrentWindow.find((tab) => tab.active);
    if (typeof activeTab === 'undefined') {
      return;
    }

    tabsInCurrentWindow.forEach(function(tab) {
      if (tab.id !== activeTab.id) {
        chrome.tabs.remove(tab.id);
      }
    });
  });
};
