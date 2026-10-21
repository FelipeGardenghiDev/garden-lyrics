import React, { useState } from 'react';
import { LyricProject, LyricSection, SectionType } from './types';
import {
  INITIAL_LYRIC_PROJECT,
  countSyllables,
  findRhymeSuggestions,
} from './core/lyric-engine';
import { VoiceMemoRecorder } from './components/VoiceMemoRecorder';
import {
  Plus,
  Trash2,
  Search,
  Sparkles,
  Printer,
  Copy,
} from 'lucide-react';

export const App: React.FC = () => {
  const [project, setProject] = useState<LyricProject>(INITIAL_LYRIC_PROJECT);
  const [searchWord, setSearchWord] = useState('');
  const [rhymes, setRhymes] = useState<string[]>([]);
  const [copyFeedback, setCopyFeedback] = useState(false);

  const handleRhymeSearch = (word: string) => {
    setSearchWord(word);
    const suggestions = findRhymeSuggestions(word);
    setRhymes(suggestions);
  };

  const handleLineChange = (sectionIdx: number, lineIdx: number, val: string) => {
    const updatedSections = [...project.sections];
    const updatedLines = [...updatedSections[sectionIdx].lines];
    updatedLines[lineIdx] = val;
    updatedSections[sectionIdx] = { ...updatedSections[sectionIdx], lines: updatedLines };
    setProject({ ...project, sections: updatedSections });
  };

  const handleAddLine = (sectionIdx: number) => {
    const updatedSections = [...project.sections];
    updatedSections[sectionIdx] = {
      ...updatedSections[sectionIdx],
      lines: [...updatedSections[sectionIdx].lines, ''],
    };
    setProject({ ...project, sections: updatedSections });
  };

  const handleAddSection = (type: SectionType) => {
    const labels: Record<SectionType, string> = {
      intro: 'Intro',
      verse: `Verso ${project.sections.filter((s) => s.type === 'verse').length + 1}`,
      'pre-chorus': 'Pré-Refrão',
      chorus: 'Refrão',
      bridge: 'Ponte',
      solo: 'Solo',
      outro: 'Outro',
    };

    const newSec: LyricSection = {
      id: `sec-${Date.now()}`,
      type,
      label: labels[type],
      lines: ['', ''],
    };

    setProject({ ...project, sections: [...project.sections, newSec] });
  };

  const handleExportText = () => {
    let full = `${project.title} - ${project.artist}\nTom: ${project.key} | BPM: ${project.bpm}\n\n`;
    project.sections.forEach((sec) => {
      full += `[${sec.label}]\n`;
      sec.lines.forEach((line) => {
        full += `${line}\n`;
      });
      full += '\n';
    });

    navigator.clipboard.writeText(full);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans select-none">
      {/* Header */}
      <header className="h-16 border-b border-zinc-800 bg-zinc-900/90 backdrop-blur px-6 flex items-center justify-between z-20 no-print">
        <div className="flex items-center gap-3">
          <span className="text-2xl">✍️</span>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-base tracking-tight text-white">Garden Lyrics</h1>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Songwriter Studio
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportText}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 transition"
          >
            <Copy className="w-3.5 h-3.5" /> {copyFeedback ? 'Copiado!' : 'Copiar Letra'}
          </button>
          <button
            onClick={() => window.print()}
            className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition"
            title="Imprimir / Salvar em PDF"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex-1 grid grid-cols-12 gap-6 p-6 max-w-7xl mx-auto w-full overflow-y-auto">
        {/* Left Column: Song Sections & Lines with Syllable Badges */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
          {/* Song Metadata Card */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <input
                type="text"
                value={project.title}
                onChange={(e) => setProject({ ...project, title: e.target.value })}
                className="text-2xl md:text-3xl font-black bg-transparent text-white border-b border-transparent hover:border-zinc-800 focus:border-emerald-500 focus:outline-none"
              />
              <input
                type="text"
                value={project.artist}
                onChange={(e) => setProject({ ...project, artist: e.target.value })}
                className="block text-sm text-zinc-400 font-medium bg-transparent border-b border-transparent hover:border-zinc-800 focus:border-emerald-500 focus:outline-none mt-1"
              />
            </div>

            <div className="flex items-center gap-3 font-mono text-xs">
              <div className="bg-zinc-950 border border-zinc-800 px-3 py-1.5 rounded-xl">
                <span className="text-zinc-500">TOM: </span>
                <input
                  type="text"
                  value={project.key}
                  onChange={(e) => setProject({ ...project, key: e.target.value })}
                  className="w-10 bg-transparent text-emerald-400 font-bold focus:outline-none"
                />
              </div>
              <div className="bg-zinc-950 border border-zinc-800 px-3 py-1.5 rounded-xl">
                <span className="text-zinc-500">BPM: </span>
                <input
                  type="number"
                  value={project.bpm}
                  onChange={(e) => setProject({ ...project, bpm: Number(e.target.value) })}
                  className="w-12 bg-transparent text-zinc-200 font-bold focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Sections List */}
          <div className="space-y-6">
            {project.sections.map((section, sIdx) => (
              <div
                key={section.id}
                className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 shadow-xl backdrop-blur relative group"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-zinc-800 text-emerald-400">
                    [{section.label}]
                  </span>
                  <button
                    onClick={() => {
                      const updated = project.sections.filter((_, i) => i !== sIdx);
                      setProject({ ...project, sections: updated });
                    }}
                    className="p-1 text-zinc-600 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition"
                    title="Remover seção"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Lines with Syllable Count */}
                <div className="space-y-2">
                  {section.lines.map((line, lIdx) => {
                    const syllables = countSyllables(line);

                    return (
                      <div key={lIdx} className="flex items-center gap-3">
                        <input
                          type="text"
                          value={line}
                          onChange={(e) => handleLineChange(sIdx, lIdx, e.target.value)}
                          onDoubleClick={() => {
                            const lastWord = line.trim().split(/\s+/).pop();
                            if (lastWord) handleRhymeSearch(lastWord);
                          }}
                          placeholder="Digite o verso aqui (duplo clique para buscar rima)..."
                          className="flex-1 px-3 py-2 rounded-xl bg-zinc-950/80 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500 font-medium"
                        />

                        {/* Syllable Counter Badge */}
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono text-xs font-bold shrink-0 border ${
                            syllables === 0
                              ? 'bg-zinc-950 text-zinc-600 border-zinc-800'
                              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          }`}
                          title={`${syllables} sílabas poéticas`}
                        >
                          {syllables}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={() => handleAddLine(sIdx)}
                  className="mt-3 text-xs text-zinc-500 hover:text-emerald-400 transition font-mono flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Adicionar Verso
                </button>
              </div>
            ))}
          </div>

          {/* Add Section Buttons */}
          <div className="flex flex-wrap items-center gap-2 p-4 bg-zinc-900/30 border border-zinc-800/60 rounded-2xl">
            <span className="text-xs text-zinc-500 font-mono mr-2">Adicionar Seção:</span>
            {(['verse', 'pre-chorus', 'chorus', 'bridge', 'solo', 'outro'] as SectionType[]).map(
              (type) => (
                <button
                  key={type}
                  onClick={() => handleAddSection(type)}
                  className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 text-xs font-medium text-zinc-300 hover:text-emerald-400 transition capitalize"
                >
                  + {type.replace('-', ' ')}
                </button>
              )
            )}
          </div>
        </div>

        {/* Right Column: Rhyme Finder & Voice Memos */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          {/* Rhyme Engine Card */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 shadow-2xl backdrop-blur flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-zinc-400 tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Dicionário de Rimas
              </span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={searchWord}
                onChange={(e) => setSearchWord(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleRhymeSearch(searchWord)}
                placeholder="Ex: coração, amar, dor..."
                className="flex-1 px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
              />
              <button
                onClick={() => handleRhymeSearch(searchWord)}
                className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>

            {rhymes.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto">
                {rhymes.map((word, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-mono text-emerald-400 font-semibold"
                  >
                    {word}
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-xs text-zinc-500 text-center py-4">
                Dê duplo clique em qualquer palavra da letra ou digite acima para buscar sugestões de rimas.
              </div>
            )}
          </div>

          {/* Voice Memo Recorder */}
          <VoiceMemoRecorder />
        </div>
      </main>
    </div>
  );
};

export default App;
