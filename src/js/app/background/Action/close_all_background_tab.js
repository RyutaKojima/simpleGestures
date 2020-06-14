import {chromeTabs} from '../chrome-wrapper/chromeTabs';

export default async () => {
  const tabsInCurrentWindow = await chromeTabs.getCurrentWindowTabs();

  tabsInCurrentWindow.forEach((tab) => {
    if (!tab.active) {
      chrome.tabs.remove(tab.id);
    }
  });
};
