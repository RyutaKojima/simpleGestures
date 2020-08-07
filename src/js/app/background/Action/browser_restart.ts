import {chromeTabs} from '../chrome-wrapper/chromeTabs';

export default (): void => {
  // 現在のバージョンでは動かなくなった
  chromeTabs.createLast('chrome://restart');
};
