import Tab = chrome.tabs.Tab;
import {chromeTabs} from '../chrome-wrapper/chromeTabs';

export default async (): Promise<void> => {
  const activeTab: Tab = await chromeTabs.getActiveTab();

  if (!activeTab) {
    return;
  }
  if (activeTab.pinned) {
    return;
  }

  chromeTabs.close(activeTab);
};
