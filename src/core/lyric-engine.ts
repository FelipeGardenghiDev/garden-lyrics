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

// Poetic Thesaurus with thematic emotional associations and evocative metaphors
export const POETIC_THESAURUS: Record<string, { synonyms: string[]; metaphors: string[] }> = {
  amor: {
    synonyms: ['paixão', 'afeto', 'ardor', 'chama', 'ternura', 'devoção', 'querer', 'adoração'],
    metaphors: ['fogo que arde sem se ver', 'porto seguro no temporal', 'mar revolto', 'sol no inverno'],
  },
  tristeza: {
    synonyms: ['melancolia', 'dor', 'pesar', 'amargura', 'angústia', 'desolação', 'pranto', 'sombra'],
    metaphors: ['noite sem estrelas', 'chuva de cinzas', 'mar em tempestade', 'eco em sala vazia'],
  },
  esperança: {
    synonyms: ['fé', 'aurora', 'alvorada', 'sonho', 'promessa', 'luz', 'renascer', 'abrigo'],
    metaphors: ['raio de sol entre nuvens', 'semente sob o asfalto', 'vento a favor'],
  },
  tempo: {
    synonyms: ['instante', 'eterno', 'segundo', 'maré', 'vento', 'passado', 'memória', 'relógio'],
    metaphors: ['rio que nunca volta', 'areia entre os dedos', 'ladrão silencioso'],
  },
  solidão: {
    synonyms: ['vazio', 'silêncio', 'abandono', 'deserto', 'isolamento', 'abismo', 'cinza'],
    metaphors: ['quarto sem janelas', 'eco sem resposta', 'ilha de névoa'],
  },
  liberdade: {
    synonyms: ['voo', 'horizonte', 'asas', 'vento', 'amplidão', 'despreendimento', 'infinito'],
    metaphors: ['pássaro que rompe a gaiola', 'oceano sem margem', 'céu aberto'],
  },
};

/**
 * Searches the poetic thesaurus for mood synonyms and poetic imagery.
 */
export function findThesaurusSuggestions(
  term: string
): { theme: string; synonyms: string[]; metaphors: string[] } | null {
  const clean = term.toLowerCase().trim();
  if (!clean) return null;

  for (const [theme, data] of Object.entries(POETIC_THESAURUS)) {
    if (theme === clean || data.synonyms.some((s) => s.toLowerCase() === clean)) {
      return { theme, ...data };
    }
  }

  // Partial match
  for (const [theme, data] of Object.entries(POETIC_THESAURUS)) {
    if (theme.includes(clean) || data.synonyms.some((s) => s.toLowerCase().includes(clean))) {
      return { theme, ...data };
    }
  }

  return null;
}

/**
 * Formats a lyric project into Garden Teleprompt compatible stage text with section tags.
 */
export function formatLyricsForTeleprompt(project: LyricProject): string {
  let output = `[Info]\n# ${project.title}\nArtista: ${project.artist}\nTom: ${project.key} | BPM: ${project.bpm}\n`;
  if (project.notes) {
    output += `Notas: ${project.notes}\n`;
  }
  output += '\n';

  project.sections.forEach((sec) => {
    output += `[${sec.label}]\n`;
    sec.lines.forEach((line) => {
      output += `${line}\n`;
    });
    output += '\n';
  });

  return output.trim();
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
