import {chromeTabs} from '../chrome-wrapper/chromeTabs';

export default () => {
  // 現在のバージョンでは動かなくなった
  chromeTabs.createLast('chrome://restart');
};
