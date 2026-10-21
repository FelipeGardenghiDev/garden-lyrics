import { LyricProject } from '../types';

/**
 * Counts syllables in a line of lyrics with sinalefa / vowel-cluster approximation.
 * Critical for songwriters fitting lyrics to melody beats.
 */
export function countSyllables(line: string): number {
  const cleaned = line
    .trim()
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'–—]/g, '');

  if (!cleaned) return 0;

  const words = cleaned.split(/\s+/);
  let totalSyllables = 0;

  for (let i = 0; i < words.length; i++) {
    const word = words[i];

    // Match vowel clusters (dipthongs/monophthongs)
    const vowelMatches = word.match(/[aeiouáéíóúâêôãõàü]+/gi);
    let count = vowelMatches ? vowelMatches.length : 1;

    // Sinalefa (elision): if current word starts with vowel and prev word ended with vowel, join 1 syllable
    if (i > 0) {
      const prevWord = words[i - 1];
      const endsWithVowel = /[aeiouáéíóúâêôãõàü]$/i.test(prevWord);
      const startsWithVowel = /^[aeiouáéíóúâêôãõàü]/i.test(word);
      if (endsWithVowel && startsWithVowel && totalSyllables > 0) {
        totalSyllables -= 1; // Elision
      }
    }

    totalSyllables += Math.max(1, count);
  }

  return totalSyllables;
}

// Offline dictionary of rhyming endings for Portuguese lyricists
const RHYME_DICTIONARY: Record<string, string[]> = {
  ão: ['coração', 'canção', 'razão', 'solidão', 'ilusão', 'paixão', 'perdão', 'visão', 'direção', 'chão', 'mão', 'vão'],
  ar: ['amar', 'olhar', 'chegar', 'cantar', 'voar', 'sonhar', 'passar', 'lembrar', 'falar', 'lugar', 'mar', 'pesar'],
  or: ['amor', 'dor', 'calor', 'senhor', 'flor', 'sabor', 'clamor', 'favor', 'ardor', 'valor'],
  ente: ['frente', 'presente', 'mente', 'valente', 'gente', 'ardente', 'urgente', 'quente', 'semente', 'repente'],
  dade: ['saudade', 'cidade', 'verdade', 'liberdade', 'claridade', 'tempestade', 'vontade', 'amizade'],
  im: ['fim', 'assim', 'jardim', 'enfim', 'carmim', 'ruim', 'marfim', 'festim'],
  uz: ['luz', 'conduz', 'seduz', 'cruz', 'jesus', 'produz', 'reluz'],
  ia: ['dia', 'guia', 'fantasia', 'magia', 'melodia', 'poesia', 'harmonia', 'noite e dia'],
};

/**
 * Searches for rhymes based on phonetic suffix.
 */
export function findRhymeSuggestions(word: string): string[] {
  const clean = word.toLowerCase().trim().replace(/[^a-záéíóúâêôãõàü]/g, '');
  if (!clean) return [];

  for (const [suffix, rhymes] of Object.entries(RHYME_DICTIONARY)) {
    if (clean.endsWith(suffix)) {
      return rhymes.filter((r) => r !== clean);
    }
  }

  // Fallback: match last 2 letters
  const ending2 = clean.slice(-2);
  const matched: string[] = [];
  Object.values(RHYME_DICTIONARY).forEach((list) => {
    list.forEach((w) => {
      if (w.endsWith(ending2) && w !== clean && !matched.includes(w)) {
        matched.push(w);
      }
    });
  });

  return matched.slice(0, 10);
}

export const INITIAL_LYRIC_PROJECT: LyricProject = {
  id: 'song-1',
  title: 'Jardim de Vidro',
  artist: 'Felipe Gardenghi',
  bpm: 110,
  key: 'Em',
  notes: 'Afinação Drop D, refrão explosivo com guitarras distorcidas.',
  sections: [
    {
      id: 'sec-1',
      type: 'verse',
      label: 'Verso 1',
      lines: [
        'Caminho pelas ruas dessa solidão',
        'Buscando uma resposta pro meu coração',
        'As luzes da cidade começam a brilhar',
        'E o vento traz lembranças que não vão passar',
      ],
    },
    {
      id: 'sec-2',
      type: 'pre-chorus',
      label: 'Pré-Refrão',
      lines: [
        'O tempo corre contra a maré',
        'Mas eu mantenho viva a minha fé',
      ],
    },
    {
      id: 'sec-3',
      type: 'chorus',
      label: 'Refrão',
      lines: [
        'Nesse jardim de vidro a alma vai quebrar',
        'Se você tiver medo de tentar voar',
        'Abra os olhos para a imensidão',
        'E sinta a batida em cada pulsação',
      ],
    },
  ],
};
