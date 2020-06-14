import {chromeTabs} from '../chrome-wrapper/chromeTabs';

export default async () => {
  const tabsInCurrentWindow = await chromeTabs.getCurrentWindowTabs();
  tabsInCurrentWindow.forEach((tab) => {
    chromeTabs.reload(tab);
  });
};
