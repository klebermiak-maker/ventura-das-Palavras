import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Volume2, VolumeX, Sparkles, CheckCircle2, ArrowRight, HelpCircle, FileSearch, Shuffle } from 'lucide-react';
import { IMPLICIT_QUESTIONS, IMPLICIT_TEXTS } from '../data/bnccContent';
import { shuffleQuestionsAndOptions } from '../utils/questionShuffle';
import { soundManager } from '../utils/audio';
import { speechService } from '../utils/speech';
import confetti from 'canvas-confetti';
import { VidasAprendizado } from './VidasAprendizado';

interface Props {
  onEarnScore: (points: number, stars: number, skill: 'EF35LP04', questionId: string) => void;
  onNavigate: (view: string) => void;
  completedQuestions: Record<string, boolean>;
}

export const ImplicitasGame: React.FC<Props> = ({ onEarnScore, onNavigate, completedQuestions }) => {
  const [questions, setQuestions] = useState(() => shuffleQuestionsAndOptions(IMPLICIT_QUESTIONS));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isNarrating, setIsNarrating] = useState(false);
  const [lives, setLives] = useState(3);

  const currentQuestion = questions[currentIndex] || questions[0];
  const currentText = IMPLICIT_TEXTS.find(t => t.id === currentQuestion.textId) || IMPLICIT_TEXTS[0];

  const handleReshuffle = () => {
    soundManager.playClick();
    speechService.stop();
    setIsNarrating(false);
    setQuestions(shuffleQuestionsAndOptions(IMPLICIT_QUESTIONS));
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setHasSubmitted(false);
  };

  const handleRecoverLives = () => {
    setLives(3);
    setHasSubmitted(false);
    setSelectedOptionId(null);
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
      onEarnScore(100, 1, 'EF35LP04', currentQuestion.id);
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
      });
    } else {
      soundManager.playWrong();
      setLives(prev => Math.max(0, prev - 1));
      onEarnScore(20, 0, 'EF35LP04', currentQuestion.id);
    }
  };

  const handleNext = () => {
    soundManager.playClick();
    speechService.stop();
    setIsNarrating(false);
    setSelectedOptionId(null);
    setHasSubmitted(false);

    if (currentIndex < questions.length - 1) {
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
          <div className="flex items-center gap-2 text-xs font-mono text-amber-700 font-semibold">
            <span>HABILIDADE BNCC EF35LP04</span>
            <span aria-hidden="true">·</span>
            <span>Inferir Informações Implícitas</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display mt-1">
            Missão 3: O Mago das Entrelinhas
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Aprenda a <strong>ler nas entrelinhas</strong>! Algumas informações não estão escritas com todas as letras, mas você pode descobri-las juntando as pistas deixadas pelo autor.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <VidasAprendizado
            lives={lives}
            maxLives={3}
            onRecoverLives={handleRecoverLives}
            onReturnToHub={() => onNavigate('hub')}
            missionName="Mago das Entrelinhas"
            pedagogicalTip="Nas questões implícitas, combine as palavras do texto com a lógica do contexto. Se o personagem está com capa molhada e guarda-chuva, podemos inferir que choveu lá fora!"
          />

          <button
            onClick={handleReshuffle}
            title="Embaralhar ordem dos enigmas e alternativas"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 text-xs font-bold transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95"
          >
            <Shuffle className="w-3.5 h-3.5 text-amber-600" />
            <span>Embaralhar 🔀</span>
          </button>

          <div className="text-xs font-mono font-bold text-slate-600 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg shrink-0">
            Enigma {currentIndex + 1} de {questions.length}
          </div>
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
          {/* Left Column: Text & Detective Notepad */}
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

            {/* Detective Clue Card with subtle animated entrance */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.2 }}
              className="bg-amber-50/80 border border-amber-200 p-4 rounded-xl space-y-2"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                <FileSearch className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Pista Chave Destacada para Dedução:</span>
              </div>
              <p className="text-xs text-amber-950 font-serif italic bg-white/70 p-2.5 rounded-lg border border-amber-200/60">
                "{currentQuestion.excerptToAnalyze}"
              </p>
              <p className="text-[11px] text-amber-800">
                {currentQuestion.pedagogicalReasoning}
              </p>
            </motion.div>
          </section>

          {/* Right Column: Inference Question Deck */}
          <section className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-amber-700 font-semibold mb-2">
                <Eye className="w-4 h-4 text-amber-600" />
                <span>O Que Podemos Inferir?</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-display leading-snug">
                {currentQuestion.question}
              </h3>
            </div>

            {/* Options with micro-interaction */}
            <div className="space-y-3">
              {currentQuestion.options.map(option => {
                const isSelected = selectedOptionId === option.id;
                let optionStyle = 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50 text-slate-700';

                if (hasSubmitted) {
                  if (option.isCorrect) {
                    optionStyle = 'border-amber-500 bg-amber-50/80 text-amber-950 font-medium ring-1 ring-amber-500';
                  } else if (isSelected && !option.isCorrect) {
                    optionStyle = 'border-rose-400 bg-rose-50/80 text-rose-950 ring-1 ring-rose-400';
                  } else {
                    optionStyle = 'border-slate-200 bg-slate-50 text-slate-400 opacity-60';
                  }
                } else if (isSelected) {
                  optionStyle = 'border-amber-600 bg-amber-50/40 text-amber-950 font-medium ring-2 ring-amber-600/30';
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
                      isSelected ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600'
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
                      ? 'bg-amber-50 border-amber-200 text-amber-900'
                      : 'bg-rose-50 border-rose-200 text-rose-900'
                  }`}
                >
                  <div className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{chosenOption.isCorrect ? 'Dedução Perfeita!' : 'Explicação da Inferência:'}</span>
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
                  className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-2"
                >
                  <span>Validar Minha Dedução</span>
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
                  <span>{currentIndex < IMPLICIT_QUESTIONS.length - 1 ? 'Próximo Enigma' : 'Concluir Missão'}</span>
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
