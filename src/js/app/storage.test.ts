import MyStorage from './storage';

const setupChromeStorageMock = (localStorageMock: { [key: string]: string }): void => {
  globalThis.chrome = {
    storage: {
      local: {
        clear: jest.fn(() => {
          Object.keys(localStorageMock).forEach((k) => delete localStorageMock[k]);
        }),
        get: jest.fn(
          (key: string, callback: (result: { [key: string]: string }) => void) => {
            callback({ [key]: localStorageMock[key] || '' });
          },
        ),
        remove: jest.fn((key: string) => {
          delete localStorageMock[key];
        }),
        set: jest.fn((data: { [key: string]: string }) => {
          Object.assign(localStorageMock, data);
        }),
      },
      sync: {
        clear: jest.fn(() => {
          Object.keys(localStorageMock).forEach((k) => delete localStorageMock[k]);
        }),
        get: jest.fn(
          (key: string, callback: (result: { [key: string]: string }) => void) => {
            callback({ [key]: localStorageMock[key] || '' });
          },
        ),
        remove: jest.fn((key: string) => {
          delete localStorageMock[key];
        }),
        set: jest.fn((data: { [key: string]: string }) => {
          Object.assign(localStorageMock, data);
        }),
      },
    },
  } as unknown as typeof chrome;
};

describe('MyStorage - LOCAL_STORAGE', () => {
  let localStorageMock: { [key: string]: string };

  beforeEach(() => {
    localStorageMock = {};
    Object.defineProperty(window, 'localStorage', {
      value: {
        clear: jest.fn(() => {
          localStorageMock = {};
        }),
        getItem: jest.fn((key: string) => localStorageMock[key] || null),
        removeItem: jest.fn((key: string) => {
          delete localStorageMock[key];
        }),
        setItem: jest.fn((key: string, val: string) => {
          localStorageMock[key] = val;
        }),
      },
      writable: true,
    });
  });

  it('should save, load, remove and clear data in localStorage', async () => {
    const storage = new MyStorage(MyStorage.LOCAL_STORAGE);

    storage.save('testKey', 'testVal');
    const loaded = await storage.load('testKey');
    expect(loaded).toBe('testVal');

    storage.remove('testKey');
    const loadedAfterRemove = await storage.load('testKey');
    expect(loadedAfterRemove).toBe('');

    storage.save('testKey', 'testVal');
    storage.clear();
    const loadedAfterClear = await storage.load('testKey');
    expect(loadedAfterClear).toBe('');
  });
});

describe('MyStorage - CHROME_STORAGE_LOCAL', () => {
  let localStorageMock: { [key: string]: string };

  beforeEach(() => {
    localStorageMock = {};
    setupChromeStorageMock(localStorageMock);
  });

  it('should save, load, remove, and clear in chrome.storage.local', async () => {
    const local = new MyStorage(MyStorage.CHROME_STORAGE_LOCAL);
    local.save('key1', 'val1');
    const loadedLocal = await local.load('key1');
    expect(loadedLocal).toBe('val1');

    local.remove('key1');
    expect(chrome.storage.local.remove).toHaveBeenCalledWith('key1');

    local.clear();
    expect(chrome.storage.local.clear).toHaveBeenCalled();
  });
});

describe('MyStorage - CHROME_STORAGE_SYNC and invalid', () => {
  let localStorageMock: { [key: string]: string };

  beforeEach(() => {
    localStorageMock = {};
    setupChromeStorageMock(localStorageMock);
  });

  it('should save and load in chrome.storage.sync', async () => {
    const sync = new MyStorage(MyStorage.CHROME_STORAGE_SYNC);
    sync.save('syncKey', 'syncVal');
    const loadedSync = await sync.load('syncKey');
    expect(loadedSync).toBe('syncVal');
  });

  it('should reject load on invalid storageType', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    const storage = new MyStorage('invalid');

    storage.save('key', 'val');
    storage.remove('key');
    storage.clear();

    await expect(storage.load('key')).rejects.toThrow('error');
    consoleSpy.mockRestore();
  });
});
