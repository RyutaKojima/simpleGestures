import {chromeTabs} from '../chrome-wrapper/chromeTabs';

export default async (): Promise<void> => {
  const optionPageUrl: string = chrome.runtime.getURL('html/options_page.html');

  await chromeTabs.activateOrCreate(optionPageUrl);
};
