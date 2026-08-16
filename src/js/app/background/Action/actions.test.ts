import actionBrowserRestart from './browser_restart';
import actionCloseActiveTab from './close_active_tab';
import actionCloseActiveTabWithoutPinned from './close_active_tab_without_pinned';
import actionCloseAllBackgroundTab from './close_all_background_tab';
import actionCloseAllTab from './close_all_tab';
import actionCloseLeftTab from './close_left_tab';
import actionCloseLeftTabWithoutPinned from './close_left_tab_without_pinned';
import actionCloseRightTab from './close_right_tab';
import actionCloseRightTabWithoutPinned from './close_right_tab_without_pinned';
import actionNextTab from './next_tab';
import actionDuplicateTab from './open_duplicate_tab';
import actionOpenExtensionPage from './open_extension_page';
import actionOpenNewTab from './open_new_tab';
import actionOpenNewTabBackground from './open_new_tab_background';
import actionOpenOptionPage from './open_option_page';
import actionPrevTab from './prev_tab';
import actionReload from './reload';
import actionReloadAll from './reload_all';
import actionRestoreLastTab from './restore_last_tab';
import actionSuperReload from './super_reload';
import actionTogglePinTab from './toggle_pin_tab';
import actionWindowMaximize from './window_maximize';
import actionWindowMinimize from './window_minimize';
import actionWindowNormalize from './window_normalize';

const setupChromeMocks = (): void => {
  globalThis.chrome = {
    runtime: {
      getURL: jest.fn((path) => `chrome-extension://id/${path}`),
    },
    sessions: {
      getRecentlyClosed: jest.fn(
        (options, callback) => callback([{ tab: { id: 10 } }]),
      ),
      restore: jest.fn(),
    },
    tabs: {
      create: jest.fn().mockResolvedValue({ id: 100 }),
      duplicate: jest.fn(),
      query: jest.fn((queryInfo, callback) =>
        callback([{ active: true, id: 1, index: 0, pinned: false }]),
      ),
      reload: jest.fn(),
      remove: jest.fn(),
      update: jest.fn(),
    },
    windows: {
      getCurrent: jest.fn().mockResolvedValue({ id: 1 }),
      update: jest.fn().mockResolvedValue({ id: 1 }),
    },
  } as unknown as typeof chrome;
};

describe('Tab Close Active Actions', () => {
  beforeEach(setupChromeMocks);

  it('close_active_tab', async () => {
    (chrome.tabs.query as jest.Mock).mockImplementation(
      (q, cb) => cb([{ active: true, id: 1 }]),
    );
    await actionCloseActiveTab();
    expect(chrome.tabs.remove).toHaveBeenCalledWith(1);
  });

  it('close_active_tab_without_pinned', async () => {
    (chrome.tabs.query as jest.Mock).mockImplementation(
      (q, cb) => cb([{ active: true, id: 1, pinned: true }]),
    );
    await actionCloseActiveTabWithoutPinned();
    expect(chrome.tabs.remove).not.toHaveBeenCalled();

    (chrome.tabs.query as jest.Mock).mockImplementation(
      (q, cb) => cb([{ active: true, id: 2, pinned: false }]),
    );
    await actionCloseActiveTabWithoutPinned();
    expect(chrome.tabs.remove).toHaveBeenCalledWith(2);
  });

  it('close_all_background_tab and close_all_tab', async () => {
    const tabs = [
      { active: false, id: 1 },
      { active: true, id: 2 },
    ];
    (chrome.tabs.query as jest.Mock).mockImplementation((q, cb) => cb(tabs));

    await actionCloseAllBackgroundTab();
    expect(chrome.tabs.remove).toHaveBeenCalledWith([1]);

    await actionCloseAllTab();
    expect(chrome.tabs.remove).toHaveBeenCalledWith([1, 2]);
  });
});

describe('Tab Close Directional Actions', () => {
  beforeEach(setupChromeMocks);

  it('close_left_tab and close_left_tab_without_pinned', async () => {
    const tabs = [
      { active: false, id: 1, index: 0, pinned: true },
      { active: false, id: 2, index: 1, pinned: false },
      { active: true, id: 3, index: 2, pinned: false },
    ];
    (chrome.tabs.query as jest.Mock).mockImplementation((q, cb) => cb(tabs));

    await actionCloseLeftTab();
    expect(chrome.tabs.remove).toHaveBeenCalledWith([1, 2]);

    (chrome.tabs.remove as jest.Mock).mockClear();
    await actionCloseLeftTabWithoutPinned();
    expect(chrome.tabs.remove).toHaveBeenCalledWith([2]);
  });

  it('close_right_tab and close_right_tab_without_pinned', async () => {
    const tabs = [
      { active: true, id: 1, index: 0, pinned: false },
      { active: false, id: 2, index: 1, pinned: false },
      { active: false, id: 3, index: 2, pinned: true },
    ];
    (chrome.tabs.query as jest.Mock).mockImplementation((q, cb) => cb(tabs));

    await actionCloseRightTab();
    expect(chrome.tabs.remove).toHaveBeenCalledWith([2, 3]);

    (chrome.tabs.remove as jest.Mock).mockClear();
    await actionCloseRightTabWithoutPinned();
    expect(chrome.tabs.remove).toHaveBeenCalledWith([2]);
  });
});

describe('Tab Navigation and Creation Actions', () => {
  beforeEach(setupChromeMocks);

  it('next_tab and prev_tab', async () => {
    const tabs = [
      { active: true, id: 1, index: 0 },
      { active: false, id: 2, index: 1 },
    ];
    (chrome.tabs.query as jest.Mock).mockImplementation((q, cb) => cb(tabs));

    await actionNextTab();
    expect(chrome.tabs.update).toHaveBeenCalledWith(2, { active: true });

    await actionPrevTab();
    expect(chrome.tabs.update).toHaveBeenCalledWith(2, { active: true });
  });

  it('open_duplicate_tab and page actions', async () => {
    (chrome.tabs.query as jest.Mock).mockImplementation(
      (q, cb) => cb([{ active: true, id: 10, index: 0 }]),
    );

    await actionDuplicateTab();
    expect(chrome.tabs.duplicate).toHaveBeenCalledWith(10);

    await actionOpenExtensionPage();
    expect(chrome.tabs.create).toHaveBeenCalledWith(
      expect.objectContaining({ url: 'chrome://extensions/' }),
    );

    await actionOpenOptionPage();
    expect(chrome.tabs.create).toHaveBeenCalledWith(
      expect.objectContaining({
        url: 'chrome-extension://id/options_page/options_page.html',
      }),
    );
  });

  it('open_new_tab and open_new_tab_background', async () => {
    (chrome.tabs.query as jest.Mock).mockImplementation(
      (q, cb) => cb([{ active: true, id: 1, index: 0 }]),
    );

    await actionOpenNewTab({ href: 'https://example.com' });
    expect(chrome.tabs.create).toHaveBeenCalledWith(
      expect.objectContaining({ active: true, url: 'https://example.com' }),
    );

    await actionOpenNewTabBackground({ href: 'https://example.com' });
    expect(chrome.tabs.create).toHaveBeenCalledWith(
      expect.objectContaining({ active: false, url: 'https://example.com' }),
    );
  });
});

describe('Reload, Session, and Window Actions', () => {
  beforeEach(setupChromeMocks);

  it('reload actions', async () => {
    const tabs = [{ active: true, id: 1 }, { active: false, id: 2 }];
    (chrome.tabs.query as jest.Mock).mockImplementation((q, cb) => cb(tabs));

    await actionReload();
    expect(chrome.tabs.reload).toHaveBeenCalledWith(1, { bypassCache: false });

    await actionSuperReload();
    expect(chrome.tabs.reload).toHaveBeenCalledWith(1, { bypassCache: true });

    await actionReloadAll();
    expect(chrome.tabs.reload).toHaveBeenCalledWith(1, { bypassCache: false });
  });

  it('session, pin, and restart actions', async () => {
    (chrome.tabs.query as jest.Mock).mockImplementation(
      (q, cb) => cb([{ active: true, id: 1, pinned: false }]),
    );

    await actionRestoreLastTab();
    expect(chrome.sessions.restore).toHaveBeenCalled();

    await actionTogglePinTab();
    expect(chrome.tabs.update).toHaveBeenCalledWith(1, { pinned: true });

    await actionBrowserRestart();
    expect(chrome.tabs.create).toHaveBeenCalledWith(
      expect.objectContaining({ url: 'chrome://restart' }),
    );
  });

  it('window resize actions', async () => {
    await actionWindowMaximize();
    expect(chrome.windows.update).toHaveBeenCalledWith(1, { state: 'maximized' });

    await actionWindowMinimize();
    expect(chrome.windows.update).toHaveBeenCalledWith(1, { state: 'minimized' });

    await actionWindowNormalize();
    expect(chrome.windows.update).toHaveBeenCalledWith(1, { state: 'normal' });
  });
});
