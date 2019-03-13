export default (options) => {
  chrome.tabs.query({currentWindow: true}, (tabsInCurrentWindow) => {
    const activeTab = tabsInCurrentWindow.find((tab) => tab.active);
    if (typeof activeTab === 'undefined') {
      return;
    }

    const removeTargetTabs = tabsInCurrentWindow.filter((tab) => tab.index > activeTab.index);

    removeTargetTabs.forEach((tab) => {
      chrome.tabs.remove(tab.id);
    });
  });
};
