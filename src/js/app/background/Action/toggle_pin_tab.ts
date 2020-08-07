import Tab = chrome.tabs.Tab;
import {chromeTabs} from '../chrome-wrapper/chromeTabs';

export default async (): Promise<void> => {
  const activeTab: Tab = await chromeTabs.getActiveTab();
  chrome.tabs.update(activeTab.id, {pinned: !activeTab.pinned});
};
