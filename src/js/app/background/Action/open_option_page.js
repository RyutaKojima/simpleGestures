import {chromeTabs} from '../chrome-wrapper/chromeTabs';

export default async () => {
  const optionPageUrl = chrome.runtime.getURL('html/options_page.html');

  chromeTabs.activateOrCreate(optionPageUrl);
};
