const LINUX_UA =
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
const MAC_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
const WIN_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const originalAddEventListener = EventTarget.prototype.addEventListener;
const originalRemoveEventListener = EventTarget.prototype.removeEventListener;

interface AddedListener {
  options?: boolean | AddEventListenerOptions;
  target: EventTarget;
  type: string;
  wrappedListener: EventListener;
}

const addedListeners: AddedListener[] = [];

const clearAddedListeners = (): void => {
  for (const item of addedListeners) {
    originalRemoveEventListener.call(
      item.target,
      item.type,
      item.wrappedListener,
      item.options,
    );
  }
  addedListeners.length = 0;
};

const mockCanvasContext = (): void => {
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
};

const mockAddEventListener = (): void => {
  jest
    .spyOn(EventTarget.prototype, 'addEventListener')
    .mockImplementation(function(
      this: EventTarget,
      type: string,
      listener: EventListenerOrEventListenerObject | null,
      options?: boolean | AddEventListenerOptions,
    ) {
      if (!listener) return;
      const wrappedListener = (e: Event) => {
        const trustedE = new Proxy(e, {
          get(target, prop) {
            if (prop === 'isTrusted') return true;
            const val = Reflect.get(target, prop, target);
            return typeof val === 'function' ?
              (val as (...args: unknown[]) => unknown).bind(target) :
              val;
          },
        }) as Event;
        if (typeof listener === 'function') {
          listener.call(this, trustedE);
        } else {
          listener.handleEvent(trustedE);
        }
      };
      addedListeners.push({
        options,
        target: this,
        type,
        wrappedListener,
      });
      return originalAddEventListener.call(this, type, wrappedListener, options);
    });
};

const mockChromeAndWindow = (): void => {
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
};

const setupHandlerMock = async (userAgent?: string): Promise<void> => {
  clearAddedListeners();
  jest.resetModules();
  document.body.innerHTML =
    '<div><a id="testLink" href="https://example.com/test"><span>Click</span></a></div>';

  if (userAgent) {
    Object.defineProperty(window.navigator, 'userAgent', {
      configurable: true,
      get: () => userAgent,
    });
  }

  mockCanvasContext();
  mockAddEventListener();
  mockChromeAndWindow();

  await import('./handler');
};

describe('handler.ts - keyboard events', () => {
  beforeEach(async () => {
    await setupHandlerMock();
  });

  afterEach(() => {
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
  beforeEach(async () => {
    await setupHandlerMock();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should handle mousedown, mousemove, mouseup, contextmenu sequence', async () => {
    const link = document.getElementById('testLink')!;

    const mousedown = new MouseEvent('mousedown', {
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

    const mousemove = new MouseEvent('mousemove', {
      bubbles: true,
      button: 2,
      buttons: 2,
      clientX: 200,
      clientY: 100,
    });
    Object.defineProperty(mousemove, 'pageX', { value: 200 });
    Object.defineProperty(mousemove, 'pageY', { value: 100 });
    document.dispatchEvent(mousemove);

    const mouseup = new MouseEvent('mouseup', {
      bubbles: true,
      button: 2,
      buttons: 0,
    });
    document.dispatchEvent(mouseup);

    const contextmenu = new MouseEvent('contextmenu', {
      bubbles: true,
      cancelable: true,
    });
    document.dispatchEvent(contextmenu);
  });
});

describe('handler.ts - OS specific contextmenu behavior', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should NOT prevent single right click contextmenu on Linux', async () => {
    await setupHandlerMock(LINUX_UA);

    const contextmenu = new MouseEvent('contextmenu', {
      bubbles: true,
      cancelable: true,
    });
    document.dispatchEvent(contextmenu);

    expect(contextmenu.defaultPrevented).toBe(false);
  });

  it('should NOT prevent single right click contextmenu on Windows', async () => {
    await setupHandlerMock(WIN_UA);

    const contextmenu = new MouseEvent('contextmenu', {
      bubbles: true,
      cancelable: true,
    });
    document.dispatchEvent(contextmenu);

    expect(contextmenu.defaultPrevented).toBe(false);
  });

  it('should prevent single right click but allow double right click on macOS', async () => {
    await setupHandlerMock(MAC_UA);

    const firstContextmenu = new MouseEvent('contextmenu', {
      bubbles: true,
      cancelable: true,
    });
    document.dispatchEvent(firstContextmenu);
    expect(firstContextmenu.defaultPrevented).toBe(true);

    const secondContextmenu = new MouseEvent('contextmenu', {
      bubbles: true,
      cancelable: true,
    });
    document.dispatchEvent(secondContextmenu);
    expect(secondContextmenu.defaultPrevented).toBe(false);
  });
});
