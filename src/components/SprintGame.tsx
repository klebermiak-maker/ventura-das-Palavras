import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Timer, Flame, Trophy, ArrowRight, RotateCcw, Volume2, Sparkles, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { getRandomSprintQuestions, SprintQuestion } from '../data/sprintQuestions';
import { soundManager } from '../utils/audio';
import { speechService } from '../utils/speech';
import confetti from 'canvas-confetti';

interface Props {
  onEarnScore: (points: number, stars: number, skill: 'EF05LP03', questionId: string) => void;
  onNavigate: (view: string) => void;
  onOpenRules: () => void;
}

const TOTAL_QUESTIONS = 10;
const INITIAL_TIME_SECONDS = 60;

export const SprintGame: React.FC<Props> = ({ onEarnScore, onNavigate, onOpenRules }) => {
  const [gameState, setGameState] = useState<'READY' | 'PLAYING' | 'FINISHED'>('READY');
  const [questions, setQuestions] = useState<SprintQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME_SECONDS);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalScoreEarned, setTotalScoreEarned] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [feedbackState, setFeedbackState] = useState<'correct' | 'wrong' | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startSprint = () => {
    soundManager.playClick();
    const newQuestions = getRandomSprintQuestions(TOTAL_QUESTIONS);
    setQuestions(newQuestions);
    setCurrentIndex(0);
    setTimeLeft(INITIAL_TIME_SECONDS);
    setCombo(0);
    setMaxCombo(0);
    setCorrectCount(0);
    setTotalScoreEarned(0);
    setSelectedOptionId(null);
    setFeedbackState(null);
    setGameState('PLAYING');
  };

  // Timer countdown hook
  useEffect(() => {
    if (gameState === 'PLAYING') {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleFinishGame();
            return 0;
          }
          if (prev <= 6) {
            soundManager.playPop();
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState]);

  const handleFinishGame = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    soundManager.playFanfare();
    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.6 },
    });
    setGameState('FINISHED');
  };

  const handleSelectOption = (optionId: string, isCorrect: boolean) => {
    if (feedbackState !== null || gameState !== 'PLAYING') return;

    setSelectedOptionId(optionId);
    const currentQ = questions[currentIndex];

    if (isCorrect) {
      soundManager.playCorrect();
      const newCombo = combo + 1;
      setCombo(newCombo);
      if (newCombo > maxCombo) setMaxCombo(newCombo);
      setCorrectCount(prev => prev + 1);

      // Points: 100 base + 20 per combo level
      const pointsEarned = 100 + (newCombo - 1) * 20;
      setTotalScoreEarned(prev => prev + pointsEarned);
      onEarnScore(pointsEarned, 1, 'EF05LP03', `sprint-${currentQ.id}-${Date.now()}`);

      setFeedbackState('correct');
    } else {
      soundManager.playWrong();
      setCombo(0);
      setFeedbackState('wrong');
    }

    // Fast snappy transition (450ms)
    setTimeout(() => {
      if (currentIndex < TOTAL_QUESTIONS - 1 && timeLeft > 0) {
        setCurrentIndex(prev => prev + 1);
        setSelectedOptionId(null);
        setFeedbackState(null);
      } else {
        handleFinishGame();
      }
    }, 450);
  };

  const handlePronounce = (word: string) => {
    soundManager.playClick();
    speechService.speak(word);
  };

  const currentQuestion = questions[currentIndex];
  const timerPercentage = Math.max(0, (timeLeft / INITIAL_TIME_SECONDS) * 100);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-700 font-semibold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>MODO ARCADE</span>
            <span aria-hidden="true">·</span>
            <span>EF05LP03 Acentuação Rápida</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display mt-0.5">
            Sprint de Palavras
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Responda o máximo de perguntas de acentuação antes que o tempo acabe para acumular bônus de XP!
          </p>
        </div>

        <button
          onClick={() => {
            soundManager.playClick();
            onOpenRules();
          }}
          className="text-xs font-semibold text-indigo-700 hover:text-indigo-900 bg-indigo-50 border border-indigo-200 px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer self-start sm:self-center"
        >
          Consultar Regras
        </button>
      </div>

      {/* STATE 1: READY / INSTRUCTIONS */}
      {gameState === 'READY' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center shadow-xs space-y-8"
        >
          <div className="w-20 h-20 rounded-3xl bg-amber-100 text-amber-700 flex items-center justify-center text-4xl mx-auto shadow-xs">
            ⚡
          </div>

          <div className="space-y-3 max-w-lg mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
              Pronto para o Desafio Contra o Relógio?
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Você terá <strong>60 segundos</strong> para responder a <strong>10 perguntas rápidas</strong> sobre oxítonas, paroxítonas e proparoxítonas. Acerte em sequência para ativar o <strong>Combo de XP</strong>!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl mx-auto text-xs font-medium">
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-1">
              <Timer className="w-5 h-5 text-amber-600 mx-auto" />
              <p className="font-bold text-slate-900">60 Segundos</p>
              <p className="text-slate-500">Cronômetro em contagem regressiva</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-1">
              <Sparkles className="w-5 h-5 text-indigo-600 mx-auto" />
              <p className="font-bold text-slate-900">10 Perguntas</p>
              <p className="text-slate-500">Classificação e regras de acento</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-1">
              <Flame className="w-5 h-5 text-rose-600 mx-auto" />
              <p className="font-bold text-slate-900">Bônus de Combo</p>
              <p className="text-slate-500">Mais acertos = Mais pontos extras</p>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={startSprint}
              className="w-full sm:w-auto px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm rounded-xl transition-all shadow-sm hover:shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>Iniciar Sprint de Palavras</span>
            </button>
            <button
              onClick={() => onNavigate('hub')}
              className="w-full sm:w-auto px-6 py-3.5 border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-semibold rounded-xl cursor-pointer"
            >
              Voltar ao Hub
            </button>
          </div>
        </motion.div>
      )}

      {/* STATE 2: PLAYING */}
      {gameState === 'PLAYING' && currentQuestion && (
        <div className="space-y-6">
          {/* HUD: Timer Bar, Question Counter, Combo Streak */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              {/* Question Count */}
              <div className="font-bold text-slate-700">
                Questão {currentIndex + 1} de {TOTAL_QUESTIONS}
              </div>

              {/* Combo Streak */}
              {combo > 1 ? (
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-1 font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200"
                >
                  <Flame className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                  <span>Combo {combo}x! (+{combo * 20} XP)</span>
                </motion.div>
              ) : (
                <div className="text-slate-400">Acerte em sequência para combo!</div>
              )}

              {/* Timer Number */}
              <div className={`font-bold flex items-center gap-1 ${timeLeft <= 10 ? 'text-rose-600 animate-pulse' : 'text-slate-900'}`}>
                <Timer className="w-4 h-4" />
                <span className="text-base tabular-nums">{timeLeft}s</span>
              </div>
            </div>

            {/* Visual Timer Progress Bar */}
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  timeLeft <= 10 ? 'bg-rose-500' : timeLeft <= 25 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${timerPercentage}%` }}
              />
            </div>
          </div>

          {/* Question Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.18 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-10 space-y-8"
            >
              {/* Target Word Hero */}
              <div className="flex flex-col items-center justify-center text-center space-y-2 py-4 bg-slate-50/70 rounded-2xl border border-slate-100">
                <span className="text-xs font-mono uppercase tracking-widest text-slate-400 font-semibold">
                  Palavra em Destaque
                </span>
                <div className="flex items-center gap-3">
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display tracking-wider">
                    {currentQuestion.word}
                  </h2>
                  <button
                    onClick={() => handlePronounce(currentQuestion.word)}
                    className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg transition-colors cursor-pointer"
                    title="Ouvir pronúncia"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Question Prompt */}
              <div className="text-center">
                <p className="text-base sm:text-lg font-bold text-slate-800 leading-snug">
                  {currentQuestion.prompt}
                </p>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 gap-3 max-w-xl mx-auto">
                {currentQuestion.options.map(opt => {
                  const isSelected = selectedOptionId === opt.id;
                  let style = 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800';

                  if (feedbackState !== null) {
                    if (opt.isCorrect) {
                      style = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold ring-2 ring-emerald-400';
                    } else if (isSelected && !opt.isCorrect) {
                      style = 'bg-rose-50 border-rose-400 text-rose-950 ring-2 ring-rose-400';
                    } else {
                      style = 'bg-slate-50 border-slate-200 text-slate-400 opacity-50';
                    }
                  }

                  return (
                    <motion.button
                      key={opt.id}
                      onClick={() => handleSelectOption(opt.id, opt.isCorrect)}
                      disabled={feedbackState !== null}
                      whileHover={feedbackState === null ? { scale: 1.01 } : {}}
                      whileTap={feedbackState === null ? { scale: 0.99 } : {}}
                      className={`p-4 rounded-2xl border-2 text-left font-medium text-sm sm:text-base transition-colors flex items-center justify-between cursor-pointer ${style}`}
                    >
                      <span>{opt.text}</span>
                      {feedbackState !== null && opt.isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      )}
                      {feedbackState !== null && isSelected && !opt.isCorrect && (
                        <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Instant feedback explanation */}
              {feedbackState && (
                <div className={`p-3 rounded-xl text-xs text-center font-medium ${
                  feedbackState === 'correct' ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-rose-50 text-rose-900 border border-rose-200'
                }`}>
                  {currentQuestion.explanation}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* STATE 3: FINISHED */}
      {gameState === 'FINISHED' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center shadow-xs space-y-8"
        >
          <div className="w-20 h-20 rounded-3xl bg-amber-400 text-white flex items-center justify-center text-4xl mx-auto shadow-md">
            🏆
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
              Sprint Concluído!
            </h2>
            <p className="text-sm text-slate-600">
              {correctCount >= 8
                ? 'Espetacular! Você demonstrou rapidez e precisão nas regras de acentuação!'
                : correctCount >= 5
                ? 'Muito bem! Seu raciocínio está afiado, continue praticando!'
                : 'Bom esforço! Consulte as regras e tente novamente para bater seu recorde!'}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-xl mx-auto text-xs font-mono">
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Acertos</span>
              <span className="text-xl sm:text-2xl font-bold text-emerald-600 font-display tabular-nums">
                {correctCount} / {TOTAL_QUESTIONS}
              </span>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Tempo Restante</span>
              <span className="text-xl sm:text-2xl font-bold text-slate-900 font-display tabular-nums">
                {timeLeft}s
              </span>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Maior Combo</span>
              <span className="text-xl sm:text-2xl font-bold text-amber-500 font-display tabular-nums">
                {maxCombo}x 🔥
              </span>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">XP Ganho</span>
              <span className="text-xl sm:text-2xl font-bold text-indigo-600 font-display tabular-nums">
                +{totalScoreEarned} pts
              </span>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={startSprint}
              className="w-full sm:w-auto px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm rounded-xl transition-all shadow-sm hover:shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Jogar Novo Sprint</span>
            </button>
            <button
              onClick={() => onNavigate('hub')}
              className="w-full sm:w-auto px-6 py-3.5 border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-semibold rounded-xl cursor-pointer"
            >
              Voltar ao Hub
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
