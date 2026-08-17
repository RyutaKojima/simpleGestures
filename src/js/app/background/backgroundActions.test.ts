import { backgroundActions, isSafeUrl } from './backgroundActions';

const setupMocks = () => {
  globalThis.chrome = {
    runtime: {
      getURL: jest.fn((path) => `chrome-extension://id/${path}`),
    },
    sessions: {
      restore: jest.fn(),
    },
    tabs: {
      create: jest.fn(),
      duplicate: jest.fn(),
      query: jest.fn(
        (queryInfo, callback) =>
          callback([{ active: true, id: 1, index: 0, pinned: false }]),
      ),
      reload: jest.fn(),
      remove: jest.fn(),
      update: jest.fn(),
    },
    windows: {
      getCurrent: jest.fn((callback) => callback({ id: 1 })),
      update: jest.fn(),
    },
  } as unknown as typeof chrome;
};

describe('backgroundActions', () => {
  beforeEach(setupMocks);

  it('should return true for valid registered background actions', () => {
    expect(backgroundActions('close_tab')).toBe(true);
    expect(backgroundActions('new_tab')).toBe(true);
    expect(backgroundActions('reload')).toBe(true);
    expect(backgroundActions('open_option')).toBe(true);
  });

  it('should return false for unknown or invalid action names', () => {
    expect(backgroundActions('invalid_action')).toBe(false);
    expect(backgroundActions('toString')).toBe(false);
  });
});

describe('URL Validation and Sanitization', () => {
  beforeEach(setupMocks);

  it('should correctly validate safe URLs with isSafeUrl', () => {
    expect(isSafeUrl('https://example.com')).toBe(true);
    expect(isSafeUrl('http://example.com/path')).toBe(true);
    expect(isSafeUrl('javascript:alert(1)')).toBe(false);
    expect(isSafeUrl('file:///etc/passwd')).toBe(false);
    expect(isSafeUrl('data:text/html,test')).toBe(false);
    expect(isSafeUrl('chrome://extensions')).toBe(false);
    expect(isSafeUrl(null)).toBe(false);
    expect(isSafeUrl('')).toBe(false);
  });

  it('should sanitize unsafe hrefs when calling backgroundActions', async () => {
    backgroundActions('new_tab', 'javascript:alert(1)');
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(chrome.tabs.create).toHaveBeenCalledWith(
      expect.objectContaining({ active: true, url: null }),
    );

    (chrome.tabs.create as jest.Mock).mockClear();
    backgroundActions('new_tab', 'https://example.com');
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(chrome.tabs.create).toHaveBeenCalledWith(
      expect.objectContaining({ active: true, url: 'https://example.com' }),
    );
  });
});
