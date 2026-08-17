type MessageListener = (
  request: unknown,
  sender: unknown,
  sendResponse: (r?: unknown) => void,
) => void;
type InstalledListener = (details: { reason: string }) => void;

let onMessageListener: MessageListener;
let onInstalledListener: InstalledListener;

const setupBackgroundMocks = async (): Promise<void> => {
  jest.resetModules();

  globalThis.chrome = {
    runtime: {
      getURL: jest.fn((path) => `chrome-extension://id/${path}`),
      onInstalled: {
        addListener: jest.fn((listener) => {
          onInstalledListener = listener;
        }),
      },
      onMessage: {
        addListener: jest.fn((listener) => {
          onMessageListener = listener;
        }),
      },
    },
    tabs: {
      create: jest.fn().mockResolvedValue({ id: 1 }),
      query: jest.fn((q, cb) => cb([{ active: true, id: 1, index: 0 }])),
      remove: jest.fn(),
    },
  } as unknown as typeof chrome;

  await import('./background');
};

describe('background script - message handlers', () => {
  beforeEach(setupBackgroundMocks);

  it('should register listeners on load', () => {
    expect(onMessageListener).toBeDefined();
    expect(onInstalledListener).toBeDefined();
  });

  it('should handle executeAction message', () => {
    const sendResponse = jest.fn();
    onMessageListener(
      { event: 'close_tab', msg: 'executeAction' },
      {},
      sendResponse,
    );
    expect(sendResponse).toHaveBeenCalledWith({ wasExecuted: true });
  });

  it('should handle nextMenuSkip state transitions', () => {
    const sendResponse = jest.fn();

    onMessageListener({ msg: 'nextMenuSkipGet' }, {}, sendResponse);
    expect(sendResponse).toHaveBeenCalledWith({ nextMenuSkip: false });

    onMessageListener({ msg: 'nextMenuSkipOn' }, {}, sendResponse);

    sendResponse.mockClear();
    onMessageListener({ msg: 'nextMenuSkipGet' }, {}, sendResponse);
    expect(sendResponse).toHaveBeenCalledWith({ nextMenuSkip: true });

    onMessageListener({ msg: 'nextMenuSkipOff' }, {}, sendResponse);
    sendResponse.mockClear();
    onMessageListener({ msg: 'nextMenuSkipGet' }, {}, sendResponse);
    expect(sendResponse).toHaveBeenCalledWith({ nextMenuSkip: false });
  });

  it('should handle unknown messages', () => {
    const sendResponse = jest.fn();
    onMessageListener({ msg: 'unknown' }, {}, sendResponse);
    expect(sendResponse).toHaveBeenCalledWith({ message: 'unknown command' });
  });

  it('should safely handle prototype properties and invalid requests', () => {
    const sendResponse = jest.fn();

    // Prototype properties
    ['toString', 'constructor', 'hasOwnProperty', '__proto__'].forEach((prop) => {
      sendResponse.mockClear();
      onMessageListener({ msg: prop }, {}, sendResponse);
      expect(sendResponse).toHaveBeenCalledWith({ message: 'unknown command' });
    });

    // Null/undefined/invalid requests
    [null, undefined, {}, { msg: 123 }].forEach((req) => {
      sendResponse.mockClear();
      expect(() => onMessageListener(req, {}, sendResponse)).not.toThrow();
      expect(sendResponse).toHaveBeenCalledWith({ message: 'unknown command' });
    });
  });
});

describe('background script - install handler', () => {
  beforeEach(setupBackgroundMocks);

  it('should open options page on install', async () => {
    onInstalledListener({ reason: 'install' });
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(chrome.tabs.create).toHaveBeenCalledWith(
      expect.objectContaining({
        url: 'chrome-extension://id/options_page/options_page.html',
      }),
    );
  });
});
