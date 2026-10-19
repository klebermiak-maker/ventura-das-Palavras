import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award,
  Sparkles,
  CheckCircle,
  Lock,
  Star,
  Info,
  X,
  Zap,
  Volume2,
  Share2,
  Flame,
  ArrowRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../utils/audio';

export interface BadgeDefinition {
  id: string;
  name: string;
  bnccCode: string;
  icon: string;
  desc: string;
  detailedDesc: string;
  requirement: string;
  gradient: string;
  borderColor: string;
  glowColor: string;
  category: string;
}

export const GAME_BADGES: BadgeDefinition[] = [
  {
    id: 'EF15LP03',
    name: 'Detetive de Fatos',
    bnccCode: 'EF15LP03',
    icon: '🔍',
    desc: 'Acertou perguntas explícitas',
    detailedDesc: 'Localizou informações pontuais, datas, personagens e dados explícitos descritos claramente no texto.',
    requirement: 'Acertar pelo menos uma questão na missão Detetive dos Fatos.',
    gradient: 'from-emerald-500 to-teal-600',
    borderColor: 'border-emerald-300',
    glowColor: 'rgba(16, 185, 129, 0.45)',
    category: 'Leitura & Fatos',
  },
  {
    id: 'EF35LP03',
    name: 'Mestre da Ideia Central',
    bnccCode: 'EF35LP03',
    icon: '🧭',
    desc: 'Identificou o tema global',
    detailedDesc: 'Compreendeu o sentido global do texto, selecionando a melhor manchete e sintetizando a ideia principal.',
    requirement: 'Acertar pelo menos uma questão na missão A Bússola do Tema.',
    gradient: 'from-sky-500 to-indigo-600',
    borderColor: 'border-sky-300',
    glowColor: 'rgba(14, 165, 233, 0.45)',
    category: 'Compreensão Global',
  },
  {
    id: 'EF35LP04',
    name: 'Mago das Entrelinhas',
    bnccCode: 'EF35LP04',
    icon: '🕵️',
    desc: 'Fez deduções precisas',
    detailedDesc: 'Decifrou pistas contextuais, intenções ocultas de personagens e fatos que não foram ditos diretamente.',
    requirement: 'Acertar pelo menos uma questão na missão Mago das Entrelinhas.',
    gradient: 'from-amber-500 to-orange-600',
    borderColor: 'border-amber-300',
    glowColor: 'rgba(245, 158, 11, 0.45)',
    category: 'Inferência Textual',
  },
  {
    id: 'EF05LP03',
    name: 'Campeão da Acentuação',
    bnccCode: 'EF05LP03',
    icon: '⚡',
    desc: 'Classificou tônicas e acentos',
    detailedDesc: 'Identificou a sílaba tônica e aplicou as regras de acentuação para oxítonas, paroxítonas e proparoxítonas.',
    requirement: 'Acertar desafios na Usina dos Acentos.',
    gradient: 'from-indigo-600 to-purple-600',
    borderColor: 'border-indigo-300',
    glowColor: 'rgba(99, 102, 241, 0.45)',
    category: 'Gramática & Ortografia',
  },
  {
    id: 'MESTRE',
    name: 'Mestre da Língua Portuguesa',
    bnccCode: 'BNCC 4º Ano',
    icon: '🏆',
    desc: 'Conquistou 5+ estrelas',
    detailedDesc: 'Demonstrou proficiência exemplar acumulando mais de cinco estrelas douradas de alto aproveitamento.',
    requirement: 'Acumular pelo menos 5 estrelas douradas em qualquer modo de jogo.',
    gradient: 'from-yellow-400 via-amber-500 to-yellow-600',
    borderColor: 'border-amber-400',
    glowColor: 'rgba(251, 191, 36, 0.6)',
    category: 'Domínio Geral',
  },
  {
    id: 'SPRINT_MASTER',
    name: 'Velocista das Palavras',
    bnccCode: 'Agilidade BNCC',
    icon: '🔥',
    desc: 'Velocidade no Sprint 60s',
    detailedDesc: 'Completou sequências rápidas de desafios no modo Sprint Relâmpago com alto combo de pontos.',
    requirement: 'Superar o modo Sprint de 60 segundos.',
    gradient: 'from-rose-500 via-amber-500 to-orange-500',
    borderColor: 'border-rose-300',
    glowColor: 'rgba(244, 63, 94, 0.5)',
    category: 'Desafio Rápido',
  },
];

interface Props {
  badgesEarned: string[];
  recentBadges?: string[];
  starsCount: number;
  score: number;
  onSelectMission?: (view: string) => void;
  onAcknowledgeBadge?: (badgeId: string) => void;
  onSimulateBadgeUnlock?: (badgeId: string) => void;
}

export const PainelMedalhas: React.FC<Props> = ({
  badgesEarned,
  recentBadges = [],
  starsCount,
  score,
  onSelectMission,
  onAcknowledgeBadge,
  onSimulateBadgeUnlock,
}) => {
  const [selectedBadge, setSelectedBadge] = useState<BadgeDefinition | null>(null);
  const [simulatedBadgeId, setSimulatedBadgeId] = useState<string | null>(null);

  // Determine if a badge is unlocked
  const isBadgeUnlocked = (badgeId: string) => {
    if (simulatedBadgeId === badgeId) return true;
    if (badgesEarned.includes(badgeId)) return true;
    if (badgeId === 'MESTRE' && starsCount >= 5) return true;
    return false;
  };

  // Determine if a badge has the "NEW / RECÉM-CONQUISTADA" state
  const isBadgeNew = (badgeId: string) => {
    if (simulatedBadgeId === badgeId) return true;
    return recentBadges.includes(badgeId);
  };

  const handleBadgeClick = (badge: BadgeDefinition) => {
    soundManager.playClick();
    setSelectedBadge(badge);

    const isUnlocked = isBadgeUnlocked(badge.id);
    if (isUnlocked) {
      soundManager.playCorrect();
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
      });
    }

    // Acknowledge the new badge if callback provided
    if (onAcknowledgeBadge && isBadgeNew(badge.id)) {
      onAcknowledgeBadge(badge.id);
    }
  };

  const handleSimulateNewBadge = (badgeId: string) => {
    soundManager.playFanfare();
    setSimulatedBadgeId(badgeId);

    confetti({
      particleCount: 80,
      spread: 90,
      origin: { y: 0.6 },
    });

    if (onSimulateBadgeUnlock) {
      onSimulateBadgeUnlock(badgeId);
    }
  };

  const unlockedCount = GAME_BADGES.filter(b => isBadgeUnlocked(b.id)).length;
  const totalCount = GAME_BADGES.length;
  const percentage = Math.round((unlockedCount / totalCount) * 100);

  return (
    <section className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6 overflow-hidden relative">
      {/* Subtle Background Radial Aura */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header with Title and Progress */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-100 text-amber-700 shadow-2xs">
              <Award className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold tracking-wider uppercase text-amber-700">
                <Sparkles className="w-3.5 h-3.5 fill-amber-500" />
                <span>Painel de Conquistas do Estudante</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">
                Medalhas & Distintivos de Honra
              </h2>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Desbloqueie medalhas ao acertar questões e demonstrar maestria nas habilidades da BNCC. Clique em qualquer emblema para inspecionar seus detalhes.
          </p>
        </div>

        {/* Counter and Interactive Simulator Tooltip */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200/80 rounded-2xl px-4 py-2.5 text-right shadow-2xs">
            <div className="text-[10px] font-mono font-bold uppercase text-amber-800 tracking-wide">
              Progresso de Medalhas
            </div>
            <div className="flex items-baseline justify-end gap-1.5 font-display font-black text-slate-900">
              <span className="text-xl text-amber-600">{unlockedCount}</span>
              <span className="text-xs text-slate-400 font-normal">/ {totalCount} ({percentage}%)</span>
            </div>
          </div>

          {/* Demonstration Button: Allows user or teacher to test the glowing pulse effect anytime */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              // Find the first locked badge to simulate, or MESTRE
              const target = GAME_BADGES.find(b => !isBadgeUnlocked(b.id)) || GAME_BADGES[4];
              handleSimulateNewBadge(target.id);
            }}
            title="Clique para testar o efeito de brilho e pulsação de uma nova medalha conquistada!"
            className="px-3 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 hover:text-amber-950 border border-amber-300 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-500 animate-spin" style={{ animationDuration: '4s' }} />
            <span className="hidden md:inline">Testar Brilho de Nova Medalha</span>
            <span className="md:hidden">Testar Efeito</span>
          </motion.button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5 relative z-10">
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="h-full rounded-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 shadow-xs"
          />
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4 relative z-10">
        {GAME_BADGES.map((b, index) => {
          const isUnlocked = isBadgeUnlocked(b.id);
          const isNew = isBadgeNew(b.id);

          return (
            <div key={b.id} className="relative group">
              {/* 1. Luminous Radial Halo Glow (Framer Motion) for New/Earned Badges */}
              {isNew && (
                <motion.div
                  animate={{
                    opacity: [0.55, 1, 0.55],
                    scale: [0.98, 1.12, 0.98],
                  }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  style={{
                    boxShadow: `0 0 25px 8px ${b.glowColor}`,
                  }}
                  className="absolute -inset-1 rounded-2xl bg-amber-400/30 blur-md pointer-events-none z-0"
                />
              )}

              {/* 2. Floating Twinkling Sparkles (Framer Motion) on New Badges */}
              {isNew && (
                <>
                  <motion.div
                    animate={{
                      scale: [0, 1.25, 0],
                      opacity: [0, 1, 0],
                      rotate: [0, 120, 240],
                    }}
                    transition={{
                      duration: 1.8,
                      repeat: Infinity,
                      delay: 0.2,
                    }}
                    className="absolute -top-2 -right-1 text-amber-500 z-30 pointer-events-none"
                  >
                    <Sparkles className="w-4 h-4 fill-amber-400" />
                  </motion.div>
                  <motion.div
                    animate={{
                      scale: [0, 1.1, 0],
                      opacity: [0, 0.9, 0],
                      rotate: [180, 60, 0],
                    }}
                    transition={{
                      duration: 2.2,
                      repeat: Infinity,
                      delay: 0.8,
                    }}
                    className="absolute -bottom-1 -left-1 text-yellow-500 z-30 pointer-events-none"
                  >
                    <Sparkles className="w-3.5 h-3.5 fill-yellow-400" />
                  </motion.div>
                </>
              )}

              {/* 3. "NOVA!" Badge Ribbon (Framer Motion) */}
              {isNew && (
                <motion.div
                  initial={{ scale: 0, y: -8, rotate: -15 }}
                  animate={{
                    scale: [1, 1.08, 1],
                    y: [0, -3, 0],
                    rotate: [-3, 3, -3],
                  }}
                  transition={{
                    duration: 1.6,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 pointer-events-none whitespace-nowrap"
                >
                  <span className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-black text-[9px] tracking-wider uppercase px-2 py-0.5 rounded-full shadow-md border border-white flex items-center gap-1 ring-2 ring-amber-300/60">
                    <Sparkles className="w-2.5 h-2.5 fill-slate-950" />
                    <span>NOVA!</span>
                  </span>
                </motion.div>
              )}

              {/* 4. Main Card Container with Pulsing Scale and Wobble (Framer Motion) */}
              <motion.button
                onClick={() => handleBadgeClick(b)}
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.96 }}
                animate={
                  isNew
                    ? {
                        scale: [1, 1.05, 1],
                        rotate: [0, -1, 1, 0],
                      }
                    : isUnlocked
                    ? {
                        scale: [1, 1.01, 1],
                      }
                    : {}
                }
                transition={{
                  duration: isNew ? 2 : 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: index * 0.15,
                }}
                className={`w-full p-4 rounded-2xl border text-center transition-all flex flex-col items-center justify-between min-h-[175px] relative overflow-hidden cursor-pointer shadow-xs ${
                  isNew
                    ? 'bg-gradient-to-b from-amber-50 via-yellow-50 to-white border-amber-400 ring-2 ring-amber-300 shadow-md'
                    : isUnlocked
                    ? 'bg-white hover:bg-amber-50/40 border-amber-300 ring-1 ring-amber-200/80 shadow-xs'
                    : 'bg-slate-50/70 border-slate-200/80 hover:bg-slate-100 opacity-65'
                }`}
              >
                {/* 5. Diagonal Shimmer Beam Sweep (Framer Motion) */}
                {isUnlocked && (
                  <motion.div
                    initial={{ x: '-150%' }}
                    animate={{ x: '220%' }}
                    transition={{
                      repeat: Infinity,
                      repeatDelay: isNew ? 1.4 : 3.5,
                      duration: 1.2,
                      ease: 'easeInOut',
                    }}
                    className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/70 to-transparent skew-x-12 pointer-events-none z-10"
                  />
                )}

                {/* Top Skill Category Pill */}
                <div className="w-full flex items-center justify-between text-[10px] font-mono font-bold">
                  <span
                    className={`px-1.5 py-0.5 rounded-md ${
                      isUnlocked
                        ? 'bg-amber-100/90 text-amber-900 border border-amber-200/70'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {b.bnccCode}
                  </span>
                  {isUnlocked ? (
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  )}
                </div>

                {/* Badge Icon with Bounce & Glow */}
                <div className="relative my-2">
                  {/* Aura under icon */}
                  {isUnlocked && (
                    <motion.div
                      animate={
                        isNew
                          ? { scale: [1, 1.3, 1], opacity: [0.4, 0.9, 0.4] }
                          : { scale: [1, 1.15, 1], opacity: [0.2, 0.5, 0.2] }
                      }
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute inset-0 rounded-full bg-amber-400/40 blur-sm -z-0"
                    />
                  )}

                  <motion.div
                    animate={
                      isNew
                        ? {
                            scale: [1, 1.14, 1],
                            rotate: [0, -4, 4, 0],
                          }
                        : {}
                    }
                    transition={{
                      duration: 1.8,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm border relative z-10 ${
                      isUnlocked
                        ? 'bg-gradient-to-tr from-amber-100 via-white to-amber-50 border-amber-200'
                        : 'bg-slate-200/70 border-slate-300 grayscale opacity-50'
                    }`}
                  >
                    <span>{b.icon}</span>
                  </motion.div>
                </div>

                {/* Badge Name & Status */}
                <div className="space-y-0.5 w-full">
                  <h4 className="text-xs font-black text-slate-900 font-display line-clamp-1 leading-snug">
                    {b.name}
                  </h4>
                  <p className="text-[10px] text-slate-500 line-clamp-2 leading-tight">
                    {isUnlocked ? (
                      <span className="text-emerald-700 font-semibold flex items-center justify-center gap-1">
                        <span>Conquistada!</span>
                      </span>
                    ) : (
                      b.desc
                    )}
                  </p>
                </div>

                {/* Hover Inspector Pill */}
                <span className="mt-1 text-[9px] font-mono font-bold text-indigo-600 hover:text-indigo-800 underline underline-offset-2 opacity-80">
                  Ver Detalhes
                </span>
              </motion.button>
            </div>
          );
        })}
      </div>

      {/* Certificate Official CTA Banner */}
      <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-amber-50/80 via-yellow-50/50 to-amber-50/80 p-4 sm:p-5 rounded-2xl border border-amber-200/80 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-500 text-white flex items-center justify-center text-2xl shrink-0 shadow-xs">
            🎖️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-800 uppercase tracking-wide">
                DOCUMENTO OFICIAL
              </span>
              <span aria-hidden="true" className="text-amber-400">·</span>
              <span className="text-xs font-bold text-amber-900">
                {unlockedCount} de {totalCount} Medalhas Conquistadas
              </span>
            </div>
            <h4 className="text-sm sm:text-base font-extrabold text-slate-900 font-display">
              Certificado Oficial de Conquista & Proficiência (PDF)
            </h4>
            <p className="text-xs text-slate-600 mt-0.5 max-w-xl">
              Gere e baixe seu certificado oficial em formato PDF com selo dourado, listando todas as suas medalhas desbloqueadas e seus {score} pontos de XP.
            </p>
          </div>
        </div>

        {onSelectMission && (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              soundManager.playClick();
              onSelectMission('certificado');
            }}
            className="px-5 py-3 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-700 hover:to-amber-600 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0 border border-amber-400/50"
          >
            <Award className="w-4 h-4 text-amber-200" />
            <span>Emitir Certificado</span>
            <ArrowRight className="w-4 h-4 text-amber-200" />
          </motion.button>
        )}
      </div>

      {/* Interactive Modal: Detailed Badge Inspector */}
      <AnimatePresence>
        {selectedBadge && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBadge(null)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs cursor-pointer"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 15 }}
              transition={{ type: 'spring', stiffness: 350, damping: 24 }}
              className="relative z-10 bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden text-center p-6 sm:p-8 space-y-5"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedBadge(null)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Glowing Badge Emblem with Framer Motion spring */}
              <div className="relative flex justify-center pt-2">
                {isBadgeUnlocked(selectedBadge.id) && (
                  <motion.div
                    animate={{
                      scale: [1, 1.35, 1],
                      opacity: [0.5, 0.9, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="absolute w-28 h-28 rounded-full bg-amber-400/40 blur-xl"
                  />
                )}

                <motion.div
                  initial={{ scale: 0, rotate: -25 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                  className={`w-24 h-24 rounded-3xl flex items-center justify-center text-5xl shadow-xl border-2 relative z-10 ${
                    isBadgeUnlocked(selectedBadge.id)
                      ? 'bg-gradient-to-br from-amber-300 via-yellow-200 to-amber-500 border-amber-200 text-white shadow-amber-500/40 ring-4 ring-amber-300/40'
                      : 'bg-slate-200 border-slate-300 grayscale opacity-60'
                  }`}
                >
                  <span>{selectedBadge.icon}</span>
                </motion.div>
              </div>

              {/* Title & BNCC Pill */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full">
                    {selectedBadge.bnccCode}
                  </span>
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500">
                    {selectedBadge.category}
                  </span>
                </div>

                <h3 className="text-2xl font-black text-slate-900 font-display">
                  {selectedBadge.name}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
                  {selectedBadge.detailedDesc}
                </p>
              </div>

              {/* Requirement & Status Card */}
              <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 text-left text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700 uppercase text-[10px] tracking-wider">
                    Como Desbloquear:
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isBadgeUnlocked(selectedBadge.id)
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {isBadgeUnlocked(selectedBadge.id) ? '✓ Conquistada' : '🔒 Bloqueada'}
                  </span>
                </div>
                <p className="text-slate-600 font-medium">
                  {selectedBadge.requirement}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-3 pt-2">
                {isBadgeUnlocked(selectedBadge.id) && (
                  <button
                    onClick={() => {
                      soundManager.playFanfare();
                      confetti({
                        particleCount: 60,
                        spread: 80,
                        origin: { y: 0.6 },
                      });
                    }}
                    className="px-4 py-2.5 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>Celebrar Novamente 🎉</span>
                  </button>
                )}

                <button
                  onClick={() => setSelectedBadge(null)}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                >
                  Entendido!
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
