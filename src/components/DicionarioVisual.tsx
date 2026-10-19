import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Search,
  Volume2,
  VolumeX,
  Sparkles,
  ArrowLeft,
  Bookmark,
  CheckCircle2,
  Copy,
  Layers,
  HelpCircle,
  X,
  ExternalLink,
  Award,
  Zap,
  Info,
} from 'lucide-react';
import {
  TERMOS_DICIONARIO,
  CATEGORIAS_DICIONARIO,
  TermoDicionario,
  CategoriaTermo,
} from '../data/dicionarioVisualData';
import { soundManager } from '../utils/audio';
import { speechService } from '../utils/speech';

interface DicionarioVisualProps {
  onNavigate: (view: string) => void;
  onBonusPoints?: (points: number) => void;
  studentName?: string;
}

const FAVORITES_STORAGE_KEY = 'aventura_dicionario_favoritos_v1';

export const DicionarioVisual: React.FC<DicionarioVisualProps> = ({
  onNavigate,
  onBonusPoints,
  studentName,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoriaTermo | 'Todas'>('Todas');
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [selectedTerm, setSelectedTerm] = useState<TermoDicionario | null>(null);
  const [speakingWordId, setSpeakingWordId] = useState<string | null>(null);
  const [copiedWordId, setCopiedWordId] = useState<string | null>(null);
  const [quizAnswered, setQuizAnswered] = useState<Record<string, boolean>>({});

  // Favorites state persisted in localStorage
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleFavorite = (termId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    soundManager.playClick();
    setFavorites(prev => {
      const next = prev.includes(termId) ? prev.filter(id => id !== termId) : [...prev, termId];
      try {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Ignore
      }
      return next;
    });
  };

  // Available unique initial letters from dictionary
  const availableLetters = useMemo(() => {
    const letters = new Set<string>();
    TERMOS_DICIONARIO.forEach(t => {
      const initial = t.word.normalize('NFD').replace(/[\u0300-\u036f]/g, '')[0].toUpperCase();
      letters.add(initial);
    });
    return Array.from(letters).sort();
  }, []);

  // Filtered terms
  const filteredTerms = useMemo(() => {
    return TERMOS_DICIONARIO.filter(term => {
      // Category filter
      if (selectedCategory !== 'Todas' && term.category !== selectedCategory) {
        return false;
      }

      // Letter filter
      if (selectedLetter) {
        const initial = term.word.normalize('NFD').replace(/[\u0300-\u036f]/g, '')[0].toUpperCase();
        if (initial !== selectedLetter) return false;
      }

      // Search term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase().trim();
        const wordMatch = term.word.toLowerCase().includes(query);
        const defMatch = term.definition.toLowerCase().includes(query);
        const ruleMatch = term.spellingRule.toLowerCase().includes(query);
        const gameMatch = term.gameContext.toLowerCase().includes(query);
        const tagMatch = term.synonymsOrRelated?.some(s => s.toLowerCase().includes(query));
        return wordMatch || defMatch || ruleMatch || gameMatch || tagMatch;
      }

      return true;
    });
  }, [selectedCategory, selectedLetter, searchTerm]);

  // Speech helper
  const handleSpeak = (term: TermoDicionario, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    soundManager.playClick();

    if (speakingWordId === term.id) {
      speechService.stop();
      setSpeakingWordId(null);
      return;
    }

    setSpeakingWordId(term.id);
    const textToRead = `${term.word}. ${term.classification}. Definição: ${term.definition}. Dica de ortografia: ${term.spellingRule}`;
    speechService.speak(textToRead, () => {
      setSpeakingWordId(null);
    });
  };

  const handleCopyWord = (term: TermoDicionario, e: React.MouseEvent) => {
    e.stopPropagation();
    soundManager.playClick();
    navigator.clipboard?.writeText(
      `${term.word} (${term.pronunciation}) - ${term.definition}\nDica de Ortografia: ${term.spellingRule}`
    );
    setCopiedWordId(term.id);
    setTimeout(() => {
      setCopiedWordId(null);
    }, 2000);
  };

  const handleMiniQuiz = (termId: string, optionChosen: string, correctOption: string) => {
    if (quizAnswered[termId]) return;

    if (optionChosen === correctOption) {
      soundManager.playCorrect();
      setQuizAnswered(prev => ({ ...prev, [termId]: true }));
      if (onBonusPoints) {
        onBonusPoints(15);
      }
    } else {
      soundManager.playWrong();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner Navigation & Title */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-indigo-700/50">
        <div className="absolute -right-8 -bottom-10 opacity-10 pointer-events-none select-none text-9xl">
          📖
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <button
              onClick={() => {
                soundManager.playClick();
                onNavigate('hub');
              }}
              className="inline-flex items-center gap-2 text-xs font-bold text-indigo-200 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors cursor-pointer backdrop-blur-xs border border-white/10"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Voltar às Missões</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-amber-400 text-amber-950 uppercase tracking-wide">
                Glossário Ilustrado BNCC
              </span>
              <span className="text-xs text-indigo-200">
                {TERMOS_DICIONARIO.length} termos de alta complexidade
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold font-display tracking-tight text-white flex items-center gap-3">
              <span>Dicionário Visual das Palavras</span>
              <span className="text-2xl sm:text-3xl">✨</span>
            </h1>

            <p className="text-xs sm:text-sm text-indigo-100 max-w-2xl leading-relaxed">
              Consulte termos desafiadores encontrados nas histórias, crônicas e jogos do aplicativo.
              Descubra a separação silábica, sílaba tônica, significados ilustrados e dicas de ouro para não errar a ortografia!
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex md:flex-col gap-3 shrink-0">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 text-center min-w-[130px]">
              <span className="block text-2xl font-black font-display text-amber-300">
                {TERMOS_DICIONARIO.length}
              </span>
              <span className="text-[11px] font-medium text-indigo-100 uppercase tracking-wider">
                Termos Ilustrados
              </span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 text-center min-w-[130px]">
              <span className="block text-2xl font-black font-display text-emerald-300">
                {favorites.length}
              </span>
              <span className="text-[11px] font-medium text-indigo-100 uppercase tracking-wider">
                Favoritos Salvos
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Pesquisar por palavra, definição, regra ortográfica ou contexto do jogo..."
            className="w-full pl-11 pr-10 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm text-slate-800 placeholder-slate-400 transition-all bg-slate-50/50"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIAS_DICIONARIO.map(cat => {
            const isSelected = selectedCategory === cat.id;
            const count =
              cat.id === 'Todas'
                ? TERMOS_DICIONARIO.length
                : TERMOS_DICIONARIO.filter(t => t.category === cat.id).length;

            return (
              <button
                key={cat.id}
                onClick={() => {
                  soundManager.playClick();
                  setSelectedCategory(cat.id);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 border-slate-200 hover:text-slate-900'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                    isSelected ? 'bg-indigo-700 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Alphabetical Quick Bar */}
        <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
            Letra:
          </span>
          <button
            onClick={() => {
              soundManager.playClick();
              setSelectedLetter(null);
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
              selectedLetter === null
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Todas
          </button>
          {availableLetters.map(letter => {
            const isSelected = selectedLetter === letter;
            return (
              <button
                key={letter}
                onClick={() => {
                  soundManager.playClick();
                  setSelectedLetter(isSelected ? null : letter);
                }}
                className={`w-7 h-7 rounded-lg text-xs font-bold font-mono flex items-center justify-center cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {letter}
              </button>
            );
          })}
        </div>
      </div>

      {/* Terms Count & Feedback Status */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Exibindo <strong>{filteredTerms.length}</strong> de {TERMOS_DICIONARIO.length} termos
          {selectedCategory !== 'Todas' && ` na categoria "${selectedCategory}"`}
          {selectedLetter && ` com a letra "${selectedLetter}"`}
        </span>
        {searchTerm && (
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('Todas');
              setSelectedLetter(null);
            }}
            className="text-indigo-600 hover:underline font-semibold cursor-pointer"
          >
            Limpar filtros
          </button>
        )}
      </div>

      {/* Cards Grid */}
      {filteredTerms.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <div className="text-5xl">🔍</div>
          <h3 className="text-lg font-bold text-slate-800 font-display">
            Nenhum termo encontrado
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Não encontramos nenhum resultado para &quot;{searchTerm}&quot;. Tente buscar por outra palavra,
            ou limpar os filtros acima para ver todos os termos.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('Todas');
              setSelectedLetter(null);
            }}
            className="mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Ver todos os termos
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTerms.map((term, index) => {
            const isSpeaking = speakingWordId === term.id;
            const isFavorite = favorites.includes(term.id);
            const isCopied = copiedWordId === term.id;

            return (
              <motion.div
                key={term.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.04, 0.4) }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                onClick={() => {
                  soundManager.playClick();
                  setSelectedTerm(term);
                }}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4 cursor-pointer group relative overflow-hidden"
              >
                {/* Top Strip with Badge and Actions */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    {/* Thematic Illustrated Icon */}
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${term.color.cardBg} border ${term.color.border} flex items-center justify-center text-2xl shadow-xs shrink-0 group-hover:scale-105 transition-transform`}
                    >
                      {term.icon}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-slate-900 font-display group-hover:text-indigo-600 transition-colors">
                          {term.word}
                        </h3>
                        {/* Accent Classification Tag */}
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                          {term.accentClassification}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {term.classification}
                      </span>
                    </div>
                  </div>

                  {/* Actions: Speak & Favorite */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={e => handleSpeak(term, e)}
                      title="Ouvir pronúncia e definição"
                      className={`p-2 rounded-xl transition-colors cursor-pointer ${
                        isSpeaking
                          ? 'bg-amber-100 text-amber-700 animate-pulse'
                          : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'
                      }`}
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={e => toggleFavorite(term.id, e)}
                      title={isFavorite ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
                      className={`p-2 rounded-xl transition-colors cursor-pointer ${
                        isFavorite
                          ? 'bg-amber-50 text-amber-500'
                          : 'text-slate-300 hover:text-amber-500 hover:bg-amber-50/50'
                      }`}
                    >
                      <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-amber-400' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Syllable Breakdown with Highlighted Tonic Syllable */}
                <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-1">
                      Sílabas:
                    </span>
                    {term.syllables.map((syl, i) => {
                      const isTonic = i === term.tonicIndex;
                      return (
                        <span
                          key={i}
                          className={`px-2 py-0.5 rounded-md text-xs font-mono font-bold transition-transform ${
                            isTonic
                              ? 'bg-indigo-600 text-white shadow-xs scale-105'
                              : 'bg-white text-slate-700 border border-slate-200'
                          }`}
                          title={isTonic ? 'Sílaba Tônica (mais forte)' : 'Sílaba Átona'}
                        >
                          {syl}
                          {isTonic && (
                            <span className="ml-1 text-[9px] opacity-80" title="Tônica">
                              ★
                            </span>
                          )}
                        </span>
                      );
                    })}
                  </div>

                  <span className="text-[10px] text-slate-400 font-mono shrink-0">
                    {term.syllables.length} sílabas
                  </span>
                </div>

                {/* Definition */}
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {term.definition}
                </p>

                {/* Golden Spelling Tip Callout */}
                <div className="bg-amber-50/70 rounded-xl p-3 border border-amber-200/80 space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-900">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>Dica de Ortografia de Ouro:</span>
                  </div>
                  <p className="text-[11px] text-amber-800 line-clamp-2 leading-normal">
                    {term.spellingRule}
                  </p>
                </div>

                {/* Footer with Game Context & Button */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                  <span className="text-[10px] text-slate-400 truncate max-w-[190px]">
                    🎮 {term.gameContext.split('(')[0]}
                  </span>

                  <button
                    onClick={e => {
                      e.stopPropagation();
                      soundManager.playClick();
                      setSelectedTerm(term);
                    }}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <span>Explorar Detalhes</span>
                    <span className="text-sm">→</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Enriched Detail Modal */}
      <AnimatePresence>
        {selectedTerm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${selectedTerm.color.cardBg} border ${selectedTerm.color.border} flex items-center justify-center text-4xl shadow-md shrink-0`}
                  >
                    {selectedTerm.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
                        {selectedTerm.word}
                      </h2>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
                        {selectedTerm.accentClassification}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      {selectedTerm.classification} · Categoria: {selectedTerm.category}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    soundManager.playClick();
                    setSelectedTerm(null);
                  }}
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Pronunciation & Interactive Syllable Station */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-indigo-600" />
                    <span>Divisão Silábica & Força Vocal</span>
                  </span>

                  <button
                    onClick={() => handleSpeak(selectedTerm)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{speakingWordId === selectedTerm.id ? 'Ouvindo...' : 'Ouvir Palavra'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {selectedTerm.syllables.map((syl, i) => {
                    const isTonic = i === selectedTerm.tonicIndex;
                    return (
                      <div
                        key={i}
                        onClick={() => {
                          soundManager.playClick();
                          speechService.speak(syl);
                        }}
                        className={`px-4 py-2.5 rounded-xl text-sm font-mono font-bold cursor-pointer transition-transform hover:scale-105 flex flex-col items-center ${
                          isTonic
                            ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-300'
                            : 'bg-white text-slate-800 border border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        <span>{syl}</span>
                        <span className="text-[9px] font-normal opacity-85 mt-0.5">
                          {isTonic ? 'Tônica (Forte)' : 'Átona'}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <p className="text-[11px] text-slate-500 italic">
                  💡 Clique em qualquer sílaba para ouvi-la individualmente! A sílaba em azul é a tônica.
                </p>
              </div>

              {/* Meaning / Definition */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-slate-500" />
                  <span>Significado Pedagógico</span>
                </h4>
                <p className="text-sm text-slate-800 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  {selectedTerm.definition}
                </p>
              </div>

              {/* Example in Context */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                  <span>Exemplo em Frase</span>
                </h4>
                <div className="p-3.5 rounded-xl bg-indigo-50/50 border border-indigo-100 text-xs sm:text-sm text-indigo-950 italic">
                  &ldquo;{selectedTerm.exampleSentence}&rdquo;
                </div>
              </div>

              {/* Golden Spelling Rule */}
              <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 space-y-2">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wide">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Regra & Dica de Ortografia de Ouro</span>
                </div>
                <p className="text-xs sm:text-sm text-amber-900 leading-relaxed font-medium">
                  {selectedTerm.spellingRule}
                </p>
              </div>

              {/* Fun Fact / Etymology */}
              {selectedTerm.etymologyOrFunFact && (
                <div className="bg-purple-50 rounded-2xl p-4 border border-purple-200 space-y-1">
                  <span className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                    <span>💡</span>
                    <span>Curiosidade & Origem da Palavra</span>
                  </span>
                  <p className="text-xs text-purple-800 leading-relaxed">
                    {selectedTerm.etymologyOrFunFact}
                  </p>
                </div>
              )}

              {/* Game Context */}
              <div className="bg-slate-100 rounded-xl p-3 text-xs text-slate-600 flex items-center justify-between gap-2">
                <div>
                  <span className="font-semibold text-slate-800 block">Onde aparece nos jogos:</span>
                  <span>{selectedTerm.gameContext}</span>
                </div>
                <button
                  onClick={() => {
                    soundManager.playClick();
                    setSelectedTerm(null);
                    onNavigate('hub');
                  }}
                  className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 rounded-lg text-slate-800 font-bold text-[11px] whitespace-nowrap cursor-pointer transition-colors"
                >
                  Ir para os Jogos
                </button>
              </div>

              {/* Mini Quiz Challenge */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-4 border border-emerald-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-emerald-950 uppercase tracking-wide">
                      Desafio Rápido de Ortografia
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    +15 XP
                  </span>
                </div>

                <p className="text-xs text-emerald-900 font-medium">
                  Quanto à acentuação e posição da sílaba tônica, a palavra <strong>{selectedTerm.word}</strong> é:
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {['Oxítona', 'Paroxítona', 'Proparoxítona'].map(option => {
                    const isCorrect =
                      (selectedTerm.accentClassification === 'Hiato Tônico' && option === 'Paroxítona') ||
                      selectedTerm.accentClassification === option;
                    const isDone = quizAnswered[selectedTerm.id];

                    return (
                      <button
                        key={option}
                        disabled={isDone}
                        onClick={() =>
                          handleMiniQuiz(
                            selectedTerm.id,
                            option,
                            selectedTerm.accentClassification === 'Hiato Tônico' ? 'Paroxítona' : selectedTerm.accentClassification
                          )
                        }
                        className={`p-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          isDone && isCorrect
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                            : isDone
                            ? 'bg-slate-100 text-slate-400 border-slate-200 opacity-60'
                            : 'bg-white hover:bg-emerald-100 text-emerald-950 border-emerald-300'
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>

                {quizAnswered[selectedTerm.id] && (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Excelente acerto! Você ganhou +15 XP de bônus!</span>
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  onClick={e => handleCopyWord(selectedTerm, e)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>{copiedWordId === selectedTerm.id ? 'Copiado!' : 'Copiar Termo'}</span>
                </button>

                <button
                  onClick={() => {
                    soundManager.playClick();
                    setSelectedTerm(null);
                  }}
                  className="px-6 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Fechar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
