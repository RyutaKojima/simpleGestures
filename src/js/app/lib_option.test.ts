import LibOption from './lib_option';

const setupStorageMock = (localStorageMock: { [key: string]: string }): void => {
  globalThis.chrome = {
    storage: {
      local: {
        clear: jest.fn(() => {
          Object.keys(localStorageMock).forEach((key) => delete localStorageMock[key]);
        }),
        get: jest.fn((key: string, callback: (result: { [key: string]: string }) => void) => {
          callback({ [key]: localStorageMock[key] || '' });
        }),
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

describe('LibOption - loading and options management', () => {
  let libOption: LibOption;
  let localStorageMock: { [key: string]: string };

  beforeEach(() => {
    localStorageMock = {};
    setupStorageMock(localStorageMock);
    libOption = new LibOption();
  });

  it('should initialize with default options when no storage data exists', () => {
    libOption.setRawStorageData(null);
    expect(libOption.getRawStorageData()).toBeNull();
    expect(libOption.getEnabled()).toBe(true);
    expect(libOption.isJapanese()).toBe(true);
    expect(libOption.getColorCode()).toBe('#FF0000');
  });

  it('should load storage data', async () => {
    const raw = JSON.stringify({ language: 'English', line_width: 5 });
    localStorageMock['options'] = raw;

    await libOption.load();
    expect(libOption.getRawStorageData()).toBe(raw);
    expect(libOption.getLanguage()).toBe('English');
    expect(libOption.isEnglish()).toBe(true);
  });

  it('should handle load failure', async () => {
    jest.spyOn(libOption.storage, 'load').mockRejectedValue(new Error('Storage error'));

    await expect(libOption.load()).rejects.toThrow('Storage error');
    expect(libOption.getRawStorageData()).toBeNull();
  });
});

describe('LibOption - parameters, gestures, and reset', () => {
  let libOption: LibOption;
  let localStorageMock: { [key: string]: string };

  beforeEach(() => {
    localStorageMock = {};
    setupStorageMock(localStorageMock);
    libOption = new LibOption();
  });

  it('should parse gesture hash and check existing gestures', () => {
    const raw = JSON.stringify({
      gesture_close_tab: 'DR',
      gesture_close_tab_without_pinned: '',
    });
    libOption.setRawStorageData(raw);

    expect(libOption.getGestureActionName('DR')).toBe('close_tab');
    expect(libOption.getGestureActionName('UNKNOWN')).toBeNull();
    expect(libOption.isGestureAlreadyExist('DR')).toBe('gesture_close_tab');
  });

  it('should set, get params, save and reset options', async () => {
    libOption.setRawStorageData(null);
    libOption.setParam('line_width', 10);
    expect(libOption.getLineWidth()).toBe(10);

    libOption.save();
    expect(chrome.storage.local.set).toHaveBeenCalled();

    await libOption.reset();
    expect(chrome.storage.local.clear).toHaveBeenCalled();
  });
});
