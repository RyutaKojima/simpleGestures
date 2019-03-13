export default (options) => {
  const chromeExtURL = 'chrome://extensions/';

  chrome.tabs.query({currentWindow: true}, function(tabsInCurrentWindow) {
    const extensionTab = tabsInCurrentWindow.find((tab) => tab.url === chromeExtURL);

    if (typeof extensionTab !== 'undefined') {
      chrome.tabs.update(extensionTab.id, {active: true});
    } else {
      chrome.tabs.create({url: chromeExtURL, selected: true});
    }
  });
};
