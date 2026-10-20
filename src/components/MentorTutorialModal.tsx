import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Volume2,
  VolumeX,
  Heart,
  Search,
  Compass,
  Eye,
  Zap,
  Award,
  ArrowRight,
  ArrowLeft,
  X,
  CheckCircle2,
  Trophy,
  Users,
  GraduationCap,
  School,
  Flame,
  ShieldCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../utils/audio';
import { speechService } from '../utils/speech';
import { OFFICIAL_SCHOOL_NAME } from '../services/firebase';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  studentName?: string;
}

interface TutorialStep {
  id: string;
  badge: string;
  badgeColor: string;
  title: string;
  narrativeText: string;
  speechText: string;
  icon: any;
  iconBg: string;
  iconColor: string;
  interactiveVisual: React.ReactNode;
}

export const MentorTutorialModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onComplete,
  studentName = '',
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isNarrating, setIsNarrating] = useState(false);

  const displayName = studentName && studentName.trim() !== '' ? studentName : 'Jovem Explorador';

  const steps: TutorialStep[] = [
    {
      id: 'boas-vindas',
      badge: 'Capítulo 1: O Chamado da Aventura',
      badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-200',
      title: `Saudações, ${displayName}!`,
      narrativeText: `Eu sou a Professora Olívia, a Coruja Guardiã das Letras. Fui enviada para guiar seus passos pelas grandes expedições de Língua Portuguesa na ${OFFICIAL_SCHOOL_NAME}! Aqui, cada acerto concede Pontos de XP, Estrelas Douradas e novos títulos de explorador.`,
      speechText: `Olá, ${displayName}! Eu sou a Professora Olívia, a Coruja Guardiã das Letras. Fui enviada para guiar você pelas grandes expedições de Língua Portuguesa! Cada acerto concede pontos de experiência, estrelas e medalhas de conquista!`,
      icon: GraduationCap,
      iconBg: 'bg-gradient-to-tr from-amber-400 to-amber-300 text-slate-950',
      iconColor: 'text-amber-500',
      interactiveVisual: (
        <div className="bg-gradient-to-br from-indigo-950 to-slate-900 p-5 rounded-2xl border border-indigo-800/60 text-white flex flex-col items-center justify-center space-y-3 shadow-inner">
          <div className="relative">
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              className="w-20 h-20 rounded-3xl bg-amber-400 text-slate-950 flex items-center justify-center text-4xl shadow-lg border-2 border-amber-300"
            >
              🦉
            </motion.div>
            <motion.div
              animate={{ scale: [1, 1.25, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.8, repeat: Infinity }}
              className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center text-xs font-black shadow-xs"
            >
              ✨
            </motion.div>
          </div>
          <div className="text-center space-y-1">
            <p className="text-xs font-mono font-bold text-amber-300 tracking-wider uppercase">Mentora Oficial</p>
            <p className="text-sm font-extrabold text-white">Profª Olívia · Guardiã das Letras</p>
          </div>
        </div>
      ),
    },
    {
      id: 'vidas-aprendizado',
      badge: 'Capítulo 2: Vidas de Aprendizado',
      badgeColor: 'bg-rose-100 text-rose-900 border-rose-200',
      title: '3 Corações Pulsantes de Energia!',
      narrativeText:
        'Nas missões de leitura e desafio, você começa com 3 Vidas de Aprendizado. Cada erro consome um coração pulsante! Mas não se assuste: o erro faz parte do aprendizado. Se suas vidas acabarem, você sempre recebe uma Dica Pedagógica de Ouro para recarregar seus corações e tentar de novo com sabedoria!',
      speechText:
        'Atenção explorador: você começa cada missão com três corações de vida. Cada erro consome um coração! Se as vidas acabarem, você receberá uma dica especial para recarregar seus corações e triunfar!',
      icon: Heart,
      iconBg: 'bg-gradient-to-tr from-rose-500 to-rose-400 text-white',
      iconColor: 'text-rose-500',
      interactiveVisual: (
        <div className="bg-rose-50/80 border border-rose-200 p-5 rounded-2xl flex flex-col items-center justify-center space-y-3">
          <div className="flex items-center gap-3">
            {[0, 1, 2].map(idx => (
              <motion.div
                key={idx}
                animate={{ scale: [1, 1.22, 1] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: idx * 0.2 }}
                className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-rose-200 flex items-center justify-center"
              >
                <Heart className="w-7 h-7 text-rose-500 fill-rose-500" />
              </motion.div>
            ))}
          </div>
          <p className="text-xs font-semibold text-rose-800 text-center max-w-xs">
            Corações pulsantes no topo da tela indicam sua energia em tempo real!
          </p>
        </div>
      ),
    },
    {
      id: 'missao-explicitas',
      badge: 'Capítulo 3: Missão 1 · EF15LP03',
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-200',
      title: 'Detetive dos Fatos: Olho na Lupa!',
      narrativeText:
        'Na Missão 1, sua tarefa é investigar o texto como um perito. As respostas estão escritas com clareza nas linhas: datas, nomes de pessoas, espécies de animais e números exatos. Use a lupa e o recurso de destaque para marcar a pista certeira!',
      speechText:
        'Na Missão 1, seja um detetive de fatos! Todas as respostas estão escritas diretamente no texto: datas, nomes e lugares. Leia com calma e encontre a pista certa!',
      icon: Search,
      iconBg: 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-white',
      iconColor: 'text-emerald-500',
      interactiveVisual: (
        <div className="bg-emerald-50/80 border border-emerald-200 p-5 rounded-2xl flex flex-col items-center justify-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-2xl shadow-sm">
            🔍
          </div>
          <div className="bg-white p-3 rounded-xl border border-emerald-200 text-center max-w-xs shadow-2xs">
            <span className="text-xs text-slate-500 block mb-1">Pista do Texto:</span>
            <span className="text-xs font-bold text-emerald-900 bg-emerald-100/80 px-2 py-0.5 rounded">
              "na terça-feira ensolarada na Caatinga..."
            </span>
          </div>
        </div>
      ),
    },
    {
      id: 'missao-central',
      badge: 'Capítulo 4: Missão 2 · EF35LP03',
      badgeColor: 'bg-sky-100 text-sky-900 border-sky-200',
      title: 'A Bússola do Tema: O Sentido Global',
      narrativeText:
        'Atenção com as pegadinhas! Na Missão 2, não procuramos um detalhe passageiro (como a cor de uma garrafa), mas sim a Ideia Central de toda a história: a mensagem que o autor quer nos transmitir do começo até a última linha.',
      speechText:
        'Na Missão 2, ajuste sua bússola! O objetivo não é achar um detalhe isolado, mas descobrir o tema principal e a mensagem que o autor quer ensinar a todos nós!',
      icon: Compass,
      iconBg: 'bg-gradient-to-tr from-sky-500 to-blue-500 text-white',
      iconColor: 'text-sky-500',
      interactiveVisual: (
        <div className="bg-sky-50/80 border border-sky-200 p-5 rounded-2xl flex flex-col items-center justify-center space-y-3">
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="w-14 h-14 rounded-2xl bg-sky-600 text-white flex items-center justify-center text-2xl shadow-sm"
          >
            🧭
          </motion.div>
          <div className="bg-white p-2.5 rounded-xl border border-sky-200 text-xs font-bold text-sky-950 text-center max-w-xs shadow-2xs">
            Tema Global: A união da comunidade transforma o ambiente!
          </div>
        </div>
      ),
    },
    {
      id: 'missao-implicitas',
      badge: 'Capítulo 5: Missão 3 · EF35LP04',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-200',
      title: 'Mago das Entrelinhas: Pistas Ocultas!',
      narrativeText:
        'Como um verdadeiro mago das letras, você vai decifrar o que não foi dito com palavras óbvias. Junte os indícios do texto com o bom senso: se alguém tem olhos brilhando diante do telescópio, deduzimos que ela sente encantamento e surpresa!',
      speechText:
        'Na Missão 3, você é o Mago das Entrelinhas! Aprenda a ler nas entrelinhas, deduzindo intenções, sentimentos e mistérios através das pistas deixadas pelo autor!',
      icon: Eye,
      iconBg: 'bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950',
      iconColor: 'text-amber-500',
      interactiveVisual: (
        <div className="bg-amber-50/80 border border-amber-200 p-5 rounded-2xl flex flex-col items-center justify-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center text-2xl shadow-sm">
            🕵️
          </div>
          <div className="bg-white p-2.5 rounded-xl border border-amber-300 text-xs text-amber-950 text-center max-w-xs shadow-2xs space-y-0.5">
            <span className="text-[10px] uppercase font-mono text-amber-700 font-bold block">Dedução Mágica:</span>
            <span className="font-bold">"Olhos brilhando" = Emoção e admiração!</span>
          </div>
        </div>
      ),
    },
    {
      id: 'missao-acentuacao',
      badge: 'Capítulo 6: Missão 4 · EF05LP03 & Sprint',
      badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-200',
      title: 'Usina dos Acentos: Força na Sílaba Tônica!',
      narrativeText:
        'Chegou a hora de dominar a acentuação gráfica! Chame a palavra bem forte: a sílaba que mais se prolonga é a tônica. Oxítona (última), Paroxítona (penúltima) e Proparoxítona (antepenúltima). Lembre-se da Regra Suprema: 100% das proparoxítonas recebem acento! E prepare-se para o Sprint de 60 segundos!',
      speechText:
        'Na Missão 4, domine a Usina dos Acentos! Descubra a sílaba tônica das palavras: oxítonas, paroxítonas e proparoxítonas! E lembre-se: todas as proparoxítonas recebem acento gráfico!',
      icon: Zap,
      iconBg: 'bg-gradient-to-tr from-indigo-600 to-purple-600 text-white',
      iconColor: 'text-indigo-600',
      interactiveVisual: (
        <div className="bg-indigo-50/80 border border-indigo-200 p-5 rounded-2xl flex flex-col items-center justify-center space-y-3">
          <div className="flex items-center gap-1.5">
            <span className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-black text-sm shadow-xs animate-pulse">
              LÂM
            </span>
            <span className="text-slate-400 font-bold">·</span>
            <span className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold text-sm">
              pa
            </span>
            <span className="text-slate-400 font-bold">·</span>
            <span className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold text-sm">
              da
            </span>
          </div>
          <span className="text-xs font-extrabold text-indigo-900 bg-white px-3 py-1 rounded-full border border-indigo-200 shadow-2xs">
            Antepenúltima = Proparoxítona Acentuada!
          </span>
        </div>
      ),
    },
    {
      id: 'conquistas-ranking',
      badge: 'Capítulo 7: Glória & Reconhecimento',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      title: 'Medalhas com Brilho, Ranking & Certificado!',
      narrativeText:
        'Conforme avança, novas medalhas conquistadas pulsarão com brilho no seu painel. Seus pontos somam para o Ranking da sua Turma, promovendo uma competição saudável entre colegas. Ao concluir sua jornada, visite o Espaço do Professor para emitir seu Certificado de Conquista Oficial em PDF!',
      speechText:
        'Você está pronto! Conquiste medalhas com brilho especial, suba no ranking da sua turma e garanta seu certificado oficial de conquista! Boa viagem e divirta-se na aventura!',
      icon: Trophy,
      iconBg: 'bg-gradient-to-tr from-amber-400 via-yellow-400 to-amber-500 text-slate-950',
      iconColor: 'text-amber-500',
      interactiveVisual: (
        <div className="bg-gradient-to-br from-amber-500 via-amber-600 to-yellow-500 p-5 rounded-2xl text-slate-950 flex flex-col items-center justify-center space-y-2 shadow-md">
          <motion.div
            animate={{ scale: [1, 1.15, 1], rotate: [0, -5, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-14 h-14 rounded-2xl bg-white text-slate-950 flex items-center justify-center text-3xl shadow-lg border border-amber-200"
          >
            🏆
          </motion.div>
          <div className="text-center">
            <span className="text-xs font-black uppercase tracking-wider text-slate-950 block">Certificado & Ranking</span>
            <span className="text-xs font-extrabold text-amber-950">100% Alinhado à BNCC</span>
          </div>
        </div>
      ),
    },
  ];

  const current = steps[currentStep];

  // Stop speech synthesis if modal is closed
  useEffect(() => {
    return () => {
      speechService.stop();
    };
  }, []);

  const handleToggleVoice = () => {
    if (isNarrating) {
      speechService.stop();
      setIsNarrating(false);
    } else {
      soundManager.playClick();
      setIsNarrating(true);
      speechService.speak(current.speechText, () => {
        setIsNarrating(false);
      });
    }
  };

  const handleNextStep = () => {
    soundManager.playClick();
    speechService.stop();
    setIsNarrating(false);

    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      soundManager.playFanfare();
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#6366f1', '#10b981', '#ec4899'],
      });
      onComplete();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      soundManager.playClick();
      speechService.stop();
      setIsNarrating(false);
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleJumpToStep = (index: number) => {
    soundManager.playClick();
    speechService.stop();
    setIsNarrating(false);
    setCurrentStep(index);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 16 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6"
      >
        {/* Header Decorator with Avatar */}
        <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white p-6 sm:p-7 relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-40 h-40 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-start justify-between gap-4 relative z-10">
            <div className="flex items-center gap-3.5">
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-300 text-slate-950 flex items-center justify-center text-3xl shadow-md border-2 border-amber-300 shrink-0"
              >
                🦉
              </motion.div>

              <div>
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-300 uppercase tracking-wider">
                  <span>TUTORIAL GUIADO PELA MENTORA</span>
                  <span aria-hidden="true">·</span>
                  <span>PASSO {currentStep + 1} DE {steps.length}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black font-display text-white mt-0.5">
                  Manual de Voo da Professora Olívia
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleVoice}
                title={isNarrating ? 'Pausar narração' : 'Ouvir narração da Professora'}
                className={`p-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold ${
                  isNarrating
                    ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300 animate-pulse'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                {isNarrating ? (
                  <>
                    <VolumeX className="w-4 h-4" />
                    <span className="hidden sm:inline">Pausar Voz</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 text-amber-300" />
                    <span className="hidden sm:inline">Ouvir Mentora</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  soundManager.playClick();
                  speechService.stop();
                  onClose();
                }}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Pular tutorial"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Stepper Dots Progress Indicator */}
          <div className="flex items-center gap-1.5 mt-5">
            {steps.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => handleJumpToStep(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  idx === currentStep
                    ? 'w-8 bg-amber-400'
                    : idx < currentStep
                    ? 'w-3 bg-emerald-400'
                    : 'w-2 bg-white/25 hover:bg-white/40'
                }`}
                title={`Ir para ${s.title}`}
              />
            ))}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, x: 14 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -14 }}
              transition={{ duration: 0.22 }}
              className="space-y-5"
            >
              {/* Step Badge */}
              <div className="flex items-center justify-between gap-3">
                <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full border ${current.badgeColor}`}>
                  {current.badge}
                </span>

                <div className="text-xs font-mono font-bold text-slate-500">
                  {currentStep + 1}/{steps.length}
                </div>
              </div>

              {/* Title & Speech Bubble */}
              <div>
                <h4 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
                  {current.title}
                </h4>
                <div className="relative mt-3 p-4 sm:p-5 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-slate-700 text-sm sm:text-base leading-relaxed">
                  <span className="text-2xl absolute -top-3.5 left-4">💬</span>
                  <p className="mt-1 font-medium">{current.narrativeText}</p>
                </div>
              </div>

              {/* Interactive Visual Sandbox */}
              <div className="pt-1">
                {current.interactiveVisual}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Footer Controls */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
            <div>
              {currentStep > 0 ? (
                <button
                  onClick={handlePrevStep}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Anterior</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    soundManager.playClick();
                    speechService.stop();
                    onComplete();
                  }}
                  className="text-xs text-slate-500 hover:text-slate-800 font-semibold px-2 py-1 cursor-pointer transition-colors"
                >
                  Pular Tutorial
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleNextStep}
                className={`px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 shadow-md ${
                  currentStep === steps.length - 1
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black ring-2 ring-amber-300'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                <span>{currentStep === steps.length - 1 ? 'Começar Minha Aventura! 🚀' : 'Próximo Capítulo'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
