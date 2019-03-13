export default (options) => {
  chrome.tabs.query({currentWindow: true}, function(tabsInCurrentWindow) {
    const activeTab = tabsInCurrentWindow.find((tab) => tab.active);
    if (typeof activeTab === 'undefined') {
      return;
    }

    const lastTabIndex = tabsInCurrentWindow.length - 1;
    const setActiveTab = (activeTab.index == lastTabIndex) ?
        tabsInCurrentWindow[0] :
        tabsInCurrentWindow[activeTab.index + 1];

    chrome.tabs.update(setActiveTab.id, {active: true});
  });
};
