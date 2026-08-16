import TrailCanvas from './trail_canvas';

describe('TrailCanvas', () => {
  let trailCanvas: TrailCanvas;
  let mockContext: Partial<CanvasRenderingContext2D>;

  beforeEach(() => {
    mockContext = {
      beginPath: jest.fn(),
      clearRect: jest.fn(),
      fillStyle: '',
      fillText: jest.fn(),
      lineTo: jest.fn(),
      lineWidth: 0,
      moveTo: jest.fn(),
      stroke: jest.fn(),
      strokeStyle: '',
    };

    jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
      mockContext as CanvasRenderingContext2D,
    );

    trailCanvas = new TrailCanvas('testCanvas', '9999');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should initialize canvas and set size and style', () => {
    const canvas = trailCanvas.getCanvas();
    expect(canvas.id).toBe('testCanvas');
    expect(canvas.style.zIndex).toBe('9999');
    expect(trailCanvas.getCanvasId()).toBe('testCanvas');

    trailCanvas.setCanvasSize(800, 600);
    expect(canvas.width).toBe(800);
    expect(canvas.height).toBe(600);

    trailCanvas.setLineStyle('#FF0000', 5);
    expect(mockContext.strokeStyle).toBe('#FF0000');
    expect(mockContext.lineWidth).toBe(5);
  });

  it('should clear canvas, draw text and draw line', () => {
    trailCanvas.setCanvasSize(800, 600);
    trailCanvas.clearCanvas();
    expect(mockContext.clearRect).toHaveBeenCalledWith(0, 0, 800, 600);

    trailCanvas.drawText('Test', 10, 20, '#00FF00');
    expect(mockContext.fillText).toHaveBeenCalledWith('Test', 10, 20);

    trailCanvas.drawLine(0, 0, 100, 200);
    expect(mockContext.beginPath).toHaveBeenCalled();
    expect(mockContext.moveTo).toHaveBeenCalledWith(0, 0);
    expect(mockContext.lineTo).toHaveBeenCalledWith(100, 200);
    expect(mockContext.stroke).toHaveBeenCalled();
  });
});
