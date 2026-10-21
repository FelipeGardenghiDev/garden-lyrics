import { describe, it, expect } from 'vitest';
import { countSyllables, findRhymeSuggestions } from '../src/core/lyric-engine';

describe('Garden Lyrics - Syllables & Rhymes Engine', () => {
  it('counts syllables in poetic lines with sinalefa elision', () => {
    // "O tempo corre contra a maré"
    const count = countSyllables('O tempo corre contra a maré');
    expect(count).toBeGreaterThan(5);
    expect(count).toBeLessThanOrEqual(10);
  });

  it('handles empty line without errors', () => {
    expect(countSyllables('')).toBe(0);
    expect(countSyllables('   ')).toBe(0);
  });

  it('finds rhymes based on phonetic suffix', () => {
    const rhymes = findRhymeSuggestions('coração');
    expect(rhymes.length).toBeGreaterThan(0);
    expect(rhymes).toContain('canção');
    expect(rhymes).toContain('solidão');
  });

  it('finds rhymes for verbs ending in -ar', () => {
    const rhymes = findRhymeSuggestions('amar');
    expect(rhymes.length).toBeGreaterThan(0);
    expect(rhymes).toContain('cantar');
  });
});
