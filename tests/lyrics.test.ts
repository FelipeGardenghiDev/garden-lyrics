import { describe, it, expect } from 'vitest';
import {
  countSyllables,
  findRhymeSuggestions,
  findThesaurusSuggestions,
  formatLyricsForTeleprompt,
  INITIAL_LYRIC_PROJECT,
} from '../src/core/lyric-engine';

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

  it('retrieves poetic synonyms and evocative metaphors from thesaurus', () => {
    const amorData = findThesaurusSuggestions('amor');
    expect(amorData).not.toBeNull();
    expect(amorData?.synonyms).toContain('paixão');
    expect(amorData?.metaphors.length).toBeGreaterThan(0);

    const matchBySynonym = findThesaurusSuggestions('melancolia');
    expect(matchBySynonym?.theme).toBe('tristeza');
  });

  it('formats project lyrics into Garden Teleprompt compatible structure', () => {
    const telepromptText = formatLyricsForTeleprompt(INITIAL_LYRIC_PROJECT);
    expect(telepromptText).toContain('# Jardim de Vidro');
    expect(telepromptText).toContain('Artista: Felipe Gardenghi');
    expect(telepromptText).toContain('[Verso 1]');
    expect(telepromptText).toContain('Caminho pelas ruas dessa solidão');
    expect(telepromptText).toContain('[Refrão]');
    expect(telepromptText).toContain('Nesse jardim de vidro a alma vai quebrar');
  });
});
