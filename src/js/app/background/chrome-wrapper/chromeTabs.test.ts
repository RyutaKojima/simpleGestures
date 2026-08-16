import { chromeTabs } from './chromeTabs';

const setupChromeTabsMock = (): void => {
  globalThis.chrome = {
    tabs: {
      create: jest.fn().mockResolvedValue({ id: 100 }),
      duplicate: jest.fn().mockResolvedValue({ id: 101 }),
      query: jest.fn(),
      reload: jest.fn(),
      remove: jest.fn(),
      update: jest.fn(),
    },
  } as unknown as typeof chrome;
};

describe('chromeTabs - basic tab operations', () => {
  beforeEach(setupChromeTabsMock);

  it('should activate a tab', () => {
    const tab = { id: 123 } as chrome.tabs.Tab;
    chromeTabs.activate(tab);
    expect(chrome.tabs.update).toHaveBeenCalledWith(123, { active: true });
  });

  it('should close single tab or multiple tabs', () => {
    const tab1 = { id: 1 } as chrome.tabs.Tab;
    const tab2 = { id: 2 } as chrome.tabs.Tab;

    chromeTabs.close(tab1);
    expect(chrome.tabs.remove).toHaveBeenCalledWith(1);

    chromeTabs.close([tab1, tab2]);
    expect(chrome.tabs.remove).toHaveBeenCalledWith([1, 2]);
  });

  it('should get active tab and current window tabs', async () => {
    const mockTab = { active: true, id: 10 } as chrome.tabs.Tab;
    (chrome.tabs.query as jest.Mock).mockImplementation(
      (queryInfo, callback) => callback([mockTab]),
    );

    const activeTab = await chromeTabs.getActiveTab();
    expect(activeTab).toBe(mockTab);

    const tabs = await chromeTabs.getCurrentWindowTabs();
    expect(tabs).toEqual([mockTab]);
  });
});

describe('chromeTabs - find operations', () => {
  beforeEach(setupChromeTabsMock);

  it('should find same url in current window', async () => {
    const mockTabs = [
      { id: 1, url: 'https://example.com/a' },
      { id: 2, url: 'https://example.com/b' },
    ] as chrome.tabs.Tab[];
    (chrome.tabs.query as jest.Mock).mockImplementation(
      (queryInfo, callback) => callback(mockTabs),
    );

    const found = await chromeTabs.findSameUrlInCurrentWindow(
      'https://example.com/b',
    );
    expect(found).toBe(mockTabs[1]);

    const notFound = await chromeTabs.findSameUrlInCurrentWindow(
      'https://example.com/c',
    );
    expect(notFound).toBeUndefined();
  });
});

describe('chromeTabs - create and reload operations', () => {
  beforeEach(setupChromeTabsMock);

  it('should activate existing tab or create last in activateOrCreate', async () => {
    const mockTabs = [{ id: 1, url: 'https://example.com/a' }] as chrome.tabs.Tab[];
    (chrome.tabs.query as jest.Mock).mockImplementation(
      (queryInfo, callback) => callback(mockTabs),
    );

    await chromeTabs.activateOrCreate('https://example.com/a');
    expect(chrome.tabs.update).toHaveBeenCalledWith(1, { active: true });

    (chrome.tabs.query as jest.Mock).mockImplementation((queryInfo, callback) => {
      if (queryInfo.active) {
        callback([mockTabs[0]]);
      } else {
        callback(mockTabs);
      }
    });

    await chromeTabs.activateOrCreate('https://example.com/new');
    expect(chrome.tabs.create).toHaveBeenCalledWith({
      active: true,
      openerTabId: 1,
      url: 'https://example.com/new',
    });
  });

  it('should create active right tab, duplicate, and reload', async () => {
    const activeTab = { id: 5, index: 2 } as chrome.tabs.Tab;
    (chrome.tabs.query as jest.Mock).mockImplementation(
      (queryInfo, callback) => callback([activeTab]),
    );

    await chromeTabs.createActiveRight('https://example.com', true);
    expect(chrome.tabs.create).toHaveBeenCalledWith({
      active: true,
      index: 3,
      openerTabId: 5,
      url: 'https://example.com',
    });

    await chromeTabs.duplicate();
    expect(chrome.tabs.duplicate).toHaveBeenCalledWith(5);

    chromeTabs.reload(activeTab, true);
    expect(chrome.tabs.reload).toHaveBeenCalledWith(5, { bypassCache: true });
  });
});
