export default (options) => {
  chrome.tabs.create({
    'url': chrome.runtime.getURL('html/options_page.html'),
  });
};
