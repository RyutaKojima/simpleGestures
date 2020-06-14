import {chromeTabs} from '../chrome-wrapper/chromeTabs';

export default async () => {
  const activeTab = await chromeTabs.getActiveTab();
  chrome.tabs.update(activeTab.id, {pinned: !activeTab.pinned});
};
