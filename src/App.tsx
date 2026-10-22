import React, { useState } from 'react';
import { LyricProject, LyricSection, SectionType } from './types';
import {
  INITIAL_LYRIC_PROJECT,
  countSyllables,
  findRhymeSuggestions,
  findThesaurusSuggestions,
  formatLyricsForTeleprompt,
} from './core/lyric-engine';
import { VoiceMemoRecorder } from './components/VoiceMemoRecorder';
import {
  Plus,
  Trash2,
  Search,
  Sparkles,
  Printer,
  Copy,
  BookOpen,
  Send,
  Check,
} from 'lucide-react';

export const App: React.FC = () => {
  const [project, setProject] = useState<LyricProject>(INITIAL_LYRIC_PROJECT);
  const [searchWord, setSearchWord] = useState('');
  const [rhymes, setRhymes] = useState<string[]>([]);
  const [thesaurusWord, setThesaurusWord] = useState('');
  const [thesaurusResult, setThesaurusResult] = useState<ReturnType<typeof findThesaurusSuggestions>>(null);
  const [rightTab, setRightTab] = useState<'rhymes' | 'thesaurus'>('rhymes');
  const [telepromptModalOpen, setTelepromptModalOpen] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [telepromptCopied, setTelepromptCopied] = useState(false);

  const handleRhymeSearch = (word: string) => {
    setSearchWord(word);
    const suggestions = findRhymeSuggestions(word);
    setRhymes(suggestions);
  };

  const handleThesaurusSearch = (word: string) => {
    setThesaurusWord(word);
    const result = findThesaurusSuggestions(word);
    setThesaurusResult(result);
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
            onClick={() => setTelepromptModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition shadow-lg shadow-emerald-600/30"
            title="Exportar formato compatível com Garden Teleprompt"
          >
            <Send className="w-3.5 h-3.5" /> Exportar p/ Teleprompt
          </button>
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
          {/* Rhyme & Poetic Thesaurus Card */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 shadow-2xl backdrop-blur flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setRightTab('rhymes')}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold transition ${
                    rightTab === 'rhymes'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-zinc-950 text-zinc-400 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Rimas
                  </span>
                </button>
                <button
                  onClick={() => setRightTab('thesaurus')}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold transition ${
                    rightTab === 'thesaurus'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-zinc-950 text-zinc-400 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" /> Poesia & Metáforas
                  </span>
                </button>
              </div>
            </div>

            {rightTab === 'rhymes' ? (
              <>
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
                        className="px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-mono text-emerald-400 font-semibold cursor-pointer hover:border-emerald-500"
                        title="Clique para pesquisar no dicionário poético"
                        onClick={() => {
                          setThesaurusWord(word);
                          handleThesaurusSearch(word);
                          setRightTab('thesaurus');
                        }}
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
              </>
            ) : (
              <>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={thesaurusWord}
                    onChange={(e) => setThesaurusWord(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleThesaurusSearch(thesaurusWord)}
                    placeholder="Ex: amor, tristeza, tempo, solidão..."
                    className="flex-1 px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    onClick={() => handleThesaurusSearch(thesaurusWord)}
                    className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                </div>

                {/* Quick mood pills */}
                <div className="flex flex-wrap gap-1">
                  {['amor', 'tristeza', 'esperança', 'tempo', 'solidão', 'liberdade'].map((mood) => (
                    <button
                      key={mood}
                      onClick={() => handleThesaurusSearch(mood)}
                      className="px-2 py-0.5 rounded-lg bg-zinc-950 border border-zinc-800 text-[10px] font-mono text-zinc-400 hover:text-emerald-400 capitalize transition"
                    >
                      {mood}
                    </button>
                  ))}
                </div>

                {thesaurusResult ? (
                  <div className="flex flex-col gap-3 max-h-56 overflow-y-auto">
                    <div>
                      <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
                        Sinônimos Poéticos:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {thesaurusResult.synonyms.map((syn, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-mono text-emerald-400 font-semibold"
                          >
                            {syn}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
                        Metáforas & Imagens Evocativas:
                      </span>
                      <ul className="space-y-1 text-xs text-zinc-300 italic">
                        {thesaurusResult.metaphors.map((meta, idx) => (
                          <li key={idx} className="bg-zinc-950/80 p-1.5 rounded-lg border border-zinc-800/80">
                            "{meta}"
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-zinc-500 text-center py-4">
                    Busque um tema (ou clique nas pílulas acima) para descobrir metáforas poéticas para a sua letra.
                  </div>
                )}
              </>
            )}
          </div>

          {/* Voice Memo Recorder */}
          <VoiceMemoRecorder />
        </div>
      </main>

      {/* Teleprompt Export Modal */}
      {telepromptModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl flex flex-col gap-4 max-h-[85vh]">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-base text-white">Exportar para Garden Teleprompt</h3>
              </div>
              <button
                onClick={() => setTelepromptModalOpen(false)}
                className="text-zinc-500 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-zinc-400">
              Formato com tags de palco (<code className="text-emerald-400 font-mono">[Verso]</code>, <code className="text-emerald-400 font-mono">[Refrão]</code>) estruturado para o teleprompter:
            </p>

            <textarea
              readOnly
              value={formatLyricsForTeleprompt(project)}
              className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl font-mono text-xs text-emerald-400 flex-1 min-h-60 resize-none focus:outline-none leading-relaxed"
            />

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setTelepromptModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold"
              >
                Fechar
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(formatLyricsForTeleprompt(project));
                  setTelepromptCopied(true);
                  setTimeout(() => setTelepromptCopied(false), 2000);
                }}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-lg shadow-emerald-600/30"
              >
                {telepromptCopied ? (
                  <>
                    <Check className="w-4 h-4" /> Copiado para Área de Transferência!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" /> Copiar para o Teleprompt
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
