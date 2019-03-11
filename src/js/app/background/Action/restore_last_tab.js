export default (options) => {
  chrome.sessions.getRecentlyClosed({maxResults: 1}, (sessions) => {
    if (sessions.length) {
      chrome.sessions.restore();
    }
  });
};
