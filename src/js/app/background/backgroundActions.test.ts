import { backgroundActions } from './backgroundActions';

describe('backgroundActions', () => {
  beforeEach(() => {
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
  });

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
