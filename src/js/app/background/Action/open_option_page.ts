import {chromeTabs} from '../chrome-wrapper/chromeTabs';

export default async (): Promise<void> => {
  const optionPageUrl: string = chrome.runtime.getURL('options_page/options_page.html');

  await chromeTabs.activateOrCreate(optionPageUrl);
};
