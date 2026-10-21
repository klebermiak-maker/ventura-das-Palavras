import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Volume2,
  CheckCircle2,
  XCircle,
  ArrowRight,
  BookOpen,
  Award,
  Zap,
  HelpCircle,
  RotateCcw,
  Target,
  ShieldCheck,
  AlertTriangle,
  Flame,
  ChevronRight,
  Info,
  Check,
  Search,
  Shuffle,
} from 'lucide-react';
import {
  CLASSIFY_CHALLENGES,
  CHOOSE_ACCENT_CHALLENGES,
  FIND_INCORRECT_CHALLENGES,
  ACENTUACAO_RULES_GUIDE,
  AnyAcentuacaoChallenge,
  ClassifyChallenge,
  ChooseAccentChallenge,
  FindIncorrectChallenge,
} from '../data/acentuacaoChallenges';
import { soundManager } from '../utils/audio';
import { speechService } from '../utils/speech';
import { shuffleArray } from '../utils/questionShuffle';
import confetti from 'canvas-confetti';
import { VidasAprendizado } from './VidasAprendizado';
import { GameMode } from '../types/game';

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
    skill: 'EF05LP03',
    questionId: string,
    details?: AttemptDetails
  ) => void;
  onNavigate: (view: string) => void;
  onOpenRules: () => void;
  completedQuestions: Record<string, boolean>;
  initialGameMode?: GameMode;
  onSessionProgress?: (missionId: string, questionIndex: number, totalQuestions: number) => void;
}

type StageFilter = 'todos' | 'classificar' | 'escolher_grafia' | 'identificar_inadequada';

const generateShuffledChallenges = (stage: StageFilter): AnyAcentuacaoChallenge[] => {
  const basePool: AnyAcentuacaoChallenge[] =
    stage === 'classificar'
      ? CLASSIFY_CHALLENGES
      : stage === 'escolher_grafia'
      ? CHOOSE_ACCENT_CHALLENGES
      : stage === 'identificar_inadequada'
      ? FIND_INCORRECT_CHALLENGES
      : [...CLASSIFY_CHALLENGES, ...CHOOSE_ACCENT_CHALLENGES, ...FIND_INCORRECT_CHALLENGES];

  return shuffleArray(basePool).map(challenge => {
    if (challenge.type === 'escolher_grafia') {
      const ch = challenge as ChooseAccentChallenge;
      return {
        ...ch,
        options: shuffleArray(ch.options),
      };
    }
    if (challenge.type === 'identificar_inadequada') {
      const findCh = challenge as FindIncorrectChallenge;
      return {
        ...findCh,
        words: shuffleArray(findCh.words),
      };
    }
    return challenge;
  });
};

export const AcentuacaoGame: React.FC<Props> = ({
  onEarnScore,
  onNavigate,
  onOpenRules,
  completedQuestions,
  initialGameMode = 'aprender',
  onSessionProgress,
}) => {
  // Current active stage mode & Shuffled challenges
  const [selectedStage, setSelectedStage] = useState<StageFilter>('todos');
  const [challenges, setChallenges] = useState<AnyAcentuacaoChallenge[]>(() => generateShuffledChallenges('todos'));
  const [currentIndex, setCurrentIndex] = useState(0);

  // Game Mode & Attempt Tracking
  const [gameMode, setGameMode] = useState<GameMode>(initialGameMode);
  const [attemptsOnCurrent, setAttemptsOnCurrent] = useState<number>(0);

  // Classification Challenge State
  const [selectedSyllableIdx, setSelectedSyllableIdx] = useState<number | null>(null);
  const [selectedClass, setSelectedClass] = useState<'oxitona' | 'paroxitona' | 'proparoxitona' | null>(null);

  // Multiple Choice / Choose Accent Challenge State
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  // Find Incorrect Challenge State
  const [selectedWordId, setSelectedWordId] = useState<string | null>(null);

  // Common Gameplay State
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [lives, setLives] = useState(3);
  const [isRuleGuideOpen, setIsRuleGuideOpen] = useState(false);
  const [activeRuleTab, setActiveRuleTab] = useState<'oxitonas' | 'paroxitonas' | 'proparoxitonas' | 'monossilabos'>('proparoxitonas');

  const currentChallenge = challenges[currentIndex] || challenges[0];

  // Reset answer states on next
  const resetSelectionStates = () => {
    setSelectedSyllableIdx(null);
    setSelectedClass(null);
    setSelectedOptionId(null);
    setSelectedWordId(null);
    setHasSubmitted(false);
    setIsAnswerCorrect(null);
  };

  const handleStageChange = (stage: StageFilter) => {
    soundManager.playClick();
    setSelectedStage(stage);
    setChallenges(generateShuffledChallenges(stage));
    setCurrentIndex(0);
    resetSelectionStates();
  };

  const handleReshuffle = () => {
    soundManager.playClick();
    setChallenges(generateShuffledChallenges(selectedStage));
    setCurrentIndex(0);
    resetSelectionStates();
  };

  const handleRecoverLives = () => {
    setLives(3);
    resetSelectionStates();
  };

  const handlePronounce = (textToSpeak: string) => {
    soundManager.playClick();
    speechService.speak(textToSpeak);
  };

  // Session progress notification
  useEffect(() => {
    if (onSessionProgress) {
      onSessionProgress('acentuacao', currentIndex, challenges.length);
    }
  }, [currentIndex, challenges.length, onSessionProgress]);

  // Determine if student has completed current interaction form
  const canSubmit = () => {
    if (hasSubmitted) return false;
    if (gameMode === 'desafio' && lives <= 0) return false;
    if (currentChallenge.type === 'classificar') {
      return selectedSyllableIdx !== null && selectedClass !== null;
    }
    if (currentChallenge.type === 'escolher_grafia') {
      return selectedOptionId !== null;
    }
    if (currentChallenge.type === 'identificar_inadequada') {
      return selectedWordId !== null;
    }
    return false;
  };

  // Check the answer based on challenge type
  const handleSubmitAnswer = () => {
    if (!canSubmit()) return;

    const newAttempts = attemptsOnCurrent + 1;
    setAttemptsOnCurrent(newAttempts);
    setHasSubmitted(true);

    let isCorrect = false;

    if (currentChallenge.type === 'classificar') {
      const clf = currentChallenge as ClassifyChallenge;
      const syllableRight = selectedSyllableIdx === clf.tonicIndex;
      const classRight = selectedClass === clf.correctClassification;
      isCorrect = syllableRight && classRight;
    } else if (currentChallenge.type === 'escolher_grafia') {
      const ch = currentChallenge as ChooseAccentChallenge;
      const chosen = ch.options.find(o => o.id === selectedOptionId);
      isCorrect = Boolean(chosen?.isCorrect);
    } else if (currentChallenge.type === 'identificar_inadequada') {
      const err = currentChallenge as FindIncorrectChallenge;
      const chosenWord = err.words.find(w => w.id === selectedWordId);
      isCorrect = Boolean(chosenWord?.isIncorrect);
    }

    setIsAnswerCorrect(isCorrect);

    if (isCorrect) {
      soundManager.playCorrect();
      const points = newAttempts === 1 ? 120 : 80;
      onEarnScore(points, 1, 'EF05LP03', currentChallenge.id, {
        firstTryCorrect: newAttempts === 1,
        withHint: false,
        hintsUsedCount: 0,
        attemptsCount: newAttempts,
        gameMode,
      });
      confetti({
        particleCount: 45,
        spread: 65,
        origin: { y: 0.7 },
      });
    } else {
      soundManager.playWrong();
      if (gameMode === 'desafio') {
        setLives(prev => Math.max(0, prev - 1));
      }
      onEarnScore(30, 0, 'EF05LP03', currentChallenge.id, {
        firstTryCorrect: false,
        withHint: false,
        hintsUsedCount: 0,
        attemptsCount: newAttempts,
        gameMode,
      });
    }
  };

  const handleRetryCurrentChallenge = () => {
    soundManager.playClick();
    setHasSubmitted(false);
    setIsAnswerCorrect(null);
    setSelectedSyllableIdx(null);
    setSelectedClass(null);
    setSelectedOptionId(null);
    setSelectedWordId(null);
  };

  const handleNextChallenge = () => {
    soundManager.playClick();
    resetSelectionStates();
    setAttemptsOnCurrent(0);

    if (currentIndex < challenges.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      soundManager.playFanfare();
      onNavigate('hub');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Skill Banner & Top Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-indigo-700 font-semibold">
            <span>HABILIDADE BNCC EF05LP03</span>
            <span aria-hidden="true">·</span>
            <span>Oxítonas, Paroxítonas e Proparoxítonas</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display mt-1 flex items-center gap-2.5">
            <span>Mestre da Acentuação BNCC</span>
            <span className="text-xs font-mono font-bold text-amber-700 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-lg">
              Desafios Progressivos
            </span>
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Domine as regras da acentuação gráfica através de três modalidades: <strong>classificar a sílaba tônica</strong>, <strong>escolher a grafia correta</strong> e <strong>identificar palavras com acentuação inadequada</strong>!
          </p>
        </div>

        {/* Top Header Controls: Vidas de Aprendizado, Guia de Regras & Contador */}
        <div className="flex flex-wrap items-center gap-3">
          <VidasAprendizado
            lives={lives}
            maxLives={3}
            onRecoverLives={handleRecoverLives}
            onReturnToHub={() => onNavigate('hub')}
            missionName="Mestre da Acentuação"
            pedagogicalTip="Pronuncie a palavra chamando-a como se estivesse no portão. A sílaba que mais se prolonga é a tônica! Todas as proparoxítonas recebem acento e oxítonas em A, E, O também."
          />

          {/* Interactive In-Game Rules Guide Button */}
          <button
            onClick={() => {
              soundManager.playClick();
              setIsRuleGuideOpen(true);
            }}
            className="px-3.5 py-2 rounded-xl border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span>Guia de Regras BNCC</span>
          </button>

          {/* Reshuffle Challenges Button */}
          <button
            onClick={handleReshuffle}
            title="Embaralhar desafios e opções"
            className="px-3.5 py-2 rounded-xl border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs hover:scale-105 active:scale-95"
          >
            <Shuffle className="w-4 h-4 text-indigo-600" />
            <span>Embaralhar 🔀</span>
          </button>

          <div className="text-xs font-mono font-bold text-slate-700 bg-slate-100 border border-slate-200 px-3 py-2 rounded-xl shrink-0">
            Desafio {currentIndex + 1} de {challenges.length}
          </div>
        </div>
      </div>

      {/* Stage / Mode Selector Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200">
        <button
          onClick={() => handleStageChange('todos')}
          className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
            selectedStage === 'todos'
              ? 'bg-white text-indigo-900 shadow-xs ring-1 ring-slate-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Trilha Completa (15 Desafios)</span>
        </button>

        <button
          onClick={() => handleStageChange('classificar')}
          className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
            selectedStage === 'classificar'
              ? 'bg-white text-emerald-800 shadow-xs ring-1 ring-slate-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>1. Classificar Palavras (6)</span>
        </button>

        <button
          onClick={() => handleStageChange('escolher_grafia')}
          className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
            selectedStage === 'escolher_grafia'
              ? 'bg-white text-sky-800 shadow-xs ring-1 ring-slate-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>2. Escolher Grafia Correta (5)</span>
        </button>

        <button
          onClick={() => handleStageChange('identificar_inadequada')}
          className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
            selectedStage === 'identificar_inadequada'
              ? 'bg-white text-rose-800 shadow-xs ring-1 ring-slate-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Search className="w-3.5 h-3.5 text-rose-500" />
          <span>3. Caçador de Erros (4)</span>
        </button>
      </div>

      {/* Main Sandbox Interactive Stage with Framer Motion AnimatePresence */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentChallenge.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6"
        >
          {/* Challenge Type Badge & Title */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <span
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold uppercase tracking-wider ${
                  currentChallenge.type === 'classificar'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : currentChallenge.type === 'escolher_grafia'
                    ? 'bg-sky-100 text-sky-800 border border-sky-200'
                    : 'bg-rose-100 text-rose-800 border border-rose-200'
                }`}
              >
                {currentChallenge.type === 'classificar'
                  ? 'Fase 1: Classificação'
                  : currentChallenge.type === 'escolher_grafia'
                  ? 'Fase 2: Escolha de Grafia'
                  : 'Fase 3: Caçador de Erros'}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {currentChallenge.levelTitle}
              </span>
            </div>

            <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full flex items-center gap-1.5 self-start sm:self-auto">
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>Valendo +120 XP</span>
            </span>
          </div>

          {/* ======================================================== */}
          {/* MODALIDADE 1: CLASSIFICAR PALAVRA (SÍLABA TÔNICA + TIPO) */}
          {/* ======================================================== */}
          {currentChallenge.type === 'classificar' && (() => {
            const clf = currentChallenge as ClassifyChallenge;
            return (
              <div className="space-y-8">
                {/* Word Display & Audio */}
                <div className="flex flex-col items-center justify-center py-6 bg-slate-50/90 rounded-2xl border border-slate-100 text-center space-y-4">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                    Palavra para Classificar
                  </span>

                  <div className="flex items-center justify-center gap-3">
                    <h2 className="text-4xl sm:text-5xl font-black text-slate-900 font-display tracking-wide">
                      {clf.word}
                    </h2>
                    <motion.button
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => handlePronounce(clf.word)}
                      className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs transition-colors cursor-pointer"
                      title="Ouvir pronúncia da palavra"
                    >
                      <Volume2 className="w-5 h-5" />
                    </motion.button>
                  </div>
                  <p className="text-xs text-slate-500 max-w-md">
                    Clique na sílaba mais forte (tônica) e depois selecione se é Oxítona, Paroxítona ou Proparoxítona.
                  </p>
                </div>

                {/* Step 1: Select Tonic Syllable */}
                <div className="space-y-3">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between">
                    <span>1. Qual é a sílaba tônica (mais forte)?</span>
                    <span className="text-[11px] text-slate-400 font-normal">Clique na sílaba tônica</span>
                  </label>

                  <div className="flex flex-wrap items-center justify-center gap-3">
                    {clf.syllables.map((syl, idx) => {
                      const isSelected = selectedSyllableIdx === idx;
                      const isTargetCorrect = clf.tonicIndex === idx;

                      let buttonStyle = 'bg-slate-50 hover:bg-indigo-50 border-slate-200 text-slate-800';
                      if (hasSubmitted) {
                        if (isTargetCorrect) {
                          buttonStyle = 'bg-emerald-100 border-emerald-400 text-emerald-950 font-black ring-2 ring-emerald-300';
                        } else if (isSelected && !isTargetCorrect) {
                          buttonStyle = 'bg-rose-100 border-rose-400 text-rose-950 line-through';
                        }
                      } else if (isSelected) {
                        buttonStyle = 'bg-indigo-600 border-indigo-600 text-white font-black shadow-md scale-105';
                      }

                      return (
                        <button
                          key={idx}
                          type="button"
                          disabled={hasSubmitted || lives <= 0}
                          onClick={() => {
                            soundManager.playClick();
                            setSelectedSyllableIdx(idx);
                          }}
                          className={`px-5 py-3 rounded-2xl border text-lg sm:text-xl font-bold transition-all cursor-pointer ${buttonStyle}`}
                        >
                          {syl}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Step 2: Select Classification */}
                <div className="space-y-3">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between">
                    <span>2. Pela posição da sílaba tônica, ela é:</span>
                    <span className="text-[11px] text-slate-400 font-normal">Escolha uma classificação</span>
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {(
                      [
                        { id: 'oxitona', label: 'Oxítona', position: 'Última sílaba mais forte', color: 'sky' },
                        { id: 'paroxitona', label: 'Paroxítona', position: 'Penúltima sílaba mais forte', color: 'amber' },
                        { id: 'proparoxitona', label: 'Proparoxítona', position: 'Antepenúltima sílaba mais forte', color: 'emerald' },
                      ] as const
                    ).map(item => {
                      const isSelected = selectedClass === item.id;
                      const isTargetCorrect = clf.correctClassification === item.id;

                      let style = 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800';
                      if (hasSubmitted) {
                        if (isTargetCorrect) {
                          style = 'bg-emerald-50 border-emerald-400 text-emerald-950 ring-2 ring-emerald-300 font-bold';
                        } else if (isSelected && !isTargetCorrect) {
                          style = 'bg-rose-50 border-rose-400 text-rose-950 line-through';
                        }
                      } else if (isSelected) {
                        style = 'bg-indigo-50 border-indigo-500 text-indigo-950 ring-2 ring-indigo-200 font-bold shadow-xs';
                      }

                      return (
                        <button
                          key={item.id}
                          type="button"
                          disabled={hasSubmitted || lives <= 0}
                          onClick={() => {
                            soundManager.playClick();
                            setSelectedClass(item.id);
                          }}
                          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-1 ${style}`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-base font-extrabold font-display">
                              {item.label}
                            </span>
                            {hasSubmitted && isTargetCorrect && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            )}
                          </div>
                          <span className="text-[11px] text-slate-500">
                            {item.position}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ======================================================== */}
          {/* MODALIDADE 2: ESCOLHER A GRAFIA ACENTUADA CORRETA        */}
          {/* ======================================================== */}
          {currentChallenge.type === 'escolher_grafia' && (() => {
            const ch = currentChallenge as ChooseAccentChallenge;
            return (
              <div className="space-y-6">
                <div className="text-center py-4 bg-slate-50/80 rounded-2xl border border-slate-100 space-y-2">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                    Pergunta de Fixação Ortográfica
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
                    {ch.title}
                  </h3>
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => handlePronounce(ch.word)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold hover:bg-indigo-100 transition-colors cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Ouvir a palavra "{ch.word}"</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Selecione a opção graficamente correta de acordo com as regras BNCC:
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {ch.options.map(opt => {
                      const isSelected = selectedOptionId === opt.id;

                      let style = 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800';
                      if (hasSubmitted) {
                        if (opt.isCorrect) {
                          style = 'bg-emerald-50 border-emerald-400 text-emerald-950 ring-2 ring-emerald-300 font-bold';
                        } else if (isSelected && !opt.isCorrect) {
                          style = 'bg-rose-50 border-rose-400 text-rose-950 line-through';
                        }
                      } else if (isSelected) {
                        style = 'bg-sky-50 border-sky-500 text-sky-950 ring-2 ring-sky-200 font-bold shadow-xs';
                      }

                      return (
                        <button
                          key={opt.id}
                          type="button"
                          disabled={hasSubmitted || lives <= 0}
                          onClick={() => {
                            soundManager.playClick();
                            setSelectedOptionId(opt.id);
                          }}
                          className={`p-5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-1 ${style}`}
                        >
                          <span className="text-2xl sm:text-3xl font-black font-display">
                            {opt.text}
                          </span>
                          {hasSubmitted && opt.isCorrect && (
                            <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1 mt-1">
                              <Check className="w-3.5 h-3.5" />
                              <span>Correta!</span>
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ======================================================== */}
          {/* MODALIDADE 3: CAÇADOR DE ACENTUAÇÃO INADEQUADA (ERROS)   */}
          {/* ======================================================== */}
          {currentChallenge.type === 'identificar_inadequada' && (() => {
            const err = currentChallenge as FindIncorrectChallenge;
            return (
              <div className="space-y-6">
                <div className="text-center py-4 bg-rose-50/60 rounded-2xl border border-rose-100 space-y-2">
                  <div className="flex items-center justify-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-rose-700">
                    <Search className="w-4 h-4" />
                    <span>Modo Caçador de Erros</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
                    {err.prompt}
                  </h3>
                  <p className="text-xs text-slate-600 max-w-md mx-auto">
                    Três das palavras abaixo estão acentuadas com perfeição. Uma delas tem um erro de acentuação (falta acento ou tem acento indevido). Clique na palavra errada!
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                  {err.words.map(w => {
                    const isSelected = selectedWordId === w.id;

                    let style = 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800';
                    if (hasSubmitted) {
                      if (w.isIncorrect) {
                        // This was the error to hunt!
                        style = 'bg-emerald-50 border-emerald-400 text-emerald-950 ring-2 ring-emerald-300 font-black shadow-xs';
                      } else if (isSelected && !w.isIncorrect) {
                        style = 'bg-rose-50 border-rose-400 text-rose-950';
                      }
                    } else if (isSelected) {
                      style = 'bg-rose-50 border-rose-500 text-rose-950 ring-2 ring-rose-200 font-bold shadow-xs';
                    }

                    return (
                      <button
                        key={w.id}
                        type="button"
                        disabled={hasSubmitted || lives <= 0}
                        onClick={() => {
                          soundManager.playClick();
                          setSelectedWordId(w.id);
                        }}
                        className={`p-5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-1.5 ${style}`}
                      >
                        <span className="text-xl sm:text-2xl font-black font-display">
                          {w.wordDisplay}
                        </span>

                        <span className="text-[10px] font-mono text-slate-400 uppercase">
                          {w.classification}
                        </span>

                        {hasSubmitted && w.isIncorrect && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                            ✓ Erro Localizado!
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* ======================================================== */}
          {/* FEEDBACK EXPLICATIVO IMEDIATO APÓS ENVIO                 */}
          {/* ======================================================== */}
          <AnimatePresence>
            {hasSubmitted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`p-5 rounded-2xl border space-y-3 ${
                  isAnswerCorrect
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                    : 'bg-amber-50 border-amber-300 text-amber-950'
                }`}
              >
                <div className="flex items-center gap-2">
                  {isAnswerCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                  )}
                  <h4 className="text-sm sm:text-base font-extrabold font-display">
                    {isAnswerCorrect ? 'Explicação da Regra (Você Acertou! 🎉)' : 'Entenda a Regra Gramatical:'}
                  </h4>
                </div>

                <p className="text-xs sm:text-sm leading-relaxed font-medium">
                  {currentChallenge.ruleExplanation}
                </p>

                <div className="pt-2 border-t border-slate-200/60 flex items-start gap-2 text-xs text-slate-600">
                  <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Dica de Ouro:</strong> {currentChallenge.pedagogicalTip}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Footer: Confirm Answer or Next Challenge */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
            <button
              onClick={() => onNavigate('hub')}
              className="text-xs text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
            >
              ← Voltar ao Hub
            </button>

            {!hasSubmitted ? (
              <button
                type="button"
                disabled={!canSubmit()}
                onClick={handleSubmitAnswer}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-2"
              >
                <span>Confirmar Resposta</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <motion.button
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleNextChallenge}
                className="px-7 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
              >
                <span>
                  {currentIndex < challenges.length - 1
                    ? 'Próximo Desafio'
                    : 'Concluir Modo de Acentuação 🏆'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ======================================================== */}
      {/* MODAL DO GUIA DIDÁTICO DE REGRAS BNCC EF05LP03          */}
      {/* ======================================================== */}
      <AnimatePresence>
        {isRuleGuideOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsRuleGuideOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs cursor-pointer"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 12 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="relative z-10 bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-xs">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 font-display">
                      Guia Didático das Regras de Acentuação (EF05LP03)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Consulte as regras oficiais de oxítonas, paroxítonas e proparoxítonas a qualquer momento.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsRuleGuideOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Rule Navigation Tabs */}
              <div className="flex items-center gap-1.5 p-3 border-b border-slate-100 bg-slate-50 overflow-x-auto">
                {ACENTUACAO_RULES_GUIDE.map(rule => (
                  <button
                    key={rule.id}
                    onClick={() => {
                      soundManager.playClick();
                      setActiveRuleTab(rule.id as any);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      activeRuleTab === rule.id
                        ? 'bg-white text-indigo-900 shadow-xs ring-1 ring-slate-200'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {rule.name}
                  </button>
                ))}
              </div>

              {/* Active Rule Details */}
              <div className="p-6 overflow-y-auto space-y-5 text-left text-xs leading-relaxed flex-1">
                {(() => {
                  const rule = ACENTUACAO_RULES_GUIDE.find(r => r.id === activeRuleTab) || ACENTUACAO_RULES_GUIDE[0];
                  return (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-base font-black text-slate-900 font-display">
                          {rule.name}: {rule.ruleTitle}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800">
                          {rule.badge}
                        </span>
                      </div>

                      {/* Mnemonic Banner */}
                      <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-amber-900 font-bold flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>{rule.mnemonicTip}</span>
                      </div>

                      {/* When to Accent */}
                      <div className="space-y-2">
                        <h5 className="font-extrabold text-emerald-800 uppercase text-[11px] tracking-wider flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Quando Recebe Acento:</span>
                        </h5>
                        <ul className="space-y-1 list-disc list-inside text-slate-700 pl-1">
                          {rule.whenToAccent.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>

                      {/* When NOT to Accent */}
                      {rule.whenNotToAccent.length > 0 && (
                        <div className="space-y-2">
                          <h5 className="font-extrabold text-rose-800 uppercase text-[11px] tracking-wider flex items-center gap-1">
                            <XCircle className="w-3.5 h-3.5 text-rose-600" />
                            <span>Quando NÃO Recebe Acento:</span>
                          </h5>
                          <ul className="space-y-1 list-disc list-inside text-slate-700 pl-1">
                            {rule.whenNotToAccent.map((item, idx) => (
                              <li key={idx}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Examples Grid */}
                      <div className="pt-2 border-t border-slate-100 space-y-2">
                        <span className="font-bold text-slate-700 uppercase text-[10px] tracking-wider block">
                          Exemplos de Palavras Acentuadas:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {rule.examplesWithAccent.map((ex, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200 font-bold text-xs"
                            >
                              {ex}
                            </span>
                          ))}
                        </div>
                      </div>

                      {rule.examplesWithoutAccent.length > 0 && (
                        <div className="space-y-2">
                          <span className="font-bold text-slate-700 uppercase text-[10px] tracking-wider block">
                            Exemplos SEM Acento (Naturais):
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {rule.examplesWithoutAccent.map((ex, idx) => (
                              <span
                                key={idx}
                                className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 text-xs"
                              >
                                {ex}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-slate-100 bg-slate-50 text-right">
                <button
                  onClick={() => setIsRuleGuideOpen(false)}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                >
                  Entendido, Voltar aos Desafios!
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
