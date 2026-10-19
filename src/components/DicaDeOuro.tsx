import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Volume2,
  VolumeX,
  Shuffle,
  CheckCircle,
  Copy,
  ChevronLeft,
  ChevronRight,
  Calendar,
  BookOpen,
  Award,
  Lightbulb,
  Check
} from 'lucide-react';
import { DICAS_DE_OURO, DicaDeOuroItem } from '../data/dicasDeOuro';
import { soundManager } from '../utils/audio';
import { speechService } from '../utils/speech';

interface Props {
  onBonusPoints?: (points: number) => void;
}

export const DicaDeOuro: React.FC<Props> = ({ onBonusPoints }) => {
  // Compute day of year for the daily deterministic tip
  const getTodayIndex = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    return Math.abs(dayOfYear) % DICAS_DE_OURO.length;
  };

  const todayIndex = getTodayIndex();
  const [currentIndex, setCurrentIndex] = useState<number>(todayIndex);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [isNarrating, setIsNarrating] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Check if today's tip was already claimed
  const todayKey = `dica_ouro_${new Date().toISOString().slice(0, 10)}`;
  const [hasClaimedToday, setHasClaimedToday] = useState<boolean>(() => {
    try {
      return localStorage.getItem(todayKey) === 'true';
    } catch {
      return false;
    }
  });

  const currentDica: DicaDeOuroItem = DICAS_DE_OURO[currentIndex];
  const isViewingToday = currentIndex === todayIndex;

  // Formatted date string in Brazilian Portuguese
  const todayDateFormatted = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  // Capitalize first letter of date
  const capitalizedDate = todayDateFormatted.charAt(0).toUpperCase() + todayDateFormatted.slice(1);

  // Stop speech when component unmounts
  useEffect(() => {
    return () => {
      speechService.stop();
    };
  }, []);

  const handleNext = () => {
    soundManager.playClick();
    speechService.stop();
    setIsNarrating(false);
    setCurrentIndex(prev => (prev + 1) % DICAS_DE_OURO.length);
  };

  const handlePrev = () => {
    soundManager.playClick();
    speechService.stop();
    setIsNarrating(false);
    setCurrentIndex(prev => (prev - 1 + DICAS_DE_OURO.length) % DICAS_DE_OURO.length);
  };

  const handleRandom = () => {
    soundManager.playClick();
    speechService.stop();
    setIsNarrating(false);
    let nextIdx = Math.floor(Math.random() * DICAS_DE_OURO.length);
    if (nextIdx === currentIndex && DICAS_DE_OURO.length > 1) {
      nextIdx = (nextIdx + 1) % DICAS_DE_OURO.length;
    }
    setCurrentIndex(nextIdx);
  };

  const handleGoToToday = () => {
    soundManager.playClick();
    speechService.stop();
    setIsNarrating(false);
    setCurrentIndex(todayIndex);
  };

  const handleToggleNarration = () => {
    if (isNarrating) {
      speechService.stop();
      setIsNarrating(false);
    } else {
      soundManager.playClick();
      const textToRead = `Dica de Ouro: ${currentDica.title}. ${currentDica.curiosity}. Regra de Ouro: ${currentDica.goldenRule}. ${
        currentDica.funFact ? `Curiosidade: ${currentDica.funFact}` : ''
      }`;
      speechService.speak(textToRead, () => setIsNarrating(false));
      setIsNarrating(true);
    }
  };

  const handleCopy = async () => {
    soundManager.playClick();
    const textToCopy = `✨ DICA DE OURO: ${currentDica.title} ✨\n\n${currentDica.curiosity}\n\n💡 REGRA DE OURO:\n${currentDica.goldenRule}\n\nExemplos:\n${currentDica.examples.correct.map(e => `• ${e}`).join('\n')}\n\n📚 Habilidade: ${currentDica.skillCode}`;
    
    try {
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2200);
    } catch {
      // Fallback
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2200);
    }
  };

  const handleClaimReward = () => {
    if (hasClaimedToday) return;
    soundManager.playCorrect();
    setHasClaimedToday(true);
    try {
      localStorage.setItem(todayKey, 'true');
    } catch {
      // ignore
    }
    if (onBonusPoints) {
      onBonusPoints(30);
    }
  };

  // Categories list for exploration
  const categories = ['Todas', 'Ortografia', 'Acentuação', 'Gramática', 'Curiosidade', 'Pontuação'];

  const filteredDicas = selectedCategory === 'Todas'
    ? DICAS_DE_OURO
    : DICAS_DE_OURO.filter(d => d.category === selectedCategory);

  const handleSelectCategory = (cat: string) => {
    soundManager.playClick();
    setSelectedCategory(cat);
    if (cat !== 'Todas') {
      const firstMatchingIdx = DICAS_DE_OURO.findIndex(d => d.category === cat);
      if (firstMatchingIdx !== -1) {
        setCurrentIndex(firstMatchingIdx);
      }
    }
  };

  return (
    <section
      aria-label="Dica de Ouro"
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500/10 via-amber-400/5 to-indigo-600/10 border-2 border-amber-300/80 shadow-md p-6 sm:p-8 space-y-6"
    >
      {/* Decorative Golden Glow */}
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Bar */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-amber-200">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 flex items-center justify-center shadow-sm shrink-0 border border-amber-200">
            <span className="text-2xl drop-shadow-xs" role="img" aria-label="Ouro">🪙</span>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-amber-500 text-slate-950 shadow-xs">
                <Sparkles className="w-3 h-3 text-slate-950" />
                Dica de Ouro do Dia
              </span>

              {isViewingToday ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200">
                  <Calendar className="w-3 h-3 text-emerald-700" />
                  Hoje
                </span>
              ) : (
                <button
                  onClick={handleGoToToday}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 px-2 py-0.5 rounded-md border border-amber-300 cursor-pointer transition-colors"
                >
                  <Calendar className="w-3 h-3 text-amber-700" />
                  Voltar para Hoje
                </button>
              )}

              <span className="text-[11px] font-medium text-slate-500 hidden sm:inline">
                {capitalizedDate}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display mt-0.5">
              Tesouro da Língua Portuguesa
            </h2>
          </div>
        </div>

        {/* Audio and Controls Toolbar */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          {/* TTS Audio Narration Button */}
          <button
            onClick={handleToggleNarration}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer border shadow-xs ${
              isNarrating
                ? 'bg-amber-500 text-slate-950 border-amber-600 animate-pulse'
                : 'bg-white hover:bg-amber-50 text-slate-800 border-amber-200 hover:border-amber-300'
            }`}
            title="Ouvir a dica com voz narrada"
          >
            {isNarrating ? (
              <>
                <VolumeX className="w-4 h-4 text-slate-950" />
                <span>Pausar Voz</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-amber-600" />
                <span>Ouvir Dica de Ouro</span>
              </>
            )}
          </button>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-amber-50 text-slate-700 border border-amber-200 hover:border-amber-300 transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
            title="Copiar dica para compartilhar"
          >
            {isCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-bold">Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copiar</span>
              </>
            )}
          </button>

          {/* Random tip shuffle button */}
          <button
            onClick={handleRandom}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-amber-50 text-slate-700 border border-amber-200 hover:border-amber-300 transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
            title="Sortear outra curiosidade"
          >
            <Shuffle className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Sortear</span>
          </button>

          {/* Prev / Next Arrows */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-amber-200 shadow-xs">
            <button
              onClick={handlePrev}
              className="p-1.5 hover:bg-amber-100 rounded-lg text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
              aria-label="Dica anterior"
              title="Dica anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono font-bold text-amber-900 px-1.5 min-w-[58px] text-center">
              {currentIndex + 1} / {DICAS_DE_OURO.length}
            </span>
            <button
              onClick={handleNext}
              className="p-1.5 hover:bg-amber-100 rounded-lg text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
              aria-label="Próxima dica"
              title="Próxima dica"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 font-medium text-[11px] uppercase tracking-wider font-mono mr-1 shrink-0">
          Explorar:
        </span>
        {categories.map(cat => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => handleSelectCategory(cat)}
              className={`px-3 py-1 rounded-lg font-semibold transition-all shrink-0 cursor-pointer text-xs ${
                isActive
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white/80 hover:bg-white text-slate-600 border border-amber-200/70 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Main Animated Tip Display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentDica.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-5"
        >
          {/* Card Meta & Title */}
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white border-2 border-amber-200 flex items-center justify-center text-3xl shadow-xs shrink-0">
              {currentDica.icon}
            </div>

            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
                  {currentDica.category}
                </span>
                <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-indigo-100 text-indigo-900 border border-indigo-200 font-mono">
                  {currentDica.skillCode}
                </span>
                <span className="text-xs font-semibold text-amber-800">
                  ★ {currentDica.badgeLabel}
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-display leading-tight">
                {currentDica.title}
              </h3>

              <p className="text-sm sm:text-base text-slate-700 leading-relaxed pt-1">
                {currentDica.curiosity}
              </p>
            </div>
          </div>

          {/* Golden Rule Callout Box */}
          <div className="bg-gradient-to-r from-amber-400/20 via-amber-300/30 to-amber-400/20 rounded-2xl border-2 border-amber-400/80 p-4 sm:p-5 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-950 uppercase tracking-wider font-mono">
              <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Regra de Ouro</span>
            </div>
            <p className="text-sm sm:text-base font-extrabold text-amber-950 leading-relaxed">
              "{currentDica.goldenRule}"
            </p>
          </div>

          {/* Practical Examples Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm">
            {/* Correct Examples */}
            <div className="bg-white rounded-xl border border-emerald-200 p-3.5 space-y-1.5 shadow-2xs">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Como usar na prática:</span>
              </div>
              <ul className="space-y-1 text-slate-700">
                {currentDica.examples.correct.map((ex, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>{ex}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tip or Caution */}
            <div className="bg-white rounded-xl border border-amber-200 p-3.5 space-y-1.5 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                  <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                  <span>Dica de Mestre:</span>
                </div>
                {currentDica.examples.tip && (
                  <p className="text-slate-700 text-xs sm:text-sm leading-relaxed mt-1">
                    {currentDica.examples.tip}
                  </p>
                )}
                {currentDica.examples.incorrect && (
                  <div className="mt-1.5 text-rose-700 font-medium text-xs">
                    {currentDica.examples.incorrect.join(' ')}
                  </div>
                )}
              </div>

              {currentDica.funFact && (
                <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500 italic">
                  💡 <strong>Você sabia?</strong> {currentDica.funFact}
                </div>
              )}
            </div>
          </div>

          {/* Bottom Action Footer with Gamified Bonus Points */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs border-t border-amber-200/60">
            <div className="flex items-center gap-2 text-amber-900 font-medium">
              <Award className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                Estude uma dica de ouro por dia para enriquecer sua pontuação e vocabulário!
              </span>
            </div>

            <motion.button
              whileHover={{ scale: hasClaimedToday ? 1 : 1.02 }}
              whileTap={{ scale: hasClaimedToday ? 1 : 0.98 }}
              onClick={handleClaimReward}
              disabled={hasClaimedToday}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs ${
                hasClaimedToday
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-default'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-display'
              }`}
            >
              {hasClaimedToday ? (
                <>
                  <CheckCircle className="w-4 h-4 text-emerald-700" />
                  <span>Dica de Ouro Conquistada Hoje!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Guardei no Baú de Ouro (+30 pts)</span>
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
};
