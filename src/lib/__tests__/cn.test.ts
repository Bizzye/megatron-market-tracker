import { describe, expect, it } from 'vitest';
import { cn } from '../cn';

describe('cn', () => {
  it('joins truthy classes', () => {
    expect(cn('a', undefined, 'c')).toBe('a c');
  });

  it('returns empty string when no classes', () => {
    expect(cn(undefined, null, false)).toBe('');
  });
});
