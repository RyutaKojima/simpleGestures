import ContentScripts from './content_scripts';
import TrailCanvas from './trail_canvas';

describe('ContentScripts - initialization and options', () => {
  let contentScripts: ContentScripts;
  let trailCanvas: TrailCanvas;

  beforeEach(() => {
    document.body.innerHTML = '';
    trailCanvas = new TrailCanvas('canvasId', '1000');
    jest.spyOn(trailCanvas, 'drawLine').mockImplementation();
    jest.spyOn(trailCanvas, 'setLineStyle').mockImplementation();

    contentScripts = new ContentScripts(trailCanvas);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should initialize infoDiv and canvas styles', () => {
    contentScripts.createInfoDiv();
    expect(contentScripts.infoDiv).not.toBeNull();
    expect(contentScripts.commandDiv).not.toBeNull();
    expect(contentScripts.actionNameDiv).not.toBeNull();
  });

  it('should load options and observe threshold', async () => {
    jest.spyOn(contentScripts.option, 'load').mockResolvedValue();

    await contentScripts.loadOption();
    expect(contentScripts.option.load).toHaveBeenCalledTimes(1);

    await contentScripts.loadOption();
    expect(contentScripts.option.load).toHaveBeenCalledTimes(1);
  });
});

describe('ContentScripts - drawing', () => {
  let contentScripts: ContentScripts;
  let trailCanvas: TrailCanvas;

  beforeEach(() => {
    document.body.innerHTML = '';
    trailCanvas = new TrailCanvas('canvasId', '1000');
    jest.spyOn(trailCanvas, 'drawLine').mockImplementation();
    jest.spyOn(trailCanvas, 'setLineStyle').mockImplementation();

    contentScripts = new ContentScripts(trailCanvas);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should draw trail and text when element exists in document', () => {
    contentScripts.createInfoDiv();
    document.body.appendChild(contentScripts.infoDiv!);

    const canvas = trailCanvas.getCanvas();
    document.body.appendChild(canvas);

    contentScripts.draw(
      { fromX: 0, fromY: 0, toX: 10, toY: 10 },
      'R',
      'Right',
    );

    expect(trailCanvas.drawLine).toHaveBeenCalledWith(0, 0, 10, 10);
    expect(contentScripts.commandDiv!.textContent).toBe('R');
    expect(contentScripts.actionNameDiv!.textContent).toBe('Right');
  });

  it('clearText should reset displayed text', () => {
    contentScripts.createInfoDiv();
    document.body.appendChild(contentScripts.infoDiv!);

    contentScripts.drawText('R', 'Right');
    expect(contentScripts.commandDiv!.textContent).toBe('R');

    contentScripts.clearText();
    expect(contentScripts.commandDiv!.textContent).toBe('');
    expect(contentScripts.actionNameDiv!.textContent).toBe('');
  });
});

describe('ContentScripts - actions execution', () => {
  let contentScripts: ContentScripts;
  let trailCanvas: TrailCanvas;

  beforeEach(() => {
    document.body.innerHTML = '';
    trailCanvas = new TrailCanvas('canvasId', '1000');
    contentScripts = new ContentScripts(trailCanvas);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should execute supported actions', () => {
    const historyBackSpy = jest.spyOn(window.history, 'back').mockImplementation();
    const historyForwardSpy = jest.spyOn(window.history, 'forward').mockImplementation();
    const windowStopSpy = jest.spyOn(window, 'stop').mockImplementation();
    const windowScrollToSpy = jest.spyOn(window, 'scrollTo').mockImplementation();

    expect(contentScripts.exeAction('back', null)).toBe(true);
    expect(historyBackSpy).toHaveBeenCalled();

    expect(contentScripts.exeAction('forward', null)).toBe(true);
    expect(historyForwardSpy).toHaveBeenCalled();

    expect(contentScripts.exeAction('stop', null)).toBe(true);
    expect(windowStopSpy).toHaveBeenCalled();

    const mockTarget = document.createElement('div');
    mockTarget.scrollTo = jest.fn();

    expect(contentScripts.exeAction('scroll_top', mockTarget)).toBe(true);
    expect(windowScrollToSpy).toHaveBeenCalledWith(0, 0);

    expect(contentScripts.exeAction('scroll_bottom', mockTarget)).toBe(true);
    expect(contentScripts.exeAction('unsupported_action', null)).toBe(false);
  });
});
