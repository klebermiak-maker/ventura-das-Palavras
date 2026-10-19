import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Volume2, VolumeX, Lightbulb, CheckCircle2, ArrowRight, Target, Sparkles } from 'lucide-react';
import { CENTRAL_IDEA_QUESTIONS, READING_TEXTS } from '../data/bnccContent';
import { soundManager } from '../utils/audio';
import { speechService } from '../utils/speech';
import confetti from 'canvas-confetti';

interface Props {
  onEarnScore: (points: number, stars: number, skill: 'EF35LP03', questionId: string) => void;
  onNavigate: (view: string) => void;
  completedQuestions: Record<string, boolean>;
}

export const IdeiaCentralGame: React.FC<Props> = ({ onEarnScore, onNavigate, completedQuestions }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isNarrating, setIsNarrating] = useState(false);

  const currentQuestion = CENTRAL_IDEA_QUESTIONS[currentIndex];
  const currentText = READING_TEXTS.find(t => t.id === currentQuestion.textId) || READING_TEXTS[0];

  const handleSelectOption = (optionId: string) => {
    if (hasSubmitted) return;
    soundManager.playClick();
    setSelectedOptionId(optionId);
  };

  const handleConfirmAnswer = () => {
    if (!selectedOptionId || hasSubmitted) return;
    setHasSubmitted(true);

    const chosenOption = currentQuestion.options.find(o => o.id === selectedOptionId);
    if (chosenOption?.isCorrect) {
      soundManager.playCorrect();
      onEarnScore(100, 1, 'EF35LP03', currentQuestion.id);
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
      });
    } else {
      soundManager.playWrong();
      onEarnScore(20, 0, 'EF35LP03', currentQuestion.id);
    }
  };

  const handleNext = () => {
    soundManager.playClick();
    speechService.stop();
    setIsNarrating(false);
    setSelectedOptionId(null);
    setHasSubmitted(false);

    if (currentIndex < CENTRAL_IDEA_QUESTIONS.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      soundManager.playFanfare();
      onNavigate('hub');
    }
  };

  const handleToggleNarration = () => {
    if (isNarrating) {
      speechService.stop();
      setIsNarrating(false);
    } else {
      const fullTextToRead = `${currentText.title}. ${currentText.paragraphs.map(p => p.text).join(' ')}`;
      speechService.speak(fullTextToRead, () => setIsNarrating(false));
      setIsNarrating(true);
    }
  };

  const chosenOption = currentQuestion.options.find(o => o.id === selectedOptionId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Skill Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-sky-700 font-semibold">
            <span>HABILIDADE BNCC EF35LP03</span>
            <span aria-hidden="true">·</span>
            <span>Ideia Central & Compreensão Global</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display mt-1">
            Missão 2: A Bússola da Ideia Central
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Descubra o coração do texto! Cuidado com as pegadinhas: um detalhe pequeno não é a ideia central da história toda.
          </p>
        </div>

        <div className="text-xs font-mono font-bold text-slate-600 bg-sky-50 border border-sky-200 px-3 py-1.5 rounded-lg shrink-0">
          Desafio {currentIndex + 1} de {CENTRAL_IDEA_QUESTIONS.length}
        </div>
      </div>

      {/* Main Sandbox Grid with AnimatePresence */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
        >
          {/* Left Column: Full Text Stage */}
          <section className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                  <span>{currentText.genre}</span>
                  <span aria-hidden="true">·</span>
                  <span>{currentText.authorOrSource}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display mt-1 flex items-center gap-2">
                  <span>{currentText.themeIcon}</span>
                  <span>{currentText.title}</span>
                </h2>
              </div>

              <button
                onClick={handleToggleNarration}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 border ${
                  isNarrating
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                }`}
              >
                {isNarrating ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                <span>{isNarrating ? 'Pausar Áudio' : 'Ouvir Texto'}</span>
              </button>
            </div>

            {/* Paragraphs */}
            <div className="space-y-4 text-slate-700 text-base leading-relaxed">
              {currentText.paragraphs.map(p => (
                <p key={p.id} className="p-2 rounded-lg hover:bg-slate-50/70 transition-colors">
                  {p.text}
                </p>
              ))}
            </div>

            {/* Concept Anchor Card */}
            <div className="bg-sky-50/70 border border-sky-200 p-4 rounded-xl flex items-start gap-3 text-xs text-sky-900">
              <Compass className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">O que é a Ideia Central?</p>
                <p className="mt-0.5 text-sky-800 leading-relaxed">
                  {currentQuestion.learningTip}
                </p>
              </div>
            </div>
          </section>

          {/* Right Column: Comprehension Compass Challenge */}
          <section className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-sky-700 font-semibold mb-2">
                <Target className="w-4 h-4 text-sky-600" />
                <span>Pergunta de Compreensão Global:</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-display leading-snug">
                {currentQuestion.question}
              </h3>
              <p className="text-xs text-slate-500 mt-1 italic">
                {currentQuestion.bestHeadlineQuestion}
              </p>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {currentQuestion.options.map(option => {
                const isSelected = selectedOptionId === option.id;
                let optionStyle = 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50 text-slate-700';

                if (hasSubmitted) {
                  if (option.isCorrect) {
                    optionStyle = 'border-sky-500 bg-sky-50/80 text-sky-950 font-medium ring-1 ring-sky-500';
                  } else if (isSelected && !option.isCorrect) {
                    optionStyle = 'border-rose-400 bg-rose-50/80 text-rose-950 ring-1 ring-rose-400';
                  } else {
                    optionStyle = 'border-slate-200 bg-slate-50 text-slate-400 opacity-60';
                  }
                } else if (isSelected) {
                  optionStyle = 'border-sky-600 bg-sky-50/40 text-sky-950 font-medium ring-2 ring-sky-600/30';
                }

                return (
                  <motion.button
                    key={option.id}
                    onClick={() => handleSelectOption(option.id)}
                    disabled={hasSubmitted}
                    whileHover={!hasSubmitted ? { scale: 1.01 } : {}}
                    whileTap={!hasSubmitted ? { scale: 0.99 } : {}}
                    className={`w-full text-left p-4 rounded-xl border text-sm transition-colors flex items-start gap-3 cursor-pointer ${optionStyle}`}
                  >
                    <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 uppercase transition-colors ${
                      isSelected ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {option.id}
                    </span>
                    <span className="flex-1 leading-snug">{option.text}</span>
                  </motion.button>
                );
              })}
            </div>

            {/* Explanation Callout with AnimatePresence */}
            <AnimatePresence>
              {hasSubmitted && chosenOption && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className={`p-4 rounded-xl text-xs space-y-1.5 border ${
                    chosenOption.isCorrect
                      ? 'bg-sky-50 border-sky-200 text-sky-900'
                      : 'bg-amber-50 border-amber-200 text-amber-900'
                  }`}
                >
                  <div className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{chosenOption.isCorrect ? 'Síntese Perfeita!' : 'Reflexão Pedagógica:'}</span>
                  </div>
                  <p className="leading-relaxed">{chosenOption.explanation}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Footer */}
            <div className="pt-4 border-t border-slate-100">
              {!hasSubmitted ? (
                <motion.button
                  onClick={handleConfirmAnswer}
                  disabled={!selectedOptionId}
                  whileHover={selectedOptionId ? { scale: 1.01 } : {}}
                  whileTap={selectedOptionId ? { scale: 0.99 } : {}}
                  className="w-full py-3 px-4 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-2"
                >
                  <span>Validar Ideia Central</span>
                </motion.button>
              ) : (
                <motion.button
                  onClick={handleNext}
                  initial={{ scale: 0.98 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-xl transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-2"
                >
                  <span>{currentIndex < CENTRAL_IDEA_QUESTIONS.length - 1 ? 'Próximo Desafio' : 'Concluir Missão'}</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              )}
            </div>
          </section>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
