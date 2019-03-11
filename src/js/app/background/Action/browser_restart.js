export default (options) => {
  // 現在のバージョンでは動かなくなった
  chrome.tabs.create({url: 'chrome://restart', selected: true});
};
