export default (options) => {
  let _url = '';

  if (options && typeof options.href !== 'undefined') {
    _url = options.href;
  }

  chrome.tabs.query({active: true}, function(tabs) {
    const activeTab = tabs[0];
    const appendIndex = activeTab.index + 1;
    if (!_url) {
      chrome.tabs.create({index: appendIndex});
    } else {
      chrome.tabs.create({url: _url, index: appendIndex});
    }
  });
};
