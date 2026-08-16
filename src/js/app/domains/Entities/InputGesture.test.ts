import LibOption from '../../lib_option';
import MousePoint from '../ValueObjects/MousePoint';
import InputGesture from './InputGesture';

describe('InputGesture', () => {
  let inputGesture: InputGesture;

  beforeEach(() => {
    inputGesture = new InputGesture();
  });

  it('should initialize with clear state and set link URL', () => {
    expect(inputGesture.isUpdateLine).toBe(false);
    expect(inputGesture.linkUrl).toBeNull();
    expect(inputGesture.latestConfirmedPoint).toBeNull();
    expect(inputGesture.trackingPoints).toEqual([]);
    expect(inputGesture.gestureActionCode).toBeNull();

    inputGesture.setLinkUrl('https://example.com');
    expect(inputGesture.linkUrl).toBe('https://example.com');
  });

  it('should add points and update tracking points', () => {
    const p1 = new MousePoint(0, 0);
    inputGesture.addPoint(p1);

    expect(inputGesture.latestConfirmedPoint).toBe(p1);
    expect(inputGesture.trackingPoints).toEqual([p1]);
    expect(inputGesture.isUpdateLine).toBe(false);

    const p2 = new MousePoint(5, 0);
    inputGesture.addPoint(p2);
    expect(inputGesture.isUpdateLine).toBe(false);

    const p3 = new MousePoint(20, 0);
    inputGesture.addPoint(p3);
    expect(inputGesture.isUpdateLine).toBe(true);
    expect(inputGesture.latestConfirmedPoint).toBe(p3);
    expect(inputGesture.gestureCommands.rawString).toBe('R');
  });

  it('should calculate newLineFrom, newLineTo and update action code', () => {
    const p1 = new MousePoint(0, 0);
    inputGesture.addPoint(p1);
    const p2 = new MousePoint(20, 0);
    inputGesture.addPoint(p2);

    expect(inputGesture.newLineFrom).toEqual(p1);
    expect(inputGesture.newLineTo).toEqual(p2);

    const option = new LibOption();
    option.setRawStorageData(
      JSON.stringify({ gesture_close_tab: 'R', gesture_forward: '' }),
    );

    inputGesture.updateAction(option);
    expect(inputGesture.gestureActionCode).toBe('close_tab');
    expect(inputGesture.gestureActionName(option)).not.toBe('');
  });
});
