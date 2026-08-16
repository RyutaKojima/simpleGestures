import Option from './option';

describe('Option', () => {
  it('should initialize with default values when empty object is passed', () => {
    const opt = new Option({});

    expect(opt.enabled).toBe(true);
    expect(opt.language).toBe('Japanese');
    expect(opt.colorCode).toBe('#FF0000');
    expect(opt.lineWidth).toBe(3);
    expect(opt.commandTextOn).toBe(true);
    expect(opt.actionTextOn).toBe(true);
    expect(opt.trailOn).toBe(true);
    expect(opt.gestureCloseTabWithoutPinned).toBe('DR');
    expect(opt.gestureNewTab).toBe('D');
    expect(opt.gestureReload).toBe('DU');
  });

  it('should override defaults and serialize to JSON', () => {
    const custom = {
      action_text_on: false,
      color_code: '#00FF00',
      command_text_on: false,
      enabled: false,
      gesture_close_tab: 'D',
      language: 'English',
      line_width: 5,
      trail_on: false,
    };

    const opt = new Option(custom);

    expect(opt.enabled).toBe(false);
    expect(opt.language).toBe('English');
    expect(opt.colorCode).toBe('#00FF00');

    const serialized = opt.serialize();
    expect(serialized).toHaveProperty('enabled', false);
    expect(opt.toJson()).toBe(JSON.stringify(serialized));
  });
});
