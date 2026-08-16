import lang from './lang';

describe('lang', () => {
  it('should contain confirmOptionReset configuration', () => {
    expect(lang.confirmOptionReset).toBeDefined();
    expect(lang.confirmOptionReset.English).toBe('Reset all settings. Is it OK?');
  });

  it('should contain gesture mappings for English and Japanese', () => {
    expect(lang.gesture).toBeDefined();
    expect(lang.gesture.gesture_back).toEqual({
      English: 'Back',
      Japanese: '戻る',
    });
  });
});
