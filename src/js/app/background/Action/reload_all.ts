import Tab = chrome.tabs.Tab;
import {chromeTabs} from '../chrome-wrapper/chromeTabs';

export default async (): Promise<void> => {
  const tabsInCurrentWindow: Tab[] = await chromeTabs.getCurrentWindowTabs();
  tabsInCurrentWindow.forEach((tab: Tab) => {
    chromeTabs.reload(tab);
  });
};
