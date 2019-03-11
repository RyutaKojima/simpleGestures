export default (options) => {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    const activeTab = tabs[0];

    chrome.tabs.query({currentWindow: true}, (tabsInCurrentWindow) => {
      const removeTabsId = [];

      tabsInCurrentWindow.forEach((tab) => {
        if (tab.index > activeTab.index) {
          removeTabsId.push(tab.id);
        }
      });

      removeTabsId.forEach((removeId) => {
        chrome.tabs.remove(removeId);
      });
    });
  });
};
