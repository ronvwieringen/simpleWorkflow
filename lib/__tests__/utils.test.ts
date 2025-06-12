// lib/__tests__/utils.test.ts

import { generateId } from '../utils';

describe('generateId', () => {
  it('should return a string', () => {
    expect(typeof generateId('test')).toBe('string');
  });

  it('should include the provided prefix', () => {
    const prefix = 'myPrefix';
    expect(generateId(prefix)).toMatch(new RegExp(`^${prefix}-`));
  });

  it('should generate unique IDs on subsequent calls', () => {
    const id1 = generateId('unique');
    const id2 = generateId('unique');
    expect(id1).not.toBe(id2);
  });

  it('should generate different IDs even with rapid calls', () => {
    // This test is probabilistic but good for catching issues with Date.now() resolution if Math.random() is not diverse enough
    const ids = new Set();
    for (let i = 0; i < 100; i++) {
      ids.add(generateId('rapid'));
    }
    expect(ids.size).toBe(100);
  });

  it('should handle empty prefix', () => {
    expect(generateId('')).toMatch(/^-[\d]+-[a-zA-Z0-9]+/);
  });
});
