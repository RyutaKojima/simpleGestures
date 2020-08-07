import {chromeTabs} from '../chrome-wrapper/chromeTabs';

export default async (): Promise<void> => {
  const chromeExtensionsURL: string = 'chrome://extensions/';

  await chromeTabs.activateOrCreate(chromeExtensionsURL);
};
