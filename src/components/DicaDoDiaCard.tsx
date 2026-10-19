import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Volume2, VolumeX, Shuffle, CheckCircle, Sparkles, BookOpen } from 'lucide-react';
import { DICAS_DO_DIA, DicaDoDia } from '../data/dicasDoDia';
import { soundManager } from '../utils/audio';
import { speechService } from '../utils/speech';

interface Props {
  onBonusPoints?: (points: number) => void;
}

export const DicaDoDiaCard: React.FC<Props> = ({ onBonusPoints }) => {
  // Determine initial index from day of year for true daily rotation
  const getInitialIndex = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    return dayOfYear % DICAS_DO_DIA.length;
  };

  const [currentIndex, setCurrentIndex] = useState(getInitialIndex);
  const [isNarrating, setIsNarrating] = useState(false);
  const [hasClaimedToday, setHasClaimedToday] = useState(false);

  const currentDica: DicaDoDia = DICAS_DO_DIA[currentIndex];

  const handleNextDica = () => {
    soundManager.playClick();
    speechService.stop();
    setIsNarrating(false);
    setCurrentIndex(prev => (prev + 1) % DICAS_DO_DIA.length);
  };

  const handleToggleNarration = () => {
    if (isNarrating) {
      speechService.stop();
      setIsNarrating(false);
    } else {
      soundManager.playClick();
      const textToRead = `${currentDica.title}. ${currentDica.content}. ${currentDica.example || ''}. ${currentDica.motivationalQuote}`;
      speechService.speak(textToRead, () => setIsNarrating(false));
      setIsNarrating(true);
    }
  };

  const handleClaimEnergy = () => {
    if (hasClaimedToday) return;
    soundManager.playCorrect();
    setHasClaimedToday(true);
    if (onBonusPoints) {
      onBonusPoints(25);
    }
  };

  return (
    <div className="bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-indigo-500/10 rounded-2xl border border-amber-200/80 p-6 sm:p-7 shadow-xs space-y-4">
      {/* Header bar of the card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-200/60">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs shrink-0">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-[11px] font-mono font-semibold tracking-wider uppercase text-amber-800">
              <span>DICA DO DIA</span>
              <span aria-hidden="true" className="text-amber-400">·</span>
              <span>{currentDica.category}</span>
              {currentDica.relatedSkill && (
                <>
                  <span aria-hidden="true" className="text-amber-400">·</span>
                  <span>{currentDica.relatedSkill}</span>
                </>
              )}
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 font-display">
              Pílula do Conhecimento Diário
            </h3>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            onClick={handleToggleNarration}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border ${
              isNarrating
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
            title="Ouvir a dica do dia"
          >
            {isNarrating ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span>{isNarrating ? 'Pausar' : 'Ouvir Dica'}</span>
          </button>

          <button
            onClick={handleNextDica}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer flex items-center gap-1.5"
            title="Ver outra dica divertida"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Outra Dica</span>
          </button>
        </div>
      </div>

      {/* Animated Tip Content with AnimatePresence */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentDica.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-3"
        >
          <div className="flex items-start gap-3">
            <span className="text-3xl shrink-0 pt-0.5">{currentDica.icon}</span>
            <div className="space-y-1.5">
              <h4 className="text-base sm:text-lg font-bold text-slate-900 font-display leading-snug">
                {currentDica.title}
              </h4>
              <p className="text-sm text-slate-700 leading-relaxed">
                {currentDica.content}
              </p>
              {currentDica.example && (
                <p className="text-xs font-medium text-amber-900 bg-amber-100/60 border border-amber-200/80 p-2.5 rounded-lg">
                  {currentDica.example}
                </p>
              )}
            </div>
          </div>

          {/* Motivational Bottom Quote */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-1.5 text-amber-900 font-medium italic">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>"{currentDica.motivationalQuote}"</span>
            </div>

            <button
              onClick={handleClaimEnergy}
              disabled={hasClaimedToday}
              className={`px-3 py-1.5 rounded-lg font-semibold text-xs flex items-center gap-1.5 transition-all self-start sm:self-auto cursor-pointer ${
                hasClaimedToday
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-default'
                  : 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-xs'
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{hasClaimedToday ? 'Dica Aprendida Hoje!' : 'Entendi! (+25 pts)'}</span>
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
