import {chromeTabs} from '../chrome-wrapper/chromeTabs';

export default async () => {
  const activeTab = await chromeTabs.getActiveTab();
  if (activeTab) {
    chrome.tabs.remove(activeTab.id);
  }
};
