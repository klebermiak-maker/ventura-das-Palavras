import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  History,
  Calendar,
  Clock,
  Sparkles,
  Award,
  Star,
  Zap,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  TrendingUp,
  Target,
  PlusCircle,
} from 'lucide-react';
import { ActivityLogItem } from '../types/game';
import { soundManager } from '../utils/audio';

interface Props {
  activityHistory?: ActivityLogItem[];
  onSelectMission?: (missionId: string) => void;
  onAddSampleActivity?: () => void;
}

// Fallback demo activities to showcase when a new student begins
const DEFAULT_DEMO_ACTIVITIES: ActivityLogItem[] = [
  {
    id: 'demo-1',
    missionId: 'explicitas',
    missionTitle: 'Detetive dos Fatos',
    skillCode: 'EF15LP03',
    icon: '🔍',
    scoreEarned: 100,
    starsEarned: 1,
    completedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    formattedDate: 'Hoje às 10:15',
    questionsAnswered: 5,
  },
  {
    id: 'demo-2',
    missionId: 'acentuacao',
    missionTitle: 'Usina dos Acentos',
    skillCode: 'EF05LP03',
    icon: '⚡',
    scoreEarned: 120,
    starsEarned: 1,
    completedAt: new Date(Date.now() - 75 * 60 * 1000).toISOString(),
    formattedDate: 'Hoje às 09:25',
    questionsAnswered: 4,
  },
  {
    id: 'demo-3',
    missionId: 'central',
    missionTitle: 'A Bússola do Tema',
    skillCode: 'EF35LP03',
    icon: '🧭',
    scoreEarned: 100,
    starsEarned: 1,
    completedAt: new Date(Date.now() - 180 * 60 * 1000).toISOString(),
    formattedDate: 'Hoje às 07:40',
    questionsAnswered: 3,
  },
];

export const HistoricoAtividades: React.FC<Props> = ({
  activityHistory = [],
  onSelectMission,
  onAddSampleActivity,
}) => {
  // Use actual history if available; otherwise show recent demo activities
  const displayItems = activityHistory.length > 0 ? activityHistory.slice(0, 5) : DEFAULT_DEMO_ACTIVITIES;
  const isDemo = activityHistory.length === 0;

  // Calculate quick stats
  const totalCompleted = activityHistory.length > 0 ? activityHistory.length : DEFAULT_DEMO_ACTIVITIES.length;
  const totalScoreInHistory = displayItems.reduce((acc, curr) => acc + curr.scoreEarned, 0);
  const totalStarsInHistory = displayItems.reduce((acc, curr) => acc + curr.starsEarned, 0);

  // Format date helper
  const formatDateDisplay = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const isToday =
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear();

      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');

      if (isToday) {
        return `Hoje às ${hours}:${minutes}`;
      }
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      return `${day}/${month} às ${hours}:${minutes}`;
    } catch {
      return dateStr;
    }
  };

  return (
    <section className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6 overflow-hidden relative">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-50/50 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-100 text-indigo-700 shadow-2xs">
              <History className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold tracking-wider uppercase text-indigo-700">
                <Clock className="w-3.5 h-3.5 text-indigo-600" />
                <span>Acompanhamento Diário</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">
                Histórico de Atividades
              </h2>
            </div>
          </div>
          <p className="text-xs text-slate-500 max-w-xl">
            Veja as últimas 5 missões concluídas com pontuação obtida, estrelas e data para acompanhar seu progresso diário de estudos.
          </p>
        </div>

        {/* Quick KPI stats */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-2xl text-center shadow-2xs">
            <span className="text-[10px] font-mono font-semibold uppercase text-slate-400 block">
              Missões
            </span>
            <span className="text-base font-extrabold text-slate-900 font-display">
              {totalCompleted}
            </span>
          </div>

          <div className="bg-amber-50/70 border border-amber-200 px-3.5 py-2 rounded-2xl text-center shadow-2xs">
            <span className="text-[10px] font-mono font-semibold uppercase text-amber-700 block">
              Pontos Registrados
            </span>
            <span className="text-base font-extrabold text-amber-900 font-display">
              +{totalScoreInHistory} XP
            </span>
          </div>

          {onAddSampleActivity && (
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                soundManager.playClick();
                onAddSampleActivity();
              }}
              title="Registrar atividade de teste para visualizar no histórico"
              className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <PlusCircle className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden md:inline">Simular Conclusão</span>
            </motion.button>
          )}
        </div>
      </div>

      {/* Daily Progress Goal Banner */}
      <div className="bg-gradient-to-r from-indigo-50/90 via-slate-50 to-indigo-50/90 p-4 rounded-2xl border border-indigo-100/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-xs shrink-0">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-900 font-display">
                Meta Diária: 3 Missões por Dia
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                {displayItems.length >= 3 ? '✓ Meta Concluída' : `${displayItems.length}/3 em andamento`}
              </span>
            </div>
            <p className="text-slate-600 mt-0.5 text-[11px]">
              Estudar um pouco todos os dias fortalece a memória de longo prazo e a proficiência leitora BNCC!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-indigo-800 bg-white px-3 py-1.5 rounded-xl border border-indigo-200/80 shadow-2xs shrink-0">
          <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
          <span>{displayItems.length} de 5 Registros Recentes</span>
        </div>
      </div>

      {/* Timeline List of Last 5 Activities */}
      <div className="space-y-3 relative z-10">
        <AnimatePresence>
          {displayItems.map((item, index) => {
            const formattedDate = item.formattedDate || formatDateDisplay(item.completedAt);

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25, delay: index * 0.05 }}
                className="bg-white hover:bg-slate-50/80 border border-slate-200/90 hover:border-indigo-300 rounded-2xl p-4 transition-all shadow-2xs hover:shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                {/* Left: Icon, Mission Title, Skill & Date */}
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-50 to-purple-50 border border-indigo-100 flex items-center justify-center text-2xl shadow-2xs shrink-0">
                    {item.icon}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-black text-slate-900 font-display">
                        {item.missionTitle}
                      </h4>
                      {item.skillCode && (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-100 text-indigo-700">
                          {item.skillCode}
                        </span>
                      )}
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Concluída</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                      <span className="flex items-center gap-1 text-slate-600">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{formattedDate}</span>
                      </span>
                      {item.questionsAnswered && (
                        <>
                          <span aria-hidden="true" className="text-slate-300">·</span>
                          <span>{item.questionsAnswered} desafios respondidos</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Score, Stars & Action Button */}
                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-black text-amber-800 bg-amber-100/80 px-2.5 py-1 rounded-xl border border-amber-200/80 flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                      <span>+{item.scoreEarned} XP</span>
                    </span>

                    {item.starsEarned > 0 && (
                      <span className="text-xs font-mono font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-xl border border-amber-200 flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span>+{item.starsEarned}</span>
                      </span>
                    )}
                  </div>

                  {onSelectMission && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        soundManager.playClick();
                        onSelectMission(item.missionId);
                      }}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-indigo-600 text-slate-700 hover:text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                      title={`Jogar novamente a missão ${item.missionTitle}`}
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Treinar</span>
                    </motion.button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {isDemo && (
        <div className="text-center text-xs text-slate-400 italic pt-1">
          * Atividades de demonstração para inspirar sua rotina de estudos. Conclua qualquer missão para registrar seu histórico real!
        </div>
      )}
    </section>
  );
};
