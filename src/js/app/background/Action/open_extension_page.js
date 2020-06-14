import {chromeTabs} from '../chrome-wrapper/chromeTabs';

export default async () => {
  const chromeExtensionsURL = 'chrome://extensions/';

  chromeTabs.activateOrCreate(chromeExtensionsURL);
};
