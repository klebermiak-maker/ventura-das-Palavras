import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Star, Trophy, CheckCircle, ArrowRight, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../utils/audio';

export interface CelebrationData {
  isOpen: boolean;
  type: 'correct' | 'level_up' | 'mission_complete' | 'badge_unlock';
  title: string;
  subtitle: string;
  points?: number;
  stars?: number;
  levelTitle?: string;
  levelIcon?: string;
  badgeName?: string;
  badgeIcon?: string;
}

interface Props {
  data: CelebrationData | null;
  onClose: () => void;
}

export const CelebrationOverlay: React.FC<Props> = ({ data, onClose }) => {
  useEffect(() => {
    if (data?.isOpen) {
      if (data.type === 'level_up' || data.type === 'mission_complete' || data.type === 'badge_unlock') {
        soundManager.playFanfare();
        // Grand multi-burst confetti
        const end = Date.now() + 1400;
        const interval: ReturnType<typeof setInterval> = setInterval(() => {
          if (Date.now() > end) {
            clearInterval(interval);
            return;
          }
          confetti({
            startVelocity: 35,
            spread: 360,
            ticks: 70,
            origin: { x: Math.random(), y: Math.random() - 0.2 },
          });
        }, 180);
      } else {
        soundManager.playCorrect();
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
        });
      }

      // Auto dismiss after 2.6s for standard answers, or 4.2s for level up and badge unlock
      const timer = setTimeout(() => {
        onClose();
      }, data.type === 'level_up' || data.type === 'badge_unlock' ? 4200 : 2600);

      return () => clearTimeout(timer);
    }
  }, [data?.isOpen, data?.type]);

  if (!data || !data.isOpen) return null;

  const isLevelUp = data.type === 'level_up';
  const isMissionComplete = data.type === 'mission_complete';
  const isBadgeUnlock = data.type === 'badge_unlock';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
      {/* Dimmed backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs pointer-events-auto"
        onClick={onClose}
      />

      {/* Main Celebratory Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6, y: 30 }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
          transition: {
            type: 'spring',
            stiffness: 350,
            damping: 22,
          },
        }}
        exit={{ opacity: 0, scale: 0.8, y: -20, transition: { duration: 0.2 } }}
        className={`relative z-10 pointer-events-auto max-w-sm w-full rounded-3xl p-6 sm:p-8 text-center shadow-2xl border ${
          isBadgeUnlock
            ? 'bg-gradient-to-b from-amber-950 via-slate-900 to-indigo-950 border-amber-400 text-white ring-4 ring-amber-400/40'
            : isLevelUp
            ? 'bg-gradient-to-b from-indigo-900 via-slate-900 to-indigo-950 border-amber-400/80 text-white ring-4 ring-amber-400/30'
            : isMissionComplete
            ? 'bg-gradient-to-b from-slate-900 to-emerald-950 border-emerald-400/80 text-white ring-4 ring-emerald-400/30'
            : 'bg-white border-emerald-200 text-slate-900 ring-4 ring-emerald-100'
        }`}
      >
        {/* Glowing Aura for Badges & Levels */}
        {(isBadgeUnlock || isLevelUp) && (
          <motion.div
            animate={{
              opacity: [0.3, 0.7, 0.3],
              scale: [0.95, 1.05, 0.95],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute inset-0 rounded-3xl bg-radial from-amber-500/20 via-transparent to-transparent pointer-events-none"
          />
        )}

        {/* Floating Badge Icon */}
        <div className="relative flex justify-center mb-4">
          {/* Pulsing halo */}
          {isBadgeUnlock && (
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute w-24 h-24 rounded-full bg-amber-400/30 blur-md"
            />
          )}

          <motion.div
            initial={{ scale: 0, rotate: -40 }}
            animate={{
              scale: [0, 1.25, 1],
              rotate: [0, 10, 0],
              transition: { delay: 0.1, type: 'spring', stiffness: 300, damping: 15 },
            }}
            className={`w-20 h-20 rounded-3xl flex items-center justify-center text-4xl shadow-lg border-2 relative z-10 ${
              isBadgeUnlock
                ? 'bg-gradient-to-br from-amber-400 via-yellow-300 to-amber-600 border-amber-200 text-white shadow-amber-500/50'
                : isLevelUp
                ? 'bg-gradient-to-br from-amber-400 to-amber-600 border-amber-200 text-white shadow-amber-500/30'
                : isMissionComplete
                ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 border-emerald-200 text-white shadow-emerald-500/30'
                : 'bg-gradient-to-br from-emerald-500 to-teal-600 border-emerald-200 text-white shadow-emerald-500/20'
            }`}
          >
            {isBadgeUnlock ? (
              <span>{data.badgeIcon || '🏅'}</span>
            ) : isLevelUp ? (
              <span>{data.levelIcon || '🌟'}</span>
            ) : isMissionComplete ? (
              <Trophy className="w-10 h-10 text-white" />
            ) : (
              <CheckCircle className="w-10 h-10 text-white" />
            )}
          </motion.div>
        </div>

        {/* Title & Tagline */}
        <div className="space-y-1.5 relative z-10">
          <motion.p
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className={`text-xs font-mono font-bold tracking-widest uppercase flex items-center justify-center gap-1.5 ${
              isBadgeUnlock
                ? 'text-amber-300'
                : isLevelUp
                ? 'text-amber-400'
                : isMissionComplete
                ? 'text-emerald-400'
                : 'text-emerald-700'
            }`}
          >
            {isBadgeUnlock ? (
              <>
                <Sparkles className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                <span>NOVA MEDALHA CONQUISTADA!</span>
              </>
            ) : isLevelUp ? (
              'NOVO NÍVEL ALCANÇADO!'
            ) : isMissionComplete ? (
              'MISSÃO CUMPRIDA!'
            ) : (
              'PARABÉNS! ACERTOU!'
            )}
          </motion.p>

          <motion.h3
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`text-2xl sm:text-3xl font-extrabold font-display ${
              isBadgeUnlock || isLevelUp || isMissionComplete ? 'text-white' : 'text-slate-900'
            }`}
          >
            {data.badgeName || data.title}
          </motion.h3>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className={`text-xs sm:text-sm leading-relaxed ${
              isLevelUp || isMissionComplete ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            {data.subtitle}
          </motion.p>
        </div>

        {/* Rewards pill (Points & Stars) */}
        {(data.points || data.stars) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className={`mt-4 inline-flex items-center justify-center gap-3 py-2 px-4 rounded-xl text-xs font-mono font-bold ${
              isLevelUp || isMissionComplete
                ? 'bg-white/10 border border-white/20 text-white'
                : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
            }`}
          >
            {data.points && (
              <span className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>+{data.points} XP</span>
              </span>
            )}
            {data.stars && (
              <span className="flex items-center gap-1 text-amber-500">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>+{data.stars} Estrela</span>
              </span>
            )}
          </motion.div>
        )}

        {/* Continue Action Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="mt-6"
        >
          <button
            onClick={onClose}
            className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm ${
              isLevelUp
                ? 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                : isMissionComplete
                ? 'bg-emerald-400 hover:bg-emerald-300 text-slate-950'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            <span>Continuar Aventura</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};
