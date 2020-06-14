import {chromeTabs} from '../chrome-wrapper/chromeTabs';

export default async () => {
  const tabsInCurrentWindow = await chromeTabs.getCurrentWindowTabs();
  const activeTab = tabsInCurrentWindow.find((tab) => tab.active);
  if (!activeTab) {
    return;
  }

  const removeTabs = tabsInCurrentWindow
      .filter((tab) => tab.index > activeTab.index)
      .filter((tab) => !tab.pinned);

  chromeTabs.close(removeTabs);
};
