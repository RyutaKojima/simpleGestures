import Tab = chrome.tabs.Tab;
import {chromeTabs} from '../chrome-wrapper/chromeTabs';

export default async (): Promise<void> => {
  const tabsInCurrentWindow: Tab[] = await chromeTabs.getCurrentWindowTabs();
  const activeTab: Tab|undefined = tabsInCurrentWindow.find((tab: Tab) => tab.active);
  if (!activeTab) {
    return;
  }

  const lastTabIndex: number = tabsInCurrentWindow.length - 1;
  const setActiveTab: Tab = (activeTab.index === lastTabIndex) ?
      tabsInCurrentWindow[0] :
      tabsInCurrentWindow[activeTab.index + 1];

  chromeTabs.activate(setActiveTab);
};
