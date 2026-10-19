import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, AlertTriangle, RotateCcw, Home, HelpCircle } from 'lucide-react';
import { soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';

interface Props {
  lives: number; // 0 to 3
  maxLives?: number; // default 3
  onRecoverLives?: () => void;
  onReturnToHub?: () => void;
  missionName?: string;
  pedagogicalTip?: string;
}

export const VidasAprendizado: React.FC<Props> = ({
  lives,
  maxLives = 3,
  onRecoverLives,
  onReturnToHub,
  missionName,
  pedagogicalTip,
}) => {
  const isCritical = lives === 1;
  const isGameOver = lives <= 0;

  return (
    <>
      {/* Visual Heart Widget in Game Header */}
      <div
        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all ${
          isGameOver
            ? 'bg-rose-50 border-rose-300 text-rose-800'
            : isCritical
            ? 'bg-amber-50 border-amber-300 text-amber-900 ring-2 ring-amber-200 animate-pulse'
            : 'bg-white border-slate-200 text-slate-800 shadow-2xs'
        }`}
        title={`Vidas de Aprendizado: ${lives} de ${maxLives}. Cada erro consome uma vida.`}
      >
        <div className="flex items-center gap-1">
          {Array.from({ length: maxLives }).map((_, index) => {
            const isFilled = index < lives;
            const isJustLost = index === lives;

            return (
              <div key={index} className="relative flex items-center justify-center">
                {isFilled ? (
                  <motion.div
                    animate={
                      isCritical
                        ? {
                            scale: [1, 1.25, 1],
                            rotate: [0, -3, 3, 0],
                          }
                        : {
                            scale: [1, 1.1, 1],
                          }
                    }
                    transition={{
                      duration: isCritical ? 0.7 : 1.8,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: index * 0.15,
                    }}
                  >
                    <Heart className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-rose-500 fill-rose-500 drop-shadow-xs" />
                  </motion.div>
                ) : (
                  <motion.div
                    initial={isJustLost ? { scale: 1.4, rotate: -15 } : { scale: 1 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.3 }}
                    className="opacity-35"
                  >
                    <Heart className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-slate-400 fill-slate-200" />
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>

        <div className="text-[11px] font-mono font-bold flex items-center gap-1.5 leading-none">
          <span className="hidden sm:inline font-sans text-xs font-semibold text-slate-600">
            Vidas:
          </span>
          <span
            className={`px-1.5 py-0.5 rounded-md font-extrabold ${
              isGameOver
                ? 'bg-rose-200 text-rose-900'
                : isCritical
                ? 'bg-amber-200 text-amber-900'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            {lives}/{maxLives}
          </span>
        </div>
      </div>

      {/* Modal: Game Over / Recuperação de Vidas */}
      <AnimatePresence>
        {isGameOver && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 15 }}
              transition={{ type: 'spring', stiffness: 350, damping: 24 }}
              className="relative z-10 bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 p-6 sm:p-8 text-center space-y-6 overflow-hidden"
            >
              {/* Broken Heart with Soft Glow */}
              <div className="relative flex justify-center pt-2">
                <motion.div
                  animate={{
                    scale: [1, 1.25, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute w-24 h-24 rounded-full bg-rose-400/30 blur-xl"
                />

                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: [0, 1.2, 1], rotate: [0, 10, 0] }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                  className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-rose-100 to-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center text-4xl shadow-md relative z-10"
                >
                  <span>💔</span>
                </motion.div>
              </div>

              {/* Title & Pedagogical Message */}
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-rose-700">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Vidas de Aprendizado Esgotadas</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
                  {missionName ? `Pausa Estratégica: ${missionName}` : 'Pausa Estratégica!'}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
                  Erros fazem parte do processo de aprendizagem! Aproveite este momento para reler o texto com calma e buscar as pistas essenciais.
                </p>
              </div>

              {/* Helpful Pedagogical Tip Box */}
              {pedagogicalTip && (
                <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-4 text-left text-xs space-y-1.5">
                  <div className="flex items-center gap-1.5 text-amber-900 font-bold uppercase tracking-wide text-[10px]">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Dica Estratégica do Educador:</span>
                  </div>
                  <p className="text-amber-900/90 leading-relaxed font-medium">
                    {pedagogicalTip}
                  </p>
                </div>
              )}

              {/* Action Buttons: Recover Lives or Return to Hub */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                {onReturnToHub && (
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      onReturnToHub();
                    }}
                    className="w-full sm:w-auto px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 order-2 sm:order-1"
                  >
                    <Home className="w-3.5 h-3.5" />
                    <span>Voltar ao Hub</span>
                  </button>
                )}

                {onRecoverLives && (
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      soundManager.playCorrect();
                      confetti({
                        particleCount: 50,
                        spread: 70,
                        origin: { y: 0.6 },
                      });
                      onRecoverLives();
                    }}
                    className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-rose-600 via-rose-500 to-rose-600 hover:from-rose-700 hover:to-rose-600 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 order-1 sm:order-2"
                  >
                    <Heart className="w-4 h-4 fill-white" />
                    <span>Recuperar 3 Vidas ❤️</span>
                  </motion.button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
