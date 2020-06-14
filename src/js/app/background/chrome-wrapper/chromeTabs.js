export const chromeTabs = {
  getActiveTab() {
    return new Promise((resolve) => {
      chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
        resolve(tabs[0]);
      });
    });
  },
  getCurrentWindowTabs() {
    return new Promise((resolve) => {
      chrome.tabs.query({currentWindow: true}, (tabsInCurrentWindow) => {
        resolve(tabsInCurrentWindow);
      });
    });
  },
  async findSameUrlInCurrentWindow(url) {
    const tabsInCurrentWindow = await chromeTabs.getCurrentWindowTabs();
    return tabsInCurrentWindow.find((tab) => tab.url === url);
  },
  async createActiveRight(url = null, active = true) {
    const activeTab = await chromeTabs.getActiveTab();
    const indexOfappendingTab = activeTab.index + 1;

    chrome.tabs.create({
      url: url,
      index: indexOfappendingTab,
      active: active,
    });
  },
  createLast(url = null, active = true) {
    chrome.tabs.create({
      url: url,
      active: active,
    });
  },
  async activateOrCreate(url= null) {
    const extensionTab = await chromeTabs.findSameUrlInCurrentWindow(url);

    if (extensionTab) {
      chromeTabs.activate(extensionTab);
    } else {
      chromeTabs.createLast(url);
    }
  },
  activate(tab) {
    chrome.tabs.update(tab.id, {active: true});
  },
};
