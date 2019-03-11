export default (options) => {
  chrome.tabs.getAllInWindow(null, function(tabs) {
    tabs.forEach((tab) => {
      chrome.tabs.remove(tab.id);
    });
  });
};
