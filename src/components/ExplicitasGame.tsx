import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Volume2, VolumeX, Lightbulb, CheckCircle2, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';
import { EXPLICIT_QUESTIONS, READING_TEXTS } from '../data/bnccContent';
import { soundManager } from '../utils/audio';
import { speechService } from '../utils/speech';
import confetti from 'canvas-confetti';
import { VidasAprendizado } from './VidasAprendizado';

interface Props {
  onEarnScore: (points: number, stars: number, skill: 'EF15LP03', questionId: string) => void;
  onNavigate: (view: string) => void;
  completedQuestions: Record<string, boolean>;
}

export const ExplicitasGame: React.FC<Props> = ({ onEarnScore, onNavigate, completedQuestions }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showClueHighlight, setShowClueHighlight] = useState(false);
  const [isNarrating, setIsNarrating] = useState(false);
  const [fontSizeClass, setFontSizeClass] = useState<'text-base' | 'text-lg'>('text-base');
  const [lives, setLives] = useState(3);

  const currentQuestion = EXPLICIT_QUESTIONS[currentIndex];
  const currentText = READING_TEXTS.find(t => t.id === currentQuestion.textId) || READING_TEXTS[0];

  const handleRecoverLives = () => {
    setLives(3);
    setHasSubmitted(false);
    setSelectedOptionId(null);
    setShowClueHighlight(true); // Generously activate clue highlight to help student
  };

  const handleSelectOption = (optionId: string) => {
    if (hasSubmitted || lives <= 0) return;
    soundManager.playClick();
    setSelectedOptionId(optionId);
  };

  const handleConfirmAnswer = () => {
    if (!selectedOptionId || hasSubmitted || lives <= 0) return;
    setHasSubmitted(true);

    const chosenOption = currentQuestion.options.find(o => o.id === selectedOptionId);
    if (chosenOption?.isCorrect) {
      soundManager.playCorrect();
      onEarnScore(100, 1, 'EF15LP03', currentQuestion.id);
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
      });
    } else {
      soundManager.playWrong();
      setLives(prev => Math.max(0, prev - 1));
      onEarnScore(20, 0, 'EF15LP03', currentQuestion.id);
    }
  };

  const handleNext = () => {
    soundManager.playClick();
    speechService.stop();
    setIsNarrating(false);
    setSelectedOptionId(null);
    setHasSubmitted(false);
    setShowClueHighlight(false);

    if (currentIndex < EXPLICIT_QUESTIONS.length - 1) {
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
      {/* Skill Banner & Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 font-semibold">
            <span>HABILIDADE BNCC EF15LP03</span>
            <span aria-hidden="true">·</span>
            <span>Localizar Informações Explícitas</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display mt-1">
            Missão 1: Detetive dos Fatos
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            As respostas para estas perguntas estão <strong>escritas diretamente no texto</strong>. Leia com atenção e use a lupa para encontrar onde o fato foi registrado!
          </p>
        </div>

        {/* Progress counter, Font size switch & Vidas de Aprendizado */}
        <div className="flex flex-wrap items-center gap-3">
          <VidasAprendizado
            lives={lives}
            maxLives={3}
            onRecoverLives={handleRecoverLives}
            onReturnToHub={() => onNavigate('hub')}
            missionName="Detetive dos Fatos"
            pedagogicalTip="As informações explícitas estão gravadas no texto exatamente como foram perguntadas. Use o botão de destaque da lupa para encontrar a frase exata!"
          />

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setFontSizeClass('text-base')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                fontSizeClass === 'text-base' ? 'bg-white shadow-xs text-slate-900 font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Texto A
            </button>
            <button
              onClick={() => setFontSizeClass('text-lg')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                fontSizeClass === 'text-lg' ? 'bg-white shadow-xs text-slate-900 font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Texto A+
            </button>
          </div>

          <div className="text-xs font-mono font-bold text-slate-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
            Pergunta {currentIndex + 1} de {EXPLICIT_QUESTIONS.length}
          </div>
        </div>
      </div>

      {/* Main 2-Zone Sandbox Layout with AnimatePresence */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
        >
          {/* Left Column: Reading Stage (7 cols on lg) */}
          <section className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5">
            {/* Text Header */}
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

              {/* Read Aloud Button */}
              <button
                onClick={handleToggleNarration}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 border ${
                  isNarrating
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                }`}
                title="Ouvir leitura do texto"
              >
                {isNarrating ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                <span>{isNarrating ? 'Pausar Áudio' : 'Ouvir Texto'}</span>
              </button>
            </div>

            {/* Story Paragraphs with Clue Spotting */}
            <div className={`space-y-4 text-slate-700 leading-relaxed ${fontSizeClass}`}>
              {currentText.paragraphs.map(p => {
                const isTargetParagraph = p.id === currentQuestion.paragraphRef;
                return (
                  <div
                    key={p.id}
                    className={`p-3.5 rounded-xl transition-all ${
                      isTargetParagraph && showClueHighlight
                        ? 'bg-amber-50/80 border border-amber-300 ring-2 ring-amber-200/50'
                        : 'bg-transparent border border-transparent hover:border-slate-100'
                    }`}
                  >
                    <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                      Parágrafo {p.id}
                    </span>
                    <p>
                      {isTargetParagraph && showClueHighlight && p.highlightClue ? (
                        <>
                          {p.text.split(p.highlightClue)[0]}
                          <mark className="bg-amber-200 text-amber-950 font-medium px-1 rounded-sm">
                            {p.highlightClue}
                          </mark>
                          {p.text.split(p.highlightClue)[1]}
                        </>
                      ) : (
                        p.text
                      )}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Teacher Assistant Hint Button */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => {
                  soundManager.playPop();
                  setShowClueHighlight(prev => !prev);
                }}
                className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>{showClueHighlight ? 'Esconder Destaque no Texto' : 'Ativar Lupa: Destacar Pista no Texto'}</span>
              </button>

              <span className="text-xs text-slate-400">
                Dica: O parágrafo {currentQuestion.paragraphRef} contém a resposta exata.
              </span>
            </div>
          </section>

          {/* Right Column: Interactive Investigation Deck (5 cols on lg) */}
          <section className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold mb-2">
                <Lightbulb className="w-4 h-4 text-emerald-600" />
                <span>Pergunta de Localização Direta:</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-display leading-snug">
                {currentQuestion.question}
              </h3>
            </div>

            {/* Options List with motion feedback */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedOptionId === option.id;
                let optionStyle = 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50 text-slate-700';

                if (hasSubmitted) {
                  if (option.isCorrect) {
                    optionStyle = 'border-emerald-500 bg-emerald-50/80 text-emerald-950 font-medium ring-1 ring-emerald-500';
                  } else if (isSelected && !option.isCorrect) {
                    optionStyle = 'border-rose-400 bg-rose-50/80 text-rose-950 ring-1 ring-rose-400';
                  } else {
                    optionStyle = 'border-slate-200 bg-slate-50 text-slate-400 opacity-60';
                  }
                } else if (isSelected) {
                  optionStyle = 'border-emerald-600 bg-emerald-50/40 text-emerald-950 font-medium ring-2 ring-emerald-600/30';
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
                      isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {option.id}
                    </span>
                    <span className="flex-1 leading-snug">{option.text}</span>
                  </motion.button>
                );
              })}
            </div>

            {/* Explanation Callout after Submit with AnimatePresence */}
            <AnimatePresence>
              {hasSubmitted && chosenOption && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className={`p-4 rounded-xl text-xs space-y-1.5 border ${
                    chosenOption.isCorrect
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-amber-50 border-amber-200 text-amber-900'
                  }`}
                >
                  <div className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{chosenOption.isCorrect ? 'Resposta Exata Localizada!' : 'Atenção ao Texto:'}</span>
                  </div>
                  <p className="leading-relaxed">{chosenOption.explanation}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Footer */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              {!hasSubmitted ? (
                <motion.button
                  onClick={handleConfirmAnswer}
                  disabled={!selectedOptionId}
                  whileHover={selectedOptionId ? { scale: 1.01 } : {}}
                  whileTap={selectedOptionId ? { scale: 0.99 } : {}}
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-2"
                >
                  <span>Confirmar Resposta</span>
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
                  <span>{currentIndex < EXPLICIT_QUESTIONS.length - 1 ? 'Próxima Questão' : 'Concluir Missão'}</span>
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
