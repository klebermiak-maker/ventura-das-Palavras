import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  Sparkles,
  HelpCircle,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { EXPLICIT_QUESTIONS, EXPLICIT_TEXTS } from '../data/bnccContent';
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
    skill: 'EF15LP03',
    questionId: string,
    details?: AttemptDetails
  ) => void;
  onNavigate: (view: string) => void;
  completedQuestions: Record<string, boolean>;
  initialGameMode?: GameMode;
  onSessionProgress?: (missionId: string, questionIndex: number, totalQuestions: number) => void;
}

export const ExplicitasGame: React.FC<Props> = ({
  onEarnScore,
  onNavigate,
  completedQuestions,
  initialGameMode = 'aprender',
  onSessionProgress,
}) => {
  // Stable shuffled pool created once at session start
  const [questions] = useState(() => shuffleQuestionsAndOptions(EXPLICIT_QUESTIONS));
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
  const currentText = EXPLICIT_TEXTS.find(t => t.id === currentQuestion.textId) || EXPLICIT_TEXTS[0];

  // Auto-suggest pedagogical hint when student spends longer than the teacher-configured threshold
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

  // Report session progress on question index change
  useEffect(() => {
    if (onSessionProgress) {
      onSessionProgress('explicitas', currentIndex, questions.length);
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

      // Score calculation: 100 on 1st try without hint, 80 with hint, 60 on retry
      const earnedPoints = isFirstTry && !withHint ? 100 : withHint ? 80 : 60;
      const earnedStars = 1;

      onEarnScore(earnedPoints, earnedStars, 'EF15LP03', currentQuestion.id, {
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
      // Record unsuccessful attempt for learning diagnostic
      onEarnScore(10, 0, 'EF15LP03', currentQuestion.id, {
        firstTryCorrect: false,
        withHint: withHint,
        hintsUsedCount: hintLevel,
        attemptsCount: newAttemptsCount,
        gameMode,
      });
    }
  };

  const handleRetryCurrent = () => {
    soundManager.playClick();
    setSelectedOptionId(null);
    setHasSubmitted(false);
    setIsCorrectSubmitted(false);
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

  // Audio accessibility handlers
  const handlePlayNarration = () => {
    if (narrationState === 'paused') {
      speechService.resume();
      setNarrationState('playing');
    } else {
      const fullTextToRead = `${currentText.title}. ${currentText.paragraphs.map(p => p.text).join(' ')}. Pergunta: ${currentQuestion.question}`;
      speechService.speak(fullTextToRead, () => setNarrationState('stopped'));
      setNarrationState('playing');
    }
  };

  const handlePauseNarration = () => {
    speechService.pause();
    setNarrationState('paused');
  };

  const handleStopNarration = () => {
    speechService.stop();
    setNarrationState('stopped');
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
            As respostas estão <strong>escritas diretamente no texto</strong>. Leia com atenção e use o botão de dica caso precise de apoio!
          </p>
        </div>

        {/* Controls: Mode Switch, Lives (in Desafio) & Font Size Accessibility */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Game Mode Selector */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => {
                soundManager.playClick();
                setGameMode('aprender');
              }}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
                gameMode === 'aprender'
                  ? 'bg-white shadow-2xs text-emerald-800'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Modo Aprender</span>
            </button>
            <button
              onClick={() => {
                soundManager.playClick();
                setGameMode('desafio');
              }}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
                gameMode === 'desafio'
                  ? 'bg-amber-400 text-slate-950 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-600" />
              <span>Modo Desafio</span>
            </button>
          </div>

          {gameMode === 'desafio' && (
            <VidasAprendizado
              lives={lives}
              maxLives={3}
              onRecoverLives={() => setLives(3)}
              onReturnToHub={() => onNavigate('hub')}
              missionName="Detetive dos Fatos"
              pedagogicalTip="No Modo Desafio, cada erro consome um coração. No Modo Aprender, você pode tentar livremente!"
            />
          )}

          {/* Accessible Font Size Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setFontSizeClass('text-base')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                fontSizeClass === 'text-base' ? 'bg-white shadow-2xs text-slate-900 font-bold' : 'text-slate-600'
              }`}
              title="Tamanho de fonte normal"
            >
              A
            </button>
            <button
              onClick={() => setFontSizeClass('text-lg')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                fontSizeClass === 'text-lg' ? 'bg-white shadow-2xs text-slate-900 font-bold' : 'text-slate-600'
              }`}
              title="Tamanho de fonte grande"
            >
              A+
            </button>
            <button
              onClick={() => setFontSizeClass('text-xl')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                fontSizeClass === 'text-xl' ? 'bg-white shadow-2xs text-slate-900 font-bold' : 'text-slate-600'
              }`}
              title="Tamanho de fonte muito grande"
            >
              A++
            </button>
          </div>

          <div className="text-xs font-mono font-bold text-slate-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
            Pergunta {currentIndex + 1} de {questions.length}
          </div>
        </div>
      </div>

      {/* Main 2-Zone Layout */}
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
          <section className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-7 space-y-5">
            {/* Text Header with Full Audio Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
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

              {/* Complete Accessible Audio Controls (Play, Pause, Stop) */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto">
                {narrationState !== 'playing' ? (
                  <button
                    onClick={handlePlayNarration}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white shadow-2xs rounded-lg flex items-center gap-1.5 cursor-pointer"
                    title="Ouvir leitura em voz alta"
                  >
                    <Play className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
                    <span>{narrationState === 'paused' ? 'Continuar' : 'Ouvir Texto'}</span>
                  </button>
                ) : (
                  <button
                    onClick={handlePauseNarration}
                    className="px-3 py-1.5 text-xs font-semibold text-amber-900 bg-amber-100 rounded-lg flex items-center gap-1.5 cursor-pointer"
                    title="Pausar áudio"
                  >
                    <Pause className="w-3.5 h-3.5 text-amber-700 fill-amber-700" />
                    <span>Pausar</span>
                  </button>
                )}

                {narrationState !== 'stopped' && (
                  <button
                    onClick={handleStopNarration}
                    className="p-1.5 text-slate-500 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                    title="Parar áudio"
                    aria-label="Parar áudio"
                  >
                    <Square className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Paragraphs with Progressive Highlighting */}
            <div className={`space-y-4 text-slate-700 leading-relaxed ${fontSizeClass}`}>
              {currentText.paragraphs.map(p => {
                const isTargetParagraph = p.id === currentQuestion.paragraphRef;
                const shouldHighlightParagraph = isTargetParagraph && hintLevel >= 2;
                const shouldHighlightExcerpt = isTargetParagraph && hintLevel >= 3 && p.highlightClue;

                return (
                  <div
                    key={p.id}
                    className={`p-3.5 rounded-2xl transition-all ${
                      shouldHighlightParagraph
                        ? 'bg-amber-50/90 border border-amber-300 ring-2 ring-amber-200/50'
                        : 'bg-transparent border border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400 block">
                        Parágrafo {p.id}
                      </span>
                      {shouldHighlightParagraph && (
                        <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded-full">
                          💡 Parágrafo com a resposta
                        </span>
                      )}
                    </div>
                    <p>
                      {shouldHighlightExcerpt && p.highlightClue ? (
                        <>
                          {p.text.split(p.highlightClue)[0]}
                          <mark className="bg-amber-200 text-amber-950 font-bold px-1 rounded-sm">
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

            {/* Progressive Hint Drawer */}
            <div className="pt-3 border-t border-slate-100 space-y-3">
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
                        <span className="text-base" aria-hidden="true">🕵️‍♂️</span>
                        <span>Apoio Pedagógico Sugerido ({configuredThreshold}s de reflexão)</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold bg-amber-200/80 px-2 py-0.5 rounded-full text-amber-950">
                        {secondsElapsed}s decorridos
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
                        <span>Sim, ver primeira ajuda</span>
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

              <div className="flex items-center justify-between flex-wrap gap-2">
                <button
                  onClick={handleUseHint}
                  disabled={hintLevel >= 3}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shadow-2xs ${
                    hintLevel >= 3
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                      : 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 border border-amber-500/30'
                  }`}
                >
                  <Lightbulb className="w-4 h-4 text-slate-950 fill-slate-950" />
                  <span>
                    {hintLevel === 0
                      ? 'PRECISO DE UMA DICA'
                      : hintLevel === 1
                      ? 'Dica 2: Indicar o Parágrafo'
                      : hintLevel === 2
                      ? 'Dica 3: Destacar Trecho Exato'
                      : 'Todas as Dicas Liberadas'}
                  </span>
                </button>

                <span className="text-xs text-slate-500 font-mono">
                  {hintLevel > 0 ? `Nível de apoio: ${hintLevel}/3` : 'Apoio pedagógico opcional'}
                </span>
              </div>

              {/* Display of Active Progressive Hint */}
              {hintLevel > 0 && currentQuestion.progressiveHint && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1.5"
                >
                  <div className="flex items-center gap-1.5 font-bold text-amber-900">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Dica {hintLevel} de 3:</span>
                  </div>
                  {hintLevel >= 1 && (
                    <p className="leading-relaxed">
                      <strong>Orientação:</strong> {currentQuestion.progressiveHint.level1Guidance}
                    </p>
                  )}
                  {hintLevel >= 2 && (
                    <p className="leading-relaxed text-amber-900 pt-1 border-t border-amber-200/60 font-semibold">
                      📍 <strong>Localização:</strong> A resposta exata encontra-se no{' '}
                      <u>Parágrafo {currentQuestion.progressiveHint.level2Paragraph}</u> do texto.
                    </p>
                  )}
                  {hintLevel >= 3 && (
                    <p className="leading-relaxed text-emerald-950 pt-1 border-t border-amber-200/60 font-bold bg-amber-100/70 p-2 rounded-xl">
                      🔍 <strong>Trecho em destaque:</strong> O texto foi marcado em amarelo para facilitar sua conferência!
                    </p>
                  )}
                </motion.div>
              )}
            </div>
          </section>

          {/* Right Column: Question & Multiple-Choice Sandbox (5 cols on lg) */}
          <section className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-7 space-y-5">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                Questão {currentIndex + 1}
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-display mt-2 leading-snug">
                {currentQuestion.question}
              </h3>
            </div>

            {/* Options List */}
            <div className="space-y-3" role="radiogroup" aria-label="Alternativas da questão">
              {currentQuestion.options.map((opt, idx) => {
                const isSelected = selectedOptionId === opt.id;
                const letter = opt.displayLetter || ['A', 'B', 'C', 'D'][idx];

                let optionStyle = 'bg-white border-slate-200 hover:border-emerald-300 hover:bg-slate-50 text-slate-800';
                if (isSelected && !hasSubmitted) {
                  optionStyle = 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-400/50 text-emerald-950 font-semibold';
                } else if (hasSubmitted) {
                  if (opt.isCorrect) {
                    optionStyle = 'bg-emerald-100 border-emerald-500 text-emerald-950 font-bold';
                  } else if (isSelected && !opt.isCorrect) {
                    optionStyle = 'bg-rose-50 border-rose-400 text-rose-950';
                  } else {
                    optionStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                  }
                }

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    disabled={hasSubmitted && isCorrectSubmitted}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${optionStyle}`}
                    aria-checked={isSelected}
                    role="radio"
                  >
                    <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-mono font-bold shrink-0 shadow-2xs ${
                      isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {letter}
                    </span>
                    <span className="text-xs sm:text-sm leading-relaxed pt-0.5">{opt.text}</span>
                  </button>
                );
              })}
            </div>

            {/* Confirmation & Feedback Box */}
            {!hasSubmitted ? (
              <button
                onClick={handleConfirmAnswer}
                disabled={!selectedOptionId}
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirmar Resposta</span>
              </button>
            ) : (
              <div className="space-y-4 pt-1">
                {/* Pedagogical Explanation */}
                <div className={`p-4 rounded-2xl border text-xs leading-relaxed ${
                  isCorrectSubmitted
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    : 'bg-amber-50 border-amber-200 text-amber-950'
                }`}>
                  <p className="font-bold flex items-center gap-1.5 mb-1 text-sm">
                    {isCorrectSubmitted ? '🎉 Resposta Correta!' : '💡 Vamos Pensar Juntos:'}
                  </p>
                  <p>{chosenOption?.explanation || 'Leia com calma o parágrafo destacado.'}</p>
                </div>

                {/* Actions: Next question OR Retry in Modo Aprender */}
                <div className="flex items-center gap-3">
                  {!isCorrectSubmitted && gameMode === 'aprender' && (
                    <button
                      onClick={handleRetryCurrent}
                      className="flex-1 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 border border-slate-300"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Tentar Novamente</span>
                    </button>
                  )}

                  <button
                    onClick={handleNext}
                    className="flex-1 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2"
                  >
                    <span>{currentIndex < questions.length - 1 ? 'Próxima Questão' : 'Concluir Missão'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </section>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
