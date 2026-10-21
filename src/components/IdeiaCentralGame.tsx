import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
  Target,
  RotateCcw,
  Sparkles,
  HelpCircle,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { CENTRAL_IDEA_QUESTIONS, CENTRAL_IDEA_TEXTS } from '../data/bnccContent';
import { shuffleQuestionsAndOptions } from '../utils/questionShuffle';
import { soundManager } from '../utils/audio';
import { speechService } from '../utils/speech';
import confetti from 'canvas-confetti';
import { VidasAprendizado } from './VidasAprendizado';
import { GameMode } from '../types/game';
import { useMissionTips } from '../hooks/useMissionTips';

interface AttemptDetails {
  firstTryCorrect: boolean;
  withHint: boolean;
  hintsUsedCount: number;
  attemptsCount: number;
  gameMode: GameMode;
}

interface Props {
  onEarnScore: (
    points: number,
    stars: number,
    skill: 'EF35LP03',
    questionId: string,
    details?: AttemptDetails
  ) => void;
  onNavigate: (view: string) => void;
  completedQuestions: Record<string, boolean>;
  initialGameMode?: GameMode;
  onSessionProgress?: (missionId: string, questionIndex: number, totalQuestions: number) => void;
}

export const IdeiaCentralGame: React.FC<Props> = ({
  onEarnScore,
  onNavigate,
  completedQuestions,
  initialGameMode = 'aprender',
  onSessionProgress,
}) => {
  // Stable shuffled pool created once at session start
  const [questions] = useState(() => shuffleQuestionsAndOptions(CENTRAL_IDEA_QUESTIONS));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isCorrectSubmitted, setIsCorrectSubmitted] = useState(false);

  // Progressive Hint State: 0 = nenhuma, 1 = orientação, 2 = parágrafo, 3 = trecho destacado
  const [hintLevel, setHintLevel] = useState<number>(0);

  // Attempt Tracking
  const [attemptsOnCurrent, setAttemptsOnCurrent] = useState<number>(0);
  const [hasUsedHintOnCurrent, setHasUsedHintOnCurrent] = useState<boolean>(false);

  // Game Mode: 'aprender' (padrão sem perda de vidas) vs 'desafio' (com vidas)
  const [gameMode, setGameMode] = useState<GameMode>(initialGameMode);
  const [lives, setLives] = useState(3);

  // Accessibility State
  const [narrationState, setNarrationState] = useState<'stopped' | 'playing' | 'paused'>('stopped');
  const [fontSizeClass, setFontSizeClass] = useState<'text-base' | 'text-lg' | 'text-xl'>('text-base');

  const currentQuestion = questions[currentIndex] || questions[0];
  const currentText = CENTRAL_IDEA_TEXTS.find(t => t.id === currentQuestion.textId) || CENTRAL_IDEA_TEXTS[0];

  // Auto-suggest pedagogical hint when student spends > 30s reflecting on the question
  const {
    isTipSuggested,
    secondsElapsed,
    dismissTip,
    acceptTip,
    tipMessage,
    configuredThreshold,
  } = useMissionTips({
    questionId: currentQuestion.id,
    hasSubmitted,
    hintLevel,
    completedQuestions,
  });

  // Report session progress
  useEffect(() => {
    if (onSessionProgress) {
      onSessionProgress('ideiaCentral', currentIndex, questions.length);
    }
  }, [currentIndex, questions.length, onSessionProgress]);

  // Clean audio on unmount
  useEffect(() => {
    return () => {
      speechService.stop();
    };
  }, []);

  const handleSelectOption = (optionId: string) => {
    if (hasSubmitted && isCorrectSubmitted) return;
    if (gameMode === 'desafio' && lives <= 0) return;
    soundManager.playClick();
    setSelectedOptionId(optionId);
  };

  const handleUseHint = () => {
    soundManager.playPop();
    setHasUsedHintOnCurrent(true);
    setHintLevel(prev => Math.min(3, prev + 1));
  };

  const handleConfirmAnswer = () => {
    if (!selectedOptionId || (hasSubmitted && isCorrectSubmitted)) return;
    if (gameMode === 'desafio' && lives <= 0) return;

    const newAttemptsCount = attemptsOnCurrent + 1;
    setAttemptsOnCurrent(newAttemptsCount);
    setHasSubmitted(true);

    const chosenOption = currentQuestion.options.find(o => o.id === selectedOptionId);
    const isCorrect = !!chosenOption?.isCorrect;
    setIsCorrectSubmitted(isCorrect);

    const isFirstTry = newAttemptsCount === 1;
    const withHint = hasUsedHintOnCurrent;

    if (isCorrect) {
      soundManager.playCorrect();
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.7 },
      });

      const earnedPoints = isFirstTry && !withHint ? 100 : withHint ? 80 : 60;
      const earnedStars = 1;

      onEarnScore(earnedPoints, earnedStars, 'EF35LP03', currentQuestion.id, {
        firstTryCorrect: isFirstTry && !withHint,
        withHint: withHint,
        hintsUsedCount: hintLevel,
        attemptsCount: newAttemptsCount,
        gameMode,
      });
    } else {
      soundManager.playWrong();
      if (gameMode === 'desafio') {
        setLives(prev => Math.max(0, prev - 1));
      }
      onEarnScore(20, 0, 'EF35LP03', currentQuestion.id, {
        firstTryCorrect: false,
        withHint: withHint,
        hintsUsedCount: hintLevel,
        attemptsCount: newAttemptsCount,
        gameMode,
      });
    }
  };

  const handleRetryCurrentQuestion = () => {
    soundManager.playClick();
    setHasSubmitted(false);
    setSelectedOptionId(null);
  };

  const handleNext = () => {
    soundManager.playClick();
    speechService.stop();
    setNarrationState('stopped');
    setSelectedOptionId(null);
    setHasSubmitted(false);
    setIsCorrectSubmitted(false);
    setHintLevel(0);
    setAttemptsOnCurrent(0);
    setHasUsedHintOnCurrent(false);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      soundManager.playFanfare();
      onNavigate('hub');
    }
  };

  const handlePlayAudio = () => {
    const fullTextToRead = `${currentText.title}. ${currentText.paragraphs.map(p => p.text).join(' ')}`;
    speechService.speak(fullTextToRead, () => setNarrationState('stopped'));
    setNarrationState('playing');
  };

  const handlePauseAudio = () => {
    speechService.pause();
    setNarrationState('paused');
  };

  const handleResumeAudio = () => {
    speechService.resume();
    setNarrationState('playing');
  };

  const handleStopAudio = () => {
    speechService.stop();
    setNarrationState('stopped');
  };

  const chosenOption = currentQuestion.options.find(o => o.id === selectedOptionId);
  const progHint = currentQuestion.progressiveHint;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Skill Banner & Game Mode Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-sky-700 font-semibold">
            <span>HABILIDADE BNCC EF35LP03</span>
            <span aria-hidden="true">·</span>
            <span>Ideia Central & Compreensão Global</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display mt-1 flex items-center gap-2">
            <Compass className="w-7 h-7 text-sky-600 inline" />
            <span>Missão 2: A Bússola da Ideia Central</span>
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Descubra o coração do texto! Distinga a mensagem principal dos pequenos detalhes específicos.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {/* Game Mode Pill Selector */}
          <div className="inline-flex rounded-xl p-1 bg-slate-100 border border-slate-200 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setGameMode('aprender')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                gameMode === 'aprender'
                  ? 'bg-white text-emerald-700 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Modo Aprender</span>
            </button>
            <button
              type="button"
              onClick={() => setGameMode('desafio')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                gameMode === 'desafio'
                  ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-indigo-600" />
              <span>Modo Desafio</span>
            </button>
          </div>

          {gameMode === 'desafio' && (
            <VidasAprendizado
              lives={lives}
              maxLives={3}
              onRecoverLives={() => setLives(3)}
              onReturnToHub={() => onNavigate('hub')}
              missionName="A Bússola do Tema"
              pedagogicalTip="A ideia central sintetiza o texto inteiro! Pergunte-se: qual é a mensagem principal do autor?"
            />
          )}

          <div className="text-xs font-mono font-bold text-slate-600 bg-sky-50 border border-sky-200 px-3 py-1.5 rounded-lg shrink-0">
            Questão {currentIndex + 1} de {questions.length}
          </div>
        </div>
      </div>

      {/* Main Sandbox Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
        >
          {/* Left Column: Full Text Stage with Accessibility Tools */}
          <section className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
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

              {/* Accessibility Controls: TTS with Play/Pause/Stop and Font Size */}
              <div className="flex items-center gap-2">
                <div className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs">
                  <span className="px-2 text-slate-500 font-medium">Fonte:</span>
                  <button
                    onClick={() => setFontSizeClass('text-base')}
                    className={`px-2 py-1 rounded font-bold cursor-pointer transition-colors ${
                      fontSizeClass === 'text-base' ? 'bg-white shadow-2xs text-sky-700' : 'text-slate-600'
                    }`}
                    title="Tamanho normal de fonte"
                  >
                    A
                  </button>
                  <button
                    onClick={() => setFontSizeClass('text-lg')}
                    className={`px-2 py-1 rounded font-bold cursor-pointer transition-colors ${
                      fontSizeClass === 'text-lg' ? 'bg-white shadow-2xs text-sky-700' : 'text-slate-600'
                    }`}
                    title="Fonte maior"
                  >
                    A+
                  </button>
                  <button
                    onClick={() => setFontSizeClass('text-xl')}
                    className={`px-2 py-1 rounded font-bold cursor-pointer transition-colors ${
                      fontSizeClass === 'text-xl' ? 'bg-white shadow-2xs text-sky-700' : 'text-slate-600'
                    }`}
                    title="Fonte extra grande"
                  >
                    A++
                  </button>
                </div>

                <div className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs gap-1">
                  {narrationState === 'stopped' && (
                    <button
                      onClick={handlePlayAudio}
                      aria-label="Ouvir texto em voz alta"
                      className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 hover:bg-sky-50 hover:text-sky-700 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-sky-600" />
                      <span>Ouvir</span>
                    </button>
                  )}
                  {narrationState === 'playing' && (
                    <>
                      <button
                        onClick={handlePauseAudio}
                        aria-label="Pausar áudio"
                        className="px-2 py-1 rounded-md bg-amber-500 text-white font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Pause className="w-3.5 h-3.5" />
                        <span>Pausar</span>
                      </button>
                      <button
                        onClick={handleStopAudio}
                        aria-label="Parar áudio"
                        className="p-1 rounded-md text-slate-600 hover:bg-slate-200 cursor-pointer"
                        title="Parar áudio"
                      >
                        <Square className="w-3.5 h-3.5 fill-current" />
                      </button>
                    </>
                  )}
                  {narrationState === 'paused' && (
                    <>
                      <button
                        onClick={handleResumeAudio}
                        aria-label="Retomar áudio"
                        className="px-2 py-1 rounded-md bg-emerald-600 text-white font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Retomar</span>
                      </button>
                      <button
                        onClick={handleStopAudio}
                        aria-label="Parar áudio"
                        className="p-1 rounded-md text-slate-600 hover:bg-slate-200 cursor-pointer"
                        title="Parar áudio"
                      >
                        <Square className="w-3.5 h-3.5 fill-current" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Paragraphs with Level 2 Paragraph Indicator and Level 3 Excerpt Highlight */}
            <div className={`space-y-4 text-slate-700 ${fontSizeClass} leading-relaxed`}>
              {currentText.paragraphs.map(p => {
                const isRelevantParagraph = hintLevel >= 2 && progHint && progHint.level2Paragraph === p.id;

                return (
                  <div
                    key={p.id}
                    className={`p-3 rounded-xl transition-all duration-300 ${
                      isRelevantParagraph
                        ? 'bg-amber-50/90 border-2 border-amber-300 ring-2 ring-amber-200/50'
                        : 'hover:bg-slate-50/70 border border-transparent'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {hintLevel >= 2 && (
                        <span
                          className={`text-[11px] font-mono px-2 py-0.5 rounded font-bold shrink-0 mt-0.5 ${
                            isRelevantParagraph
                              ? 'bg-amber-400 text-amber-950 shadow-2xs'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          § {p.id}
                        </span>
                      )}
                      <div className="flex-1">
                        {hintLevel >= 3 && isRelevantParagraph && progHint?.level3Excerpt ? (
                          <span>
                            {p.text.split(progHint.level3Excerpt).map((segment, idx, arr) => (
                              <React.Fragment key={idx}>
                                {segment}
                                {idx < arr.length - 1 && (
                                  <mark className="bg-amber-200 text-amber-950 font-medium px-1 rounded mx-0.5 border-b-2 border-amber-400">
                                    {progHint.level3Excerpt}
                                  </mark>
                                )}
                              </React.Fragment>
                            ))}
                          </span>
                        ) : (
                          <span>{p.text}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Progressive Hint Drawer */}
            <div className="pt-2 space-y-3">
              {/* Auto-suggested Tip Alert after 30s */}
              <AnimatePresence>
                {isTipSuggested && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -6 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-400 text-amber-950 shadow-xs space-y-2.5"
                    role="alert"
                    aria-live="polite"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 font-bold text-xs text-amber-950">
                        <span className="text-base" aria-hidden="true">🧭</span>
                        <span>Apoio Pedagógico da Bússola ({configuredThreshold}s de reflexão)</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold bg-amber-200/80 px-2 py-0.5 rounded-full text-amber-950">
                        {secondsElapsed}s
                      </span>
                    </div>

                    <p className="text-xs leading-relaxed text-amber-900 font-medium">
                      {tipMessage}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          acceptTip();
                          handleUseHint();
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs transition-all"
                      >
                        <Lightbulb className="w-3.5 h-3.5 fill-slate-950" />
                        <span>Ver Dica Inicial (Nível 1)</span>
                      </button>

                      <button
                        type="button"
                        onClick={dismissTip}
                        className="px-3 py-1.5 rounded-xl bg-white hover:bg-amber-100/60 text-slate-700 font-semibold text-xs border border-amber-300 cursor-pointer transition-all"
                      >
                        Continuar pensando sozinho
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {hintLevel === 0 ? (
                <button
                  type="button"
                  onClick={handleUseHint}
                  className="w-full py-2.5 px-4 rounded-xl border border-amber-300 bg-amber-50/70 hover:bg-amber-100/80 text-amber-900 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                  <span>PRECISO DE UMA DICA (Apoio Pedagógico)</span>
                </button>
              ) : (
                <div className="p-4 rounded-xl border-2 border-amber-300 bg-amber-50/80 text-amber-950 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                      <Lightbulb className="w-4 h-4 text-amber-600" />
                      <span>Dica Pedagógica Nível {hintLevel} de 3</span>
                    </div>
                    {hintLevel < 3 && (
                      <button
                        type="button"
                        onClick={handleUseHint}
                        className="text-xs font-bold text-amber-900 bg-white border border-amber-300 hover:bg-amber-100 px-2.5 py-1 rounded-lg cursor-pointer transition-colors"
                      >
                        + Mais ajuda
                      </button>
                    )}
                  </div>

                  <p className="text-xs leading-relaxed">
                    {hintLevel === 1 && (progHint?.level1Guidance || currentQuestion.learningTip)}
                    {hintLevel === 2 && (
                      <>
                        <strong>Indicação do Texto:</strong> {progHint?.level1Guidance} Foque sua atenção no{' '}
                        <strong>parágrafo § {progHint?.level2Paragraph}</strong> realçado acima.
                      </>
                    )}
                    {hintLevel === 3 && (
                      <>
                        <strong>Trecho Relevante:</strong> Veja a passagem destacada em amarelo no texto para
                        identificar a ideia que abraça a mensagem global!
                      </>
                    )}
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Right Column: Question & Options */}
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

            {/* Options with visual uppercase letters A, B, C, D */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => {
                const visualLetter = String.fromCharCode(65 + index); // A, B, C, D
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
                  optionStyle = 'border-sky-600 bg-sky-50/40 text-sky-950 font-medium ring-2 ring-sky-600/30';
                }

                return (
                  <motion.button
                    key={option.id}
                    onClick={() => handleSelectOption(option.id)}
                    disabled={hasSubmitted && isCorrectSubmitted}
                    whileHover={!hasSubmitted ? { scale: 1.01 } : {}}
                    whileTap={!hasSubmitted ? { scale: 0.99 } : {}}
                    className={`w-full text-left p-4 rounded-xl border text-sm transition-colors flex items-start gap-3 cursor-pointer ${optionStyle}`}
                  >
                    <span
                      className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 uppercase transition-colors ${
                        isSelected ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {visualLetter}
                    </span>
                    <span className="flex-1 leading-snug">{option.text}</span>
                  </motion.button>
                );
              })}
            </div>

            {/* Explanation Callout */}
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
                    <span>{chosenOption.isCorrect ? 'Síntese Perfeita!' : 'Reflexão Pedagógica:'}</span>
                  </div>
                  <p className="leading-relaxed">{chosenOption.explanation}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Footer */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
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
              ) : isCorrectSubmitted ? (
                <motion.button
                  onClick={handleNext}
                  initial={{ scale: 0.98 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-xl transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-2"
                >
                  <span>{currentIndex < questions.length - 1 ? 'Próximo Desafio' : 'Concluir Missão'}</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              ) : (
                <div className="flex gap-2">
                  {gameMode === 'aprender' && (
                    <button
                      type="button"
                      onClick={handleRetryCurrentQuestion}
                      className="flex-1 py-3 px-4 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Tentar Novamente</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex-1 py-3 px-4 bg-slate-700 hover:bg-slate-800 text-white font-semibold text-sm rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Seguir em Frente</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </section>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
