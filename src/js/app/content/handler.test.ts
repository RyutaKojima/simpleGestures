const createTrustedMouseEvent = (
  type: string,
  eventInitDict?: MouseEventInit,
): MouseEvent => {
  const event = new MouseEvent(type, eventInitDict);
  const symbols = Object.getOwnPropertySymbols(event);
  if (symbols.length > 0) {
    const impl = (event as unknown as Record<symbol, unknown>)[symbols[0]];
    if (impl) {
      Object.defineProperty(impl, 'isTrusted', {
        get() {
          return true;
        },
        set() {},
      });
    }
  }
  return event;
};

type EventListenerItem = {
  listener: EventListenerOrEventListenerObject;
  options?: boolean | AddEventListenerOptions;
  type: string;
};

const docListeners: EventListenerItem[] = [];
const originalAddEventListener = document.addEventListener.bind(document);

document.addEventListener = (
  type: string,
  listener: EventListenerOrEventListenerObject,
  options?: boolean | AddEventListenerOptions,
) => {
  docListeners.push({ listener, options, type });
  originalAddEventListener(type, listener, options);
};

const cleanupDocListeners = (): void => {
  for (const { listener, options, type } of docListeners) {
    document.removeEventListener(type, listener, options);
  }
  docListeners.length = 0;
};

const setupHandlerMock = async (): Promise<void> => {
  cleanupDocListeners();
  jest.resetModules();
  document.body.innerHTML =
    '<div><a id="testLink" href="https://example.com/test"><span>Click</span></a></div>';

  jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
    beginPath: jest.fn(),
    clearRect: jest.fn(),
    fillStyle: '',
    fillText: jest.fn(),
    lineTo: jest.fn(),
    lineWidth: 0,
    moveTo: jest.fn(),
    stroke: jest.fn(),
    strokeStyle: '',
  } as unknown as CanvasRenderingContext2D);

  globalThis.chrome = {
    runtime: {
      sendMessage: jest.fn((param, callback) => {
        if (callback) {
          callback({ nextMenuSkip: false });
        }
      }),
    },
    storage: {
      local: {
        get: jest.fn((key, cb) =>
          cb({ options: JSON.stringify({ enabled: true, trail_on: true }) }),
        ),
      },
    },
  } as unknown as typeof chrome;

  window.confirm = jest.fn().mockReturnValue(true);

  await import('./handler');
};

describe('handler.ts - keyboard events', () => {
  beforeEach(setupHandlerMock);

  afterEach(() => {
    cleanupDocListeners();
    jest.restoreAllMocks();
  });

  it('should handle focus, keydown, keyup events', async () => {
    const focusEvent = new FocusEvent('focus', { bubbles: true });
    window.dispatchEvent(focusEvent);

    const keydownEvent = new KeyboardEvent('keydown', {
      bubbles: true,
      key: 'Control',
    });
    document.dispatchEvent(keydownEvent);

    const keyupEvent = new KeyboardEvent('keyup', {
      bubbles: true,
      key: 'Control',
    });
    document.dispatchEvent(keyupEvent);
  });
});

describe('handler.ts - mouse events', () => {
  beforeEach(setupHandlerMock);

  afterEach(() => {
    cleanupDocListeners();
    jest.restoreAllMocks();
  });

  it('should handle mousedown, mousemove, mouseup, contextmenu sequence', async () => {
    const link = document.getElementById('testLink')!;

    const mousedown = createTrustedMouseEvent('mousedown', {
      bubbles: true,
      button: 2,
      buttons: 2,
      clientX: 100,
      clientY: 100,
    });
    Object.defineProperty(mousedown, 'pageX', { value: 100 });
    Object.defineProperty(mousedown, 'pageY', { value: 100 });
    Object.defineProperty(mousedown, 'target', { value: link });
    document.dispatchEvent(mousedown);

    const mousemove = createTrustedMouseEvent('mousemove', {
      bubbles: true,
      button: 2,
      buttons: 2,
      clientX: 200,
      clientY: 100,
    });
    Object.defineProperty(mousemove, 'pageX', { value: 200 });
    Object.defineProperty(mousemove, 'pageY', { value: 100 });
    document.dispatchEvent(mousemove);

    const mouseup = createTrustedMouseEvent('mouseup', {
      bubbles: true,
      button: 2,
      buttons: 0,
    });
    document.dispatchEvent(mouseup);

    const contextmenu = createTrustedMouseEvent('contextmenu', {
      bubbles: true,
      cancelable: true,
    });
    document.dispatchEvent(contextmenu);
  });
});

const LINUX_UA = [
  'Mozilla/5.0 (X11; Linux x86_64)',
  'AppleWebKit/537.36 (KHTML, like Gecko)',
  'Chrome/120.0.0.0 Safari/537.36',
].join(' ');

const WINDOWS_UA = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
  'AppleWebKit/537.36 (KHTML, like Gecko)',
  'Chrome/120.0.0.0 Safari/537.36',
].join(' ');

const MAC_UA = [
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
  'AppleWebKit/537.36 (KHTML, like Gecko)',
  'Chrome/120.0.0.0 Safari/537.36',
].join(' ');

let mockTime = 10000;
const setupHandlerWithUserAgent = async (userAgent: string): Promise<void> => {
  mockTime += 2000;
  jest.spyOn(Date, 'now').mockReturnValue(mockTime);
  Object.defineProperty(window.navigator, 'userAgent', {
    configurable: true,
    get: () => userAgent,
  });
  await setupHandlerMock();
  await new Promise((resolve) => setTimeout(resolve, 10));
};

const cleanupHandlerMock = (): void => {
  cleanupDocListeners();
  jest.restoreAllMocks();
};

const dispatchRightMouseDown = (): void => {
  const link = document.getElementById('testLink')!;
  const event = createTrustedMouseEvent('mousedown', {
    bubbles: true,
    button: 2,
    buttons: 2,
    clientX: 100,
    clientY: 100,
  });
  Object.defineProperty(event, 'pageX', { value: 100 });
  Object.defineProperty(event, 'pageY', { value: 100 });
  Object.defineProperty(event, 'target', { value: link });
  document.dispatchEvent(event);
};

const dispatchRightMouseMove = (): void => {
  const event = createTrustedMouseEvent('mousemove', {
    bubbles: true,
    button: 2,
    buttons: 2,
    clientX: 200,
    clientY: 100,
  });
  Object.defineProperty(event, 'pageX', { value: 200 });
  Object.defineProperty(event, 'pageY', { value: 100 });
  document.dispatchEvent(event);
};

const dispatchRightMouseUp = (): void => {
  document.dispatchEvent(createTrustedMouseEvent('mouseup', {
    bubbles: true,
    button: 2,
    buttons: 0,
  }));
};

const dispatchContextmenu = (): MouseEvent => {
  const event = createTrustedMouseEvent('contextmenu', {
    bubbles: true,
    cancelable: true,
  });
  document.dispatchEvent(event);
  return event;
};

describe('handler.ts - Linux contextmenu handling', () => {
  afterEach(() => {
    cleanupHandlerMock();
  });

  it(
    'should suppress contextmenu before mouseup and continue gesture in Linux Chrome',
    async () => {
      await setupHandlerWithUserAgent(LINUX_UA);

      dispatchRightMouseDown();
      const contextmenu = dispatchContextmenu();
      expect(contextmenu.defaultPrevented).toBe(true);

      dispatchRightMouseMove();
      dispatchRightMouseUp();

      expect(chrome.runtime.sendMessage).toHaveBeenCalledWith(
        { msg: 'nextMenuSkipOn' },
        expect.any(Function),
      );
    },
  );

  it('should handle double click contextmenu in Linux environment', async () => {
    await setupHandlerWithUserAgent(LINUX_UA);

    const firstContextmenu = dispatchContextmenu();
    expect(firstContextmenu.defaultPrevented).toBe(true);

    const secondContextmenu = dispatchContextmenu();
    expect(secondContextmenu.defaultPrevented).toBe(false);
  });
});

describe('handler.ts - Windows contextmenu handling', () => {
  afterEach(cleanupHandlerMock);

  it('should allow contextmenu on single click in Windows environment', async () => {
    await setupHandlerWithUserAgent(WINDOWS_UA);

    const contextmenu = dispatchContextmenu();
    expect(contextmenu.defaultPrevented).toBe(false);
  });

  it('should suppress contextmenu after mouseup for a Windows gesture', async () => {
    await setupHandlerWithUserAgent(WINDOWS_UA);

    dispatchRightMouseDown();
    dispatchRightMouseMove();
    dispatchRightMouseUp();
    const contextmenu = dispatchContextmenu();

    expect(contextmenu.defaultPrevented).toBe(true);
    expect(chrome.runtime.sendMessage).toHaveBeenCalledWith(
      { msg: 'nextMenuSkipOn' },
      expect.any(Function),
    );
  });
});

describe('handler.ts - macOS contextmenu handling', () => {
  afterEach(cleanupHandlerMock);

  it('should handle double click contextmenu in macOS environment', async () => {
    await setupHandlerWithUserAgent(MAC_UA);

    const firstContextmenu = dispatchContextmenu();
    expect(firstContextmenu.defaultPrevented).toBe(true);

    const secondContextmenu = dispatchContextmenu();
    expect(secondContextmenu.defaultPrevented).toBe(false);
  });
});
