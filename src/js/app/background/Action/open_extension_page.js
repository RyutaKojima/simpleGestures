export default (options) => {
  const chromeExtURL = 'chrome://extensions/';
  chrome.tabs.getAllInWindow(null, function(tabs) {
    tabs.forEach((tab) => {
      if (tab.url == chromeExtURL) {
        chrome.tabs.update(tab.id, {selected: true});
        return;
      }
    });
    chrome.tabs.create({url: chromeExtURL, selected: true});
  });
};
