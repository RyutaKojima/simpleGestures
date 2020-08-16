import Tab = chrome.tabs.Tab;
import {chromeTabs} from '../chrome-wrapper/chromeTabs';

export default async (): Promise<void> => {
  const tabsInCurrentWindow: Tab[] = await chromeTabs.getCurrentWindowTabs();
  chromeTabs.close(tabsInCurrentWindow);
};
