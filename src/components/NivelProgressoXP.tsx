import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Trophy, ArrowUpRight, Zap } from 'lucide-react';
import { getPlayerLevelInfo } from '../utils/levels';

interface Props {
  score: number;
}

export const NivelProgressoXP: React.FC<Props> = ({ score }) => {
  const levelInfo = getPlayerLevelInfo(score);
  const { currentTier, nextTier, pointsInCurrentLevel, pointsNeededForNext, progressPercentage, isMaxLevel } = levelInfo;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-4">
      {/* Top Row: Current Level Title & Total XP */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-2xl shrink-0 shadow-xs">
            {currentTier.icon}
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-indigo-700 uppercase tracking-wider">
              <span>Nível {currentTier.level}</span>
              <span aria-hidden="true">·</span>
              <span>Classificação do Estudante</span>
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 font-display flex items-center gap-2">
              <span>{currentTier.title}</span>
              {isMaxLevel && (
                <span className="text-xs font-mono font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                  MÁXIMO
                </span>
              )}
            </h3>
          </div>
        </div>

        {/* Right side stats */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-slate-700">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">XP Acumulado</span>
            <span className="text-base font-bold text-slate-900 tabular-nums font-display">{score} pts</span>
          </div>

          {!isMaxLevel && nextTier && (
            <div className="hidden sm:block text-right">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Próximo Nível</span>
              <span className="font-semibold text-slate-700 flex items-center justify-end gap-1">
                <span>{nextTier.title}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-indigo-600" />
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Visual XP Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
          <span className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>Progresso para Nível {nextTier ? nextTier.level : 'Máximo'}</span>
          </span>
          <span className="font-mono tabular-nums font-semibold text-indigo-900">
            {progressPercentage}% {!isMaxLevel && nextTier ? `(${pointsInCurrentLevel} / ${nextTier.minPoints - currentTier.minPoints} XP)` : '(Completo)'}
          </span>
        </div>

        {/* Outer bar */}
        <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-amber-500 shadow-xs"
          />
        </div>
      </div>

      {/* Motivational Bottom Text */}
      <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
        <p className="italic">
          "{currentTier.perkDescription}"
        </p>

        {!isMaxLevel && nextTier ? (
          <p className="font-medium text-indigo-700 shrink-0">
            Faltam apenas <strong>{pointsNeededForNext} pontos</strong> para subir de nível!
          </p>
        ) : (
          <p className="font-bold text-amber-600 flex items-center gap-1 shrink-0">
            <Trophy className="w-3.5 h-3.5" />
            <span>Você domina a Língua Portuguesa!</span>
          </p>
        )}
      </div>
    </div>
  );
};
