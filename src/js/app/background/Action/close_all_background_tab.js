import {chromeTabs} from '../chrome-wrapper/chromeTabs';

export default async () => {
  const tabsInCurrentWindow = await chromeTabs.getCurrentWindowTabs();

  const removeTabs = tabsInCurrentWindow.filter((tab) => {
    return !tab.active;
  });

  chromeTabs.close(removeTabs);
};
