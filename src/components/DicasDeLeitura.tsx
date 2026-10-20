import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  Eye,
  BookOpen,
  Volume2,
  VolumeX,
  Lightbulb,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  HelpCircle,
  Award,
  AlertTriangle,
  RotateCcw,
  Check,
  Target,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { READING_STRATEGIES, ReadingStrategy } from '../data/dicasLeitura';
import { speechService } from '../utils/speech';
import { soundManager } from '../utils/audio';

interface Props {
  onSelectMission?: (missionId: string) => void;
  onBonusPoints?: (points: number) => void;
  variant?: 'dashboard-card' | 'footer-banner';
}

export const DicasDeLeitura: React.FC<Props> = ({
  onSelectMission,
  onBonusPoints,
  variant = 'dashboard-card',
}) => {
  const [selectedSkillFilter, setSelectedSkillFilter] = useState<'ALL' | 'EF35LP03' | 'EF35LP04'>('ALL');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isNarrating, setIsNarrating] = useState<boolean>(false);
  const [showQuiz, setShowQuiz] = useState<boolean>(false);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizAnswered, setQuizAnswered] = useState<boolean>(false);
  const [completedQuizIds, setCompletedQuizIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('dicas_leitura_quizzes');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Filter strategies based on active tab
  const filteredStrategies = READING_STRATEGIES.filter(s => {
    if (selectedSkillFilter === 'ALL') return true;
    return s.skill === selectedSkillFilter;
  });

  const activeStrategy: ReadingStrategy = filteredStrategies[currentIndex] || filteredStrategies[0];

  // Reset index if out of bounds after filter change
  useEffect(() => {
    setCurrentIndex(0);
    setShowQuiz(false);
    setSelectedQuizOption(null);
    setQuizAnswered(false);
    if (isNarrating) {
      speechService.stop();
      setIsNarrating(false);
    }
  }, [selectedSkillFilter]);

  // Clean up narration on unmount or strategy switch
  useEffect(() => {
    return () => {
      speechService.stop();
    };
  }, []);

  const handleNext = () => {
    soundManager.playClick();
    if (isNarrating) {
      speechService.stop();
      setIsNarrating(false);
    }
    setShowQuiz(false);
    setSelectedQuizOption(null);
    setQuizAnswered(false);
    setCurrentIndex((prev) => (prev + 1) % filteredStrategies.length);
  };

  const handlePrev = () => {
    soundManager.playClick();
    if (isNarrating) {
      speechService.stop();
      setIsNarrating(false);
    }
    setShowQuiz(false);
    setSelectedQuizOption(null);
    setQuizAnswered(false);
    setCurrentIndex((prev) => (prev - 1 + filteredStrategies.length) % filteredStrategies.length);
  };

  const toggleNarration = () => {
    if (isNarrating) {
      speechService.stop();
      setIsNarrating(false);
      return;
    }

    soundManager.playClick();
    const narrationText = `Estratégia de leitura: ${activeStrategy.title}. Habilidade ${activeStrategy.skillTitle}. ${activeStrategy.subtitle}. Dica de aplicação: ${activeStrategy.stepByStep.join('. ')}. Exemplo: ${activeStrategy.exampleText}. Conclusão: ${activeStrategy.deductionResult}. Dica da Professora Olívia: ${activeStrategy.mentorTip}`;

    setIsNarrating(true);
    speechService.speak(narrationText, () => {
      setIsNarrating(false);
    });
  };

  const handleOptionSelect = (optionIdx: number) => {
    if (quizAnswered) return;
    soundManager.playClick();
    setSelectedQuizOption(optionIdx);
  };

  const handleCheckQuizAnswer = () => {
    if (selectedQuizOption === null || quizAnswered) return;
    setQuizAnswered(true);

    const isCorrect = activeStrategy.miniQuiz.options[selectedQuizOption].isCorrect;
    if (isCorrect) {
      soundManager.playCorrect();
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#38bdf8', '#fbbf24', '#34d399', '#818cf8'],
        });
      } catch {
        // Confetti fallback
      }

      if (!completedQuizIds.includes(activeStrategy.id)) {
        const updated = [...completedQuizIds, activeStrategy.id];
        setCompletedQuizIds(updated);
        try {
          localStorage.setItem('dicas_leitura_quizzes', JSON.stringify(updated));
        } catch {
          // Storage fallback
        }
        if (onBonusPoints) {
          onBonusPoints(25);
        }
      }
    } else {
      soundManager.playWrong();
    }
  };

  const handleResetQuiz = () => {
    soundManager.playClick();
    setSelectedQuizOption(null);
    setQuizAnswered(false);
  };

  return (
    <section className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6 relative overflow-hidden">
      {/* Decorative background ambient glows */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-sky-400/10 via-amber-300/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-indigo-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5 relative z-10">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-mono font-extrabold uppercase tracking-wider text-indigo-900 bg-indigo-100/90 border border-indigo-200 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xs">
              <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
              <span>Oficina de Leitura BNCC</span>
            </span>

            <span className="text-[11px] font-mono font-bold text-sky-800 bg-sky-50 border border-sky-200 px-2.5 py-1 rounded-full flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-sky-600" />
              <span>EF35LP03: Ideia Central</span>
            </span>

            <span className="text-[11px] font-mono font-bold text-amber-900 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-amber-600" />
              <span>EF35LP04: Entrelinhas</span>
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 tracking-tight flex items-center gap-2.5">
            <span>💡 Dicas Estratégicas de Interpretação Textual</span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
            Técnicas práticas e segredos de leitura para desvendar a mensagem principal do autor e capturar pistas ocultas nas entrelinhas.
          </p>
        </div>

        {/* Skill Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shrink-0 self-start md:self-auto">
          <button
            onClick={() => {
              soundManager.playClick();
              setSelectedSkillFilter('ALL');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              selectedSkillFilter === 'ALL'
                ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Todas (6)</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setSelectedSkillFilter('EF35LP03');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedSkillFilter === 'EF35LP03'
                ? 'bg-sky-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Ideia Central</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setSelectedSkillFilter('EF35LP04');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedSkillFilter === 'EF35LP04'
                ? 'bg-amber-500 text-slate-950 shadow-xs font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Entrelinhas</span>
          </button>
        </div>
      </div>

      {/* Main Strategy Card Box */}
      <div className="space-y-6 relative z-10">
        {/* Navigation Toolbar & Strategy Indicator */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-lg shadow-2xs">
              {activeStrategy.icon}
            </span>
            <div>
              <span className="text-xs font-bold font-mono text-slate-500 block uppercase">
                Estratégia {currentIndex + 1} de {filteredStrategies.length}
              </span>
              <span className="text-sm font-extrabold text-slate-900">
                {activeStrategy.skillBadge}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* Audio narration button */}
            <button
              onClick={toggleNarration}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border shadow-2xs ${
                isNarrating
                  ? 'bg-amber-400 text-slate-950 border-amber-500 animate-pulse'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
              title={isNarrating ? 'Parar leitura por voz' : 'Ouvir explicação com voz guiada'}
            >
              {isNarrating ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-indigo-600" />}
              <span>{isNarrating ? 'Parar Voz' : 'Ouvir Dica'}</span>
            </button>

            {/* Pagination Controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={handlePrev}
                className="w-8 h-8 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                title="Estratégia anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="w-8 h-8 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                title="Próxima estratégia"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Animated Content Panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStrategy.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            className="space-y-6"
          >
            {/* Strategy Title & Subtitle Banner */}
            <div className={`p-5 rounded-2xl border ${
              activeStrategy.skill === 'EF35LP03'
                ? 'bg-gradient-to-r from-sky-50 via-blue-50 to-indigo-50/40 border-sky-200 text-sky-950'
                : 'bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50/40 border-amber-200 text-amber-950'
            }`}>
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-mono font-bold tracking-wider opacity-75 block">
                    {activeStrategy.skillTitle}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black font-display tracking-tight">
                    {activeStrategy.title}
                  </h3>
                  <p className="text-xs sm:text-sm opacity-90 leading-relaxed max-w-2xl">
                    {activeStrategy.subtitle}
                  </p>
                </div>

                <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-white/60 flex items-center justify-center text-2xl shrink-0">
                  {activeStrategy.icon}
                </div>
              </div>
            </div>

            {/* Grid: 1. Como Aplicar (Passos) & 2. Microexemplo Prático */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Box 1: Passo a Passo Prático */}
              <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200/80 space-y-3.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                    <Target className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-extrabold text-slate-900 font-display">
                    Como Aplicar Durante a Leitura:
                  </h4>
                </div>

                <ol className="space-y-2.5">
                  {activeStrategy.stepByStep.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed">
                      <span className="w-5 h-5 rounded-full bg-white border border-slate-300 text-slate-900 font-bold font-mono text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Box 2: Laboratório com Microexemplo */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-extrabold text-slate-900 font-display">
                    Demonstração em Texto Curto:
                  </h4>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs italic text-slate-700 leading-relaxed">
                  "{activeStrategy.exampleText}"
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2 p-2 rounded-lg bg-sky-50 border border-sky-100">
                    <span className="font-bold text-sky-900 shrink-0">🔍 Pista do Texto:</span>
                    <span className="text-sky-800">{activeStrategy.clueFound}</span>
                  </div>

                  <div className="flex items-start gap-2 p-2 rounded-lg bg-emerald-50 border border-emerald-100">
                    <span className="font-bold text-emerald-950 shrink-0">✨ Conclusão Certeira:</span>
                    <span className="text-emerald-900 font-medium">{activeStrategy.deductionResult}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Warning / Common Mistake & Mentor Tip Strips */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Pegadinha a Evitar */}
              <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-200 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center text-sm shrink-0">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-[11px] font-mono font-bold text-rose-900 uppercase">
                    Cuidado com a Pegadinha!
                  </span>
                  <p className="text-xs text-rose-800 leading-relaxed font-medium">
                    {activeStrategy.commonMistake}
                  </p>
                </div>
              </div>

              {/* Dica da Mentora Olívia */}
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center text-base shrink-0">
                  🦉
                </div>
                <div className="space-y-0.5">
                  <span className="text-[11px] font-mono font-bold text-amber-900 uppercase">
                    Conselho da Mentora Olívia
                  </span>
                  <p className="text-xs text-amber-900 leading-relaxed font-medium">
                    "{activeStrategy.mentorTip}"
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive Section: Testar Estratégia (Mini-Quiz) OR Jogar a Missão */}
            <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    soundManager.playClick();
                    setShowQuiz(!showQuiz);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    showQuiz
                      ? 'bg-slate-900 text-white'
                      : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-950 border border-indigo-200'
                  }`}
                >
                  <HelpCircle className="w-4 h-4 text-amber-500" />
                  <span>{showQuiz ? 'Ocultar Desafio de Fixação' : 'Testar Estratégia em Mini-Quiz (+25 XP)'}</span>
                </button>

                {completedQuizIds.includes(activeStrategy.id) && (
                  <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Concluído (+25 XP)</span>
                  </span>
                )}
              </div>

              {/* Shortcut directly to matching mission */}
              {onSelectMission && (
                <button
                  onClick={() => {
                    soundManager.playClick();
                    onSelectMission(activeStrategy.missionTarget);
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <span>
                    Praticar na Missão:{' '}
                    {activeStrategy.missionTarget === 'central'
                      ? 'A Bússola do Tema 🧭'
                      : 'Mago das Entrelinhas 🕵️'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Mini Quiz Sandbox Box */}
            <AnimatePresence>
              {showQuiz && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-5 rounded-2xl bg-indigo-950 text-white border border-indigo-800 space-y-4 shadow-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
                        <Award className="w-4 h-4 text-amber-400" />
                        <span>Desafio de Fixação: {activeStrategy.skillBadge}</span>
                      </div>
                      <span className="text-xs font-mono text-indigo-300">
                        {quizAnswered ? 'Resultado Revelado' : 'Valendo +25 Pontos'}
                      </span>
                    </div>

                    <p className="text-sm font-bold text-white leading-relaxed">
                      {activeStrategy.miniQuiz.question}
                    </p>

                    <div className="space-y-2">
                      {activeStrategy.miniQuiz.options.map((opt, optIdx) => {
                        const isSelected = selectedQuizOption === optIdx;
                        return (
                          <button
                            key={optIdx}
                            disabled={quizAnswered}
                            onClick={() => handleOptionSelect(optIdx)}
                            className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm font-medium transition-all cursor-pointer flex items-start gap-3 ${
                              quizAnswered
                                ? opt.isCorrect
                                  ? 'bg-emerald-600/30 border-emerald-400 text-emerald-200 font-bold ring-1 ring-emerald-400'
                                  : isSelected
                                  ? 'bg-rose-600/30 border-rose-400 text-rose-200'
                                  : 'bg-white/5 border-white/10 text-slate-300 opacity-60'
                                : isSelected
                                ? 'bg-amber-400 text-slate-950 font-bold border-amber-300 shadow-xs'
                                : 'bg-white/5 hover:bg-white/10 border-white/15 text-slate-200'
                            }`}
                          >
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5 ${
                              quizAnswered
                                ? opt.isCorrect
                                  ? 'bg-emerald-400 text-slate-950'
                                  : isSelected
                                  ? 'bg-rose-400 text-white'
                                  : 'bg-white/20 text-white'
                                : isSelected
                                ? 'bg-slate-950 text-white'
                                : 'bg-white/20 text-white'
                            }`}>
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <div className="space-y-1">
                              <span>{opt.text}</span>
                              {quizAnswered && (
                                <p className={`text-[11px] font-normal ${
                                  opt.isCorrect ? 'text-emerald-300' : 'text-rose-300'
                                }`}>
                                  {opt.explanation}
                                </p>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      {quizAnswered ? (
                        <button
                          onClick={handleResetQuiz}
                          className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-white font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Tentar Novamente</span>
                        </button>
                      ) : (
                        <div className="text-xs text-indigo-300">
                          Selecione uma alternativa e confirme sua resposta.
                        </div>
                      )}

                      {!quizAnswered && (
                        <button
                          disabled={selectedQuizOption === null}
                          onClick={handleCheckQuizAnswer}
                          className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs transition-colors cursor-pointer disabled:opacity-40 shadow-xs"
                        >
                          Confirmar Resposta
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};
