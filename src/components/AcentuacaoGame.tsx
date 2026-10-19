import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Volume2, CheckCircle2, XCircle, ArrowRight, BookOpen, Layers, Award, Zap } from 'lucide-react';
import { SYLLABLE_EXERCISES } from '../data/bnccContent';
import { SyllableClassification, SyllableExercise } from '../types/game';
import { soundManager } from '../utils/audio';
import { speechService } from '../utils/speech';
import confetti from 'canvas-confetti';
import { VidasAprendizado } from './VidasAprendizado';

interface Props {
  onEarnScore: (points: number, stars: number, skill: 'EF05LP03', questionId: string) => void;
  onNavigate: (view: string) => void;
  onOpenRules: () => void;
  completedQuestions: Record<string, boolean>;
}

export const AcentuacaoGame: React.FC<Props> = ({ onEarnScore, onNavigate, onOpenRules, completedQuestions }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedSyllableIdx, setSelectedSyllableIdx] = useState<number | null>(null);
  const [selectedClassification, setSelectedClassification] = useState<SyllableClassification | null>(null);
  const [selectedNeedsAccent, setSelectedNeedsAccent] = useState<boolean | null>(null);
  const [hasCheckedAnswer, setHasCheckedAnswer] = useState(false);
  const [lives, setLives] = useState(3);

  const currentExercise = SYLLABLE_EXERCISES[currentIndex];

  const handleRecoverLives = () => {
    setLives(3);
    setHasCheckedAnswer(false);
    setSelectedSyllableIdx(null);
    setSelectedClassification(null);
    setSelectedNeedsAccent(null);
  };

  const handlePronounce = (word: string) => {
    soundManager.playClick();
    speechService.speak(word);
  };

  const handleSelectSyllable = (idx: number) => {
    if (hasCheckedAnswer || lives <= 0) return;
    soundManager.playClick();
    setSelectedSyllableIdx(idx);
  };

  const handleSelectClass = (c: SyllableClassification) => {
    if (hasCheckedAnswer || lives <= 0) return;
    soundManager.playClick();
    setSelectedClassification(c);
  };

  const handleSelectAccent = (needs: boolean) => {
    if (hasCheckedAnswer || lives <= 0) return;
    soundManager.playClick();
    setSelectedNeedsAccent(needs);
  };

  const isCompleteForm = selectedSyllableIdx !== null && selectedClassification !== null && selectedNeedsAccent !== null;

  const handleCheckAnswer = () => {
    if (!isCompleteForm || hasCheckedAnswer || lives <= 0) return;
    setHasCheckedAnswer(true);

    const isSyllableRight = selectedSyllableIdx === currentExercise.tonicIndex;
    const isClassRight = selectedClassification === currentExercise.classification;
    const isAccentRight = selectedNeedsAccent === currentExercise.needsAccent;

    const isAllRight = isSyllableRight && isClassRight && isAccentRight;

    if (isAllRight) {
      soundManager.playCorrect();
      onEarnScore(120, 1, 'EF05LP03', currentExercise.id);
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.7 },
      });
    } else {
      soundManager.playWrong();
      setLives(prev => Math.max(0, prev - 1));
      onEarnScore(30, 0, 'EF05LP03', currentExercise.id);
    }
  };

  const handleNext = () => {
    soundManager.playClick();
    setSelectedSyllableIdx(null);
    setSelectedClassification(null);
    setSelectedNeedsAccent(null);
    setHasCheckedAnswer(false);

    if (currentIndex < SYLLABLE_EXERCISES.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      soundManager.playFanfare();
      onNavigate('hub');
    }
  };

  const isSyllableCorrect = selectedSyllableIdx === currentExercise.tonicIndex;
  const isClassCorrect = selectedClassification === currentExercise.classification;
  const isAccentCorrect = selectedNeedsAccent === currentExercise.needsAccent;
  const isAllCorrect = isSyllableCorrect && isClassCorrect && isAccentCorrect;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Skill Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-indigo-700 font-semibold">
            <span>HABILIDADE BNCC EF05LP03</span>
            <span aria-hidden="true">·</span>
            <span>Acentuação e Sílaba Tônica</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display mt-1">
            Missão 4: Usina das Palavras e Acentos
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Descubra qual sílaba é a mais forte, classifique a palavra em <strong>Oxítona</strong>, <strong>Paroxítona</strong> ou <strong>Proparoxítona</strong> e aplique a regra do acento!
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <VidasAprendizado
            lives={lives}
            maxLives={3}
            onRecoverLives={handleRecoverLives}
            onReturnToHub={() => onNavigate('hub')}
            missionName="Usina dos Acentos"
            pedagogicalTip="Chame a palavra alto e observe a sílaba que você segura por mais tempo: essa é a sílaba tônica! Todas as proparoxítonas recebem acento gráfico obrigatoriamente."
          />

          <button
            onClick={() => {
              soundManager.playClick();
              onOpenRules();
            }}
            className="px-3.5 py-1.5 rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>Consultar Regras</span>
          </button>

          <div className="text-xs font-mono font-bold text-slate-600 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-lg shrink-0">
            Palavra {currentIndex + 1} de {SYLLABLE_EXERCISES.length}
          </div>
        </div>
      </div>

      {/* Main Sandbox Interactive Card with AnimatePresence */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentExercise.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-8"
        >
          {/* Word Display & Audio Stage */}
          <div className="flex flex-col items-center justify-center py-6 bg-slate-50 rounded-2xl border border-slate-100 text-center space-y-4">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
              Palavra em Análise
            </span>

            <div className="flex items-center justify-center gap-3">
              <motion.h2
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="text-4xl sm:text-5xl font-extrabold text-slate-900 font-display tracking-wide"
              >
                {currentExercise.word}
              </motion.h2>
              <motion.button
                onClick={() => handlePronounce(currentExercise.word)}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs transition-colors cursor-pointer"
                title="Ouvir pronúncia da palavra"
                aria-label="Ouvir pronúncia"
              >
                <Volume2 className="w-5 h-5" />
              </motion.button>
            </div>
            <p className="text-xs text-slate-500">
              Dica do Som: Clique no alto-falante para escutar qual pedacinho soa com mais energia!
            </p>
          </div>

          {/* Step 1: Click the Strongest Syllable */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">1</span>
                <span>Qual é a Sílaba Tônica (mais forte)?</span>
              </label>
              <span className="text-xs text-slate-400">Clique na sílaba correspondente</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 p-4 bg-slate-50/50 rounded-xl border border-slate-200">
              {currentExercise.syllables.map((syl, idx) => {
                const isSelected = selectedSyllableIdx === idx;
                const isTonic = idx === currentExercise.tonicIndex;

                let btnStyle = 'border-slate-300 bg-white hover:border-indigo-400 text-slate-800 hover:bg-indigo-50/30';
                if (hasCheckedAnswer) {
                  if (isTonic) {
                    btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500';
                  } else if (isSelected && !isTonic) {
                    btnStyle = 'border-rose-400 bg-rose-50 text-rose-950 ring-2 ring-rose-400';
                  } else {
                    btnStyle = 'border-slate-200 bg-slate-100 text-slate-400 opacity-50';
                  }
                } else if (isSelected) {
                  btnStyle = 'border-indigo-600 bg-indigo-600 text-white shadow-xs';
                }

                const total = currentExercise.syllables.length;
                let positionLabel = '';
                if (idx === total - 1) positionLabel = 'Última';
                else if (idx === total - 2) positionLabel = 'Penúltima';
                else if (idx === total - 3) positionLabel = 'Antepenúltima';
                else positionLabel = 'Anterior';

                return (
                  <motion.button
                    key={idx}
                    onClick={() => handleSelectSyllable(idx)}
                    disabled={hasCheckedAnswer}
                    whileHover={!hasCheckedAnswer ? { scale: 1.05 } : {}}
                    whileTap={!hasCheckedAnswer ? { scale: 0.95 } : {}}
                    className={`px-6 py-4 rounded-xl border-2 text-xl font-bold font-display uppercase transition-colors cursor-pointer flex flex-col items-center gap-1 ${btnStyle}`}
                  >
                    <span>{syl}</span>
                    <span className={`text-[10px] font-mono tracking-tight font-normal ${isSelected && !hasCheckedAnswer ? 'text-indigo-100' : 'text-slate-500'}`}>
                      {positionLabel}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Classify as Oxítona, Paroxítona, Proparoxítona */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">2</span>
              <span>Classificação pela Posição da Sílaba Forte:</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  id: 'oxitona' as SyllableClassification,
                  label: 'Oxítona',
                  sub: 'Última sílaba forte',
                },
                {
                  id: 'paroxitona' as SyllableClassification,
                  label: 'Paroxítona',
                  sub: 'Penúltima sílaba forte',
                },
                {
                  id: 'proparoxitona' as SyllableClassification,
                  label: 'Proparoxítona',
                  sub: 'Antepenúltima sílaba forte',
                },
              ].map(item => {
                const isSelected = selectedClassification === item.id;
                const isCorrectClass = currentExercise.classification === item.id;

                let style = 'border-slate-200 bg-white hover:border-slate-300 text-slate-700';
                if (hasCheckedAnswer) {
                  if (isCorrectClass) {
                    style = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold ring-1 ring-emerald-500';
                  } else if (isSelected && !isCorrectClass) {
                    style = 'border-rose-400 bg-rose-50 text-rose-950 ring-1 ring-rose-400';
                  } else {
                    style = 'border-slate-200 bg-slate-50 text-slate-400 opacity-50';
                  }
                } else if (isSelected) {
                  style = 'border-indigo-600 bg-indigo-50/50 text-indigo-950 font-bold ring-2 ring-indigo-600/30';
                }

                return (
                  <motion.button
                    key={item.id}
                    onClick={() => handleSelectClass(item.id)}
                    disabled={hasCheckedAnswer}
                    whileHover={!hasCheckedAnswer ? { scale: 1.02 } : {}}
                    whileTap={!hasCheckedAnswer ? { scale: 0.98 } : {}}
                    className={`p-4 rounded-xl border text-left transition-colors cursor-pointer ${style}`}
                  >
                    <p className="font-bold text-base font-display">{item.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{item.sub}</p>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Does it need an accent? */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">3</span>
              <span>Esta palavra recebe acento gráfico?</span>
            </label>

            <div className="grid grid-cols-2 gap-3 sm:max-w-md">
              {[
                { val: true, label: 'Sim, tem acento' },
                { val: false, label: 'Não tem acento' },
              ].map(opt => {
                const isSelected = selectedNeedsAccent === opt.val;
                const isCorrectAccent = currentExercise.needsAccent === opt.val;

                let style = 'border-slate-200 bg-white hover:border-slate-300 text-slate-700';
                if (hasCheckedAnswer) {
                  if (isCorrectAccent) {
                    style = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold ring-1 ring-emerald-500';
                  } else if (isSelected && !isCorrectAccent) {
                    style = 'border-rose-400 bg-rose-50 text-rose-950 ring-1 ring-rose-400';
                  } else {
                    style = 'border-slate-200 bg-slate-50 text-slate-400 opacity-50';
                  }
                } else if (isSelected) {
                  style = 'border-indigo-600 bg-indigo-50/50 text-indigo-950 font-bold ring-2 ring-indigo-600/30';
                }

                return (
                  <motion.button
                    key={String(opt.val)}
                    onClick={() => handleSelectAccent(opt.val)}
                    disabled={hasCheckedAnswer}
                    whileHover={!hasCheckedAnswer ? { scale: 1.02 } : {}}
                    whileTap={!hasCheckedAnswer ? { scale: 0.98 } : {}}
                    className={`py-3 px-4 rounded-xl border text-center text-sm font-medium transition-colors cursor-pointer ${style}`}
                  >
                    {opt.label}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Rule Explanation Callout with AnimatePresence */}
          <AnimatePresence>
            {hasCheckedAnswer && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className={`p-5 rounded-xl border text-sm space-y-2 ${
                  isAllCorrect
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-indigo-50 border-indigo-200 text-indigo-900'
                }`}
              >
                <div className="flex items-center gap-2 font-bold">
                  {isAllCorrect ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span>Análise Correta! Você dominou a regra!</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 text-indigo-600 shrink-0" />
                      <span>Entenda a Regra Desta Palavra:</span>
                    </>
                  )}
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-slate-700">
                  {currentExercise.accentRuleExplanation}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Button */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            {!hasCheckedAnswer ? (
              <motion.button
                onClick={handleCheckAnswer}
                disabled={!isCompleteForm}
                whileHover={isCompleteForm ? { scale: 1.01 } : {}}
                whileTap={isCompleteForm ? { scale: 0.99 } : {}}
                className="w-full sm:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-2"
              >
                <span>Verificar Análise da Palavra</span>
              </motion.button>
            ) : (
              <motion.button
                onClick={handleNext}
                initial={{ scale: 0.98 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full sm:w-auto px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-xl transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-2"
              >
                <span>{currentIndex < SYLLABLE_EXERCISES.length - 1 ? 'Próxima Palavra' : 'Concluir Usina'}</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
