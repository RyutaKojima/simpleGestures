export default (options) => {
  chrome.tabs.getAllInWindow(null, function(tabs) {
    tabs.forEach((tab) => {
      chrome.tabs.reload(tab.id);
    });
  });
};
