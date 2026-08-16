import Mouse, { HTMLChildElement, HTMLElementEvent } from './mouse';

describe('Mouse - button state', () => {
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
});

describe('Mouse - getHref', () => {
  const createMockEvent = (
    targetHref?: string,
    parentHref?: string,
  ): HTMLElementEvent<HTMLChildElement> => {
    const parentLink = parentHref
      ? ({ href: parentHref } as unknown as HTMLLinkElement)
      : null;

    const target = {
      closest: (selector: string) => (selector === 'a' ? parentLink : null),
      href: targetHref || '',
    } as unknown as HTMLChildElement;

    return { target } as unknown as HTMLElementEvent<HTMLChildElement>;
  };

  it('returns http and https URLs', () => {
    const httpEvent = createMockEvent('http://example.com/test');
    expect(Mouse.getHref(httpEvent)).toBe('http://example.com/test');

    const httpsEvent = createMockEvent('https://example.com/test');
    expect(Mouse.getHref(httpsEvent)).toBe('https://example.com/test');

    const parentEvent = createMockEvent('', 'https://example.com/parent');
    expect(Mouse.getHref(parentEvent)).toBe('https://example.com/parent');
  });

  it('rejects unsafe URLs (javascript, data, file) and empty href', () => {
    const jsEvent = createMockEvent('javascript:alert(1)');
    expect(Mouse.getHref(jsEvent)).toBeNull();

    const dataEvent = createMockEvent('data:text/html,<script>alert(1)</script>');
    expect(Mouse.getHref(dataEvent)).toBeNull();

    const fileEvent = createMockEvent('file:///etc/passwd');
    expect(Mouse.getHref(fileEvent)).toBeNull();

    const emptyEvent = createMockEvent('');
    expect(Mouse.getHref(emptyEvent)).toBeNull();
  });
});
