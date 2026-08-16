const setupHandlerMock = async (): Promise<void> => {
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

  Object.defineProperty(Event.prototype, 'isTrusted', {
    configurable: true,
    get: () => true,
  });

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
