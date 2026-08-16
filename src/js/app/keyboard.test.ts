import Keyboard from './keyboard';

describe('Keyboard', () => {
  let keyboard: Keyboard;

  beforeEach(() => {
    keyboard = new Keyboard();
  });

  it('should set, get, reset key states and handle lock mechanism', () => {
    expect(keyboard.isOn(Keyboard.KEY_CTRL)).toBeFalsy();

    keyboard.setOn(Keyboard.KEY_CTRL);
    expect(keyboard.isOn(Keyboard.KEY_CTRL)).toBe(true);

    keyboard.setOff(Keyboard.KEY_CTRL);
    expect(keyboard.isOn(Keyboard.KEY_CTRL)).toBe(false);

    keyboard.setOn('A');
    keyboard.reset();
    expect(keyboard.isOn('A')).toBeFalsy();

    keyboard.lock();
    keyboard.setOn('Control');
    expect(keyboard.isOn('Control')).toBeFalsy();

    keyboard.unlock();
    keyboard.setOn('Control');
    expect(keyboard.isOn('Control')).toBe(true);
  });
});
