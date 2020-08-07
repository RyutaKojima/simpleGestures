import Session = chrome.sessions.Session;

export default async (): Promise<void> => {
  chrome.sessions.getRecentlyClosed({maxResults: 1}, (sessions: Session[]) => {
    if (sessions.length) {
      chrome.sessions.restore();
    }
  });
};
