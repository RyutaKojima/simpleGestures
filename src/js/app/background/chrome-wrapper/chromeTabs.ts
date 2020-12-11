import Tab = chrome.tabs.Tab;

export const chromeTabs = {
  getActiveTab(): Promise<Tab> {
    return new Promise((resolve) => {
      chrome.tabs.query({currentWindow: true, active: true}, function(tabs: Tab[]) {
        resolve(tabs[0]);
      });
    });
  },
  getCurrentWindowTabs(): Promise<Tab[]> {
    return new Promise((resolve) => {
      chrome.tabs.query({currentWindow: true}, (tabsInCurrentWindow: Tab[]) => {
        resolve(tabsInCurrentWindow);
      });
    });
  },
  async findSameUrlInCurrentWindow(url: string): Promise<Tab|undefined> {
    const tabsInCurrentWindow: Tab[] = await chromeTabs.getCurrentWindowTabs();
    return tabsInCurrentWindow.find((tab) => tab.url === url);
  },
  async createActiveRight(url: null|string = null, active: boolean = true) {
    const activeTab: Tab = await chromeTabs.getActiveTab();
    const indexOfAppendingTab: number = activeTab.index + 1;

    chrome.tabs.create({
      url: url,
      index: indexOfAppendingTab,
      active: active,
    });
  },
  createLast(url: null|string = null, active: boolean = true) {
    chrome.tabs.create({
      url: url,
      active: active,
    });
  },
  async activateOrCreate(url: null|string = null) {
    const extensionTab: null|Tab = await chromeTabs.findSameUrlInCurrentWindow(url);

    if (extensionTab) {
      chromeTabs.activate(extensionTab);
    } else {
      chromeTabs.createLast(url);
    }
  },
  activate(tab: Tab): void {
    chrome.tabs.update(tab.id, {active: true});
  },
  close(tab: Tab|Tab[]): void {
    if (Array.isArray(tab)) {
      const removeTabIds: number[] = tab.map((tab) => tab.id);
      chrome.tabs.remove(removeTabIds);
    } else {
      chrome.tabs.remove(tab.id);
    }
  },
  reload(tab: Tab, discardCache: boolean = false): void {
    chrome.tabs.reload(tab.id, {bypassCache: discardCache});
  },
};
