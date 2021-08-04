import {chromeTabs} from '../chrome-wrapper/chromeTabs';

export default async (): Promise<void> => {
  const chromeExtensionsURL = 'chrome://extensions/';

  await chromeTabs.activateOrCreate(chromeExtensionsURL);
};
