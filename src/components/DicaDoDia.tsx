import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lightbulb,
  Sparkles,
  Shuffle,
  Volume2,
  VolumeX,
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Trophy,
  Zap,
} from 'lucide-react';
import { TEMAS_GRAMATICAIS_BNCC, TemaGramaticalBNCC } from '../data/dicasGramaticaisBNCC';
import { soundManager } from '../utils/audio';
import { speechService } from '../utils/speech';

interface Props {
  onSelectMission: (missionId: string) => void;
  onBonusPoints?: (points: number) => void;
}

export const DicaDoDia: React.FC<Props> = ({ onSelectMission, onBonusPoints }) => {
  // Deterministic daily index based on day of the year
  const getTodayIndex = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    return Math.abs(dayOfYear) % TEMAS_GRAMATICAIS_BNCC.length;
  };

  const todayIndex = getTodayIndex();
  const [currentIndex, setCurrentIndex] = useState<number>(todayIndex);
  const [isNarrating, setIsNarrating] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Daily claimed state in localStorage
  const dailyKey = `dica_dia_bncc_${new Date().toISOString().slice(0, 10)}`;
  const [hasClaimedToday, setHasClaimedToday] = useState<boolean>(() => {
    try {
      return localStorage.getItem(dailyKey) === 'true';
    } catch {
      return false;
    }
  });

  const currentTema: TemaGramaticalBNCC = TEMAS_GRAMATICAIS_BNCC[currentIndex];
  const isToday = currentIndex === todayIndex;

  // Portuguese formatted date
  const dateFormatted = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
  const capitalizedDate = dateFormatted.charAt(0).toUpperCase() + dateFormatted.slice(1);

  // Stop narration on unmount
  useEffect(() => {
    return () => {
      speechService.stop();
    };
  }, []);

  const handleRandomize = () => {
    soundManager.playClick();
    speechService.stop();
    setIsNarrating(false);
    let nextIdx = Math.floor(Math.random() * TEMAS_GRAMATICAIS_BNCC.length);
    if (nextIdx === currentIndex && TEMAS_GRAMATICAIS_BNCC.length > 1) {
      nextIdx = (nextIdx + 1) % TEMAS_GRAMATICAIS_BNCC.length;
    }
    setCurrentIndex(nextIdx);
  };

  const handleNext = () => {
    soundManager.playClick();
    speechService.stop();
    setIsNarrating(false);
    setCurrentIndex(prev => (prev + 1) % TEMAS_GRAMATICAIS_BNCC.length);
  };

  const handlePrev = () => {
    soundManager.playClick();
    speechService.stop();
    setIsNarrating(false);
    setCurrentIndex(prev => (prev - 1 + TEMAS_GRAMATICAIS_BNCC.length) % TEMAS_GRAMATICAIS_BNCC.length);
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
      const textToRead = `Dica do Dia BNCC: ${currentTema.title}. Tema Gramatical: ${currentTema.grammarTopic}. Dica de Preparação: ${currentTema.preparationTip}. Regra de Ouro: ${currentTema.goldenRule}. ${currentTema.gameApplication}`;
      speechService.speak(textToRead, () => setIsNarrating(false));
      setIsNarrating(true);
    }
  };

  const handleCopy = async () => {
    soundManager.playClick();
    const textToCopy = `💡 DICA DO DIA BNCC: ${currentTema.title}\n\n📌 Tema: ${currentTema.grammarTopic} (${currentTema.skillCode})\n\n🎯 Preparação para o Jogo:\n${currentTema.preparationTip}\n\n⭐ Regra de Ouro:\n"${currentTema.goldenRule}"\n\n📝 Exemplo: ${currentTema.practicalExample.phrase}\n🔍 Análise: ${currentTema.practicalExample.analysis}`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleClaimReward = () => {
    if (hasClaimedToday) return;
    soundManager.playCorrect();
    setHasClaimedToday(true);
    try {
      localStorage.setItem(dailyKey, 'true');
    } catch {
      // ignore
    }
    if (onBonusPoints) {
      onBonusPoints(25);
    }
  };

  return (
    <section
      aria-label="Dica do Dia BNCC"
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white p-6 sm:p-8 border-2 border-indigo-500/30 shadow-xl space-y-6"
    >
      {/* Background Decorative Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-indigo-800/60">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center text-2xl shadow-md shrink-0 border border-amber-300">
            <Lightbulb className="w-6 h-6 text-slate-950 fill-amber-300" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase bg-amber-400 text-slate-950 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                Dica do Dia da BNCC
              </span>

              {isToday ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                  <Calendar className="w-3 h-3 text-emerald-400" />
                  Hoje
                </span>
              ) : (
                <button
                  onClick={handleGoToToday}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-300 bg-amber-950/80 hover:bg-amber-900 px-2.5 py-0.5 rounded-full border border-amber-500/40 transition-colors cursor-pointer"
                >
                  <Calendar className="w-3 h-3 text-amber-400" />
                  Voltar à Dica de Hoje
                </button>
              )}

              <span className="text-xs text-indigo-200 hidden sm:inline font-medium">
                {capitalizedDate}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-white font-display mt-1">
              Prepare-se para os Desafios Gramaticais
            </h2>
          </div>
        </div>

        {/* Toolbar: Narration, Shuffle, Copy, Prev/Next */}
        <div className="flex flex-wrap items-center gap-2">
          {/* TTS Audio */}
          <button
            onClick={handleToggleNarration}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border shadow-xs ${
              isNarrating
                ? 'bg-amber-400 text-slate-950 border-amber-300 animate-pulse'
                : 'bg-indigo-900/60 hover:bg-indigo-800 text-indigo-100 border-indigo-700/60'
            }`}
            title="Ouvir explicação em áudio"
          >
            {isNarrating ? (
              <>
                <VolumeX className="w-4 h-4 text-slate-950" />
                <span>Pausar</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-amber-400" />
                <span>Ouvir</span>
              </>
            )}
          </button>

          {/* Random Theme Button */}
          <button
            onClick={handleRandomize}
            className="px-3 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
            title="Sortear outro tema gramatical aleatório"
          >
            <Shuffle className="w-3.5 h-3.5 text-slate-950" />
            <span>Sortear Tema Aleatório</span>
          </button>

          {/* Copy */}
          <button
            onClick={handleCopy}
            className="p-2 rounded-xl text-xs font-semibold bg-indigo-900/60 hover:bg-indigo-800 text-indigo-200 border border-indigo-700/60 transition-colors cursor-pointer"
            title="Copiar dica"
          >
            {isCopied ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <Copy className="w-4 h-4 text-indigo-300" />
            )}
          </button>

          {/* Prev/Next arrows */}
          <div className="flex items-center gap-1 bg-indigo-950/80 p-1 rounded-xl border border-indigo-800 shadow-xs">
            <button
              onClick={handlePrev}
              className="p-1.5 hover:bg-indigo-800/80 rounded-lg text-indigo-200 hover:text-white transition-colors cursor-pointer"
              title="Tema anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono font-bold text-amber-300 px-1.5 min-w-[50px] text-center">
              {currentIndex + 1} / {TEMAS_GRAMATICAIS_BNCC.length}
            </span>
            <button
              onClick={handleNext}
              className="p-1.5 hover:bg-indigo-800/80 rounded-lg text-indigo-200 hover:text-white transition-colors cursor-pointer"
              title="Próximo tema"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Animated Tip Card Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentTema.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-5"
        >
          {/* Card Header & Badges */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl p-2.5 rounded-2xl bg-white/10 border border-white/10 shrink-0">
                {currentTema.icon}
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-bold font-mono bg-indigo-800/90 text-indigo-200 border border-indigo-600/60">
                    {currentTema.skillCode}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    {currentTema.grammarTopic}
                  </span>
                  <span className="text-xs text-indigo-300 font-medium">
                    {currentTema.skillName}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-display text-white mt-1">
                  {currentTema.title}
                </h3>
              </div>
            </div>

            {/* Quick Link to the corresponding mission */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                soundManager.playClick();
                onSelectMission(currentTema.missionId);
              }}
              className="px-4 py-2 bg-white text-indigo-950 hover:bg-amber-400 hover:text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 shrink-0 self-start sm:self-auto"
            >
              <span>Treinar na {currentTema.missionLabel}</span>
              <ArrowRight className="w-3.5 h-3.5 text-indigo-700" />
            </motion.button>
          </div>

          {/* Preparation & Golden Rule Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Como se preparar para o jogo */}
            <div className="bg-indigo-900/40 rounded-2xl border border-indigo-700/50 p-4 sm:p-5 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-amber-300">
                <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Como se preparar para os desafios:</span>
              </div>
              <p className="text-xs sm:text-sm text-indigo-100 leading-relaxed">
                {currentTema.preparationTip}
              </p>
              <div className="pt-2 border-t border-indigo-800/50 text-[11px] text-indigo-300 flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{currentTema.gameApplication}</span>
              </div>
            </div>

            {/* Regra de Ouro em Destaque */}
            <div className="bg-gradient-to-br from-amber-500/20 via-amber-400/10 to-transparent rounded-2xl border-2 border-amber-400/60 p-4 sm:p-5 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-amber-300">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Regra de Ouro da BNCC:</span>
              </div>
              <p className="text-xs sm:text-sm font-extrabold text-amber-100 leading-relaxed">
                "{currentTema.goldenRule}"
              </p>
              <div className="pt-2 border-t border-amber-400/30 text-[11px] text-amber-200">
                <strong>Exemplo Prático:</strong> {currentTema.practicalExample.phrase}{' '}
                <span className="italic opacity-90">({currentTema.practicalExample.analysis})</span>
              </div>
            </div>
          </div>

          {/* Action Bar with Daily XP Reward */}
          <div className="pt-3 border-t border-indigo-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-indigo-300">
              <BookOpen className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>
                Consulte esta dica antes de jogar para melhorar seu desempenho e subir no ranking!
              </span>
            </div>

            <motion.button
              whileHover={{ scale: hasClaimedToday ? 1 : 1.02 }}
              whileTap={{ scale: hasClaimedToday ? 1 : 0.98 }}
              onClick={handleClaimReward}
              disabled={hasClaimedToday}
              className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs ${
                hasClaimedToday
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 cursor-default'
                  : 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950'
              }`}
            >
              {hasClaimedToday ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Dica Estudada Hoje (+25 XP Salvos!)</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Entendi a Dica (+25 XP Bônus)</span>
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
};
