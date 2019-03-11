export default () => {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    const activeTab = tabs[0];
    chrome.tabs.update(activeTab.id, {pinned: !activeTab.pinned});
  });
};
