import Mouse, { HTMLChildElement, HTMLElementEvent } from './mouse';

describe('Mouse', () => {
  describe('getHref', () => {
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

    it('returns http URLs', () => {
      const event = createMockEvent('http://example.com/test');
      expect(Mouse.getHref(event)).toBe('http://example.com/test');
    });

    it('returns https URLs', () => {
      const event = createMockEvent('https://example.com/test');
      expect(Mouse.getHref(event)).toBe('https://example.com/test');
    });

    it('returns http URLs from parent <a> element', () => {
      const event = createMockEvent('', 'https://example.com/parent');
      expect(Mouse.getHref(event)).toBe('https://example.com/parent');
    });

    it('rejects javascript: URLs (prevents XSS)', () => {
      const event = createMockEvent('javascript:alert(1)');
      expect(Mouse.getHref(event)).toBeNull();
    });

    it('rejects data: URLs', () => {
      const event = createMockEvent('data:text/html,<script>alert(1)</script>');
      expect(Mouse.getHref(event)).toBeNull();
    });

    it('rejects file: URLs', () => {
      const event = createMockEvent('file:///etc/passwd');
      expect(Mouse.getHref(event)).toBeNull();
    });

    it('returns null when no href is present', () => {
      const event = createMockEvent('');
      expect(Mouse.getHref(event)).toBeNull();
    });
  });
});
