import Tab = chrome.tabs.Tab;
import {chromeTabs} from '../chrome-wrapper/chromeTabs';

export default async (): Promise<void> => {
  const tabsInCurrentWindow: Tab[] = await chromeTabs.getCurrentWindowTabs();
  const activeTab: Tab|undefined = tabsInCurrentWindow.find((tab: Tab) => tab.active);
  if (!activeTab) {
    return;
  }

  const removeTabs: Tab[] = tabsInCurrentWindow
      .filter((tab: Tab) => tab.index > activeTab.index)
      .filter((tab: Tab) => !tab.pinned);

  chromeTabs.close(removeTabs);
};
