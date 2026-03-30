import { formatPrice, formatDuration } from '../../utils/formatters';

describe('formatPrice', () => {
  it('formats cents to EUR with French locale', () => {
    const result = formatPrice(5390);
    expect(result).toContain('53');
    expect(result).toContain('90');
  });

  it('formats zero', () => {
    const result = formatPrice(0);
    expect(result).toContain('0');
  });
});

describe('formatDuration', () => {
  it('formats minutes only', () => {
    expect(formatDuration(30)).toBe('30min');
  });

  it('formats hours only', () => {
    expect(formatDuration(60)).toBe('1h');
  });

  it('formats hours and minutes', () => {
    expect(formatDuration(90)).toBe('1h30');
  });

  it('pads single-digit minutes', () => {
    expect(formatDuration(65)).toBe('1h05');
  });
});
