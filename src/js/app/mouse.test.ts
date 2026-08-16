import Mouse, { HTMLChildElement, HTMLElementEvent } from './mouse';

describe('Mouse', () => {
  let mouse: Mouse;

  beforeEach(() => {
    mouse = new Mouse();
  });

  it('should manage button state and reset correctly', () => {
    expect(mouse.isOn(Mouse.LEFT_BUTTON)).toBeFalsy();

    mouse.setOn(Mouse.LEFT_BUTTON);
    expect(mouse.isOn(Mouse.LEFT_BUTTON)).toBe(true);

    mouse.setOff(Mouse.LEFT_BUTTON);
    expect(mouse.isOn(Mouse.LEFT_BUTTON)).toBe(false);

    mouse.setLeft(true);
    expect(mouse.isLeft()).toBe(true);

    mouse.setRight(true);
    expect(mouse.isRight()).toBe(true);

    mouse.reset();
    expect(mouse.isLeft()).toBeFalsy();
  });

  describe('getHref', () => {
    it('should return target or closest anchor href if present and http/https', () => {
      const link = document.createElement('a') as unknown as HTMLChildElement;
      link.href = 'https://example.com/link';

      const event = { target: link } as HTMLElementEvent<HTMLChildElement>;
      expect(Mouse.getHref(event)).toBe('https://example.com/link');

      const parentLink = document.createElement('a');
      parentLink.href = 'http://example.com/parent';
      const childSpan = document.createElement('span') as unknown as HTMLChildElement;
      childSpan.closest = jest.fn().mockReturnValue(parentLink);

      const event2 = { target: childSpan } as HTMLElementEvent<HTMLChildElement>;
      expect(Mouse.getHref(event2)).toBe('http://example.com/parent');
    });

    it('should filter out unsafe schemes like javascript:', () => {
      const link = document.createElement('a') as unknown as HTMLChildElement;
      link.href = 'javascript:alert(1)';

      const event = { target: link } as HTMLElementEvent<HTMLChildElement>;
      expect(Mouse.getHref(event)).toBeNull();
    });

    it('should return null if neither target nor closest anchor has href', () => {
      const div = document.createElement('div') as unknown as HTMLChildElement;
      div.closest = jest.fn().mockReturnValue(null);

      const event = { target: div } as HTMLElementEvent<HTMLChildElement>;
      expect(Mouse.getHref(event)).toBeNull();
    });
  });
});
