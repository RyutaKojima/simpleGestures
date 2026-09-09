import Tab = chrome.tabs.Tab;

/**
 * Validates tab creation URLs against safe protocols
 * (http:, https:, chrome:, chrome-extension:) to prevent executing
 * unsafe URI schemes like javascript:, data:, or file:.
 */
const isSafeTabUrl = (url: null | string): boolean => {
  if (typeof url !== 'string' || !url) {
    return false;
  }
  const trimmedUrl = url.trim();
  if (trimmedUrl.startsWith('/') || trimmedUrl.startsWith('//')) {
    return false;
  }
  try {
    const parsedUrl = new URL(trimmedUrl, 'chrome-extension://dummy/');
    return (
      parsedUrl.protocol === 'http:' ||
      parsedUrl.protocol === 'https:' ||
      parsedUrl.protocol === 'chrome:' ||
      parsedUrl.protocol === 'chrome-extension:'
    );
  } catch {
    return false;
  }
};

export const chromeTabs = {
  activate(tab: Tab): void {
    chrome.tabs.update(tab.id, {active: true});
  },
  async activateOrCreate(url: null | string = null) {
    const safeUrl: string | null = isSafeTabUrl(url) ? url : null;
    const extensionTab: null | Tab = safeUrl
      ? await chromeTabs.findSameUrlInCurrentWindow(safeUrl)
      : null;

    if (extensionTab) {
      chromeTabs.activate(extensionTab);
    } else {
      await chromeTabs.createLast(safeUrl);
    }
  },
  close(tab: Tab | Tab[]): void {
    if (Array.isArray(tab)) {
      const removeTabIds: number[] = tab.map((tab) => tab.id);
      chrome.tabs.remove(removeTabIds);
    } else {
      chrome.tabs.remove(tab.id);
    }
  },
  async createActiveRight(url: null | string = null, active = true) {
    const activeTab: Tab = await chromeTabs.getActiveTab();
    const indexOfAppendingTab: number = activeTab.index + 1;
    const targetUrl: string | null = isSafeTabUrl(url) ? url : null;

    await chrome.tabs.create({
      active: active,
      index: indexOfAppendingTab,
      openerTabId: activeTab.id,
      url: targetUrl,
    });
  },
  async createLast(url: null | string = null, active = true) {
    const activeTab: Tab = await chromeTabs.getActiveTab();
    const targetUrl: string | null = isSafeTabUrl(url) ? url : null;

    await chrome.tabs.create({
      active: active,
      openerTabId: activeTab.id,
      url: targetUrl,
    });
  },
  async duplicate() {
    const activeTab: Tab = await chromeTabs.getActiveTab();

    await chrome.tabs.duplicate(activeTab.id);
  },
  async findSameUrlInCurrentWindow(url: string): Promise<Tab | undefined> {
    const tabsInCurrentWindow: Tab[] = await chromeTabs.getCurrentWindowTabs();
    return tabsInCurrentWindow.find((tab) => tab.url === url);
  },
  getActiveTab(): Promise<Tab> {
    return new Promise((resolve) => {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs: Tab[]) {
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
  reload(tab: Tab, discardCache = false): void {
    chrome.tabs.reload(tab.id, {bypassCache: discardCache});
  },
};
