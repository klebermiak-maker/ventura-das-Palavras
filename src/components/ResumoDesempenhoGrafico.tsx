import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';
import { BarChart3, TrendingUp, CheckCircle, ArrowRight, Award } from 'lucide-react';
import { BNCCSkill } from '../types/game';
import { BNCC_SKILLS_INFO } from '../data/bnccContent';
import { soundManager } from '../utils/audio';

interface Props {
  skillStats: Record<string, { attempted: number; correct: number }>;
  onNavigateToReport: () => void;
}

interface ChartItem {
  code: string;
  name: string;
  shortName: string;
  taxa: number;
  correct: number;
  attempted: number;
  color: string;
}

export const ResumoDesempenhoGrafico: React.FC<Props> = ({ skillStats, onNavigateToReport }) => {
  const skillsList: { code: BNCCSkill; shortName: string; color: string }[] = [
    { code: 'EF15LP03', shortName: 'Fatos Explícitos', color: '#10B981' },
    { code: 'EF35LP03', shortName: 'Ideia Central', color: '#0EA5E9' },
    { code: 'EF35LP04', shortName: 'Entrelinhas', color: '#F59E0B' },
    { code: 'EF05LP03', shortName: 'Acentuação', color: '#6366F1' },
  ];

  const data: ChartItem[] = skillsList.map(item => {
    const stat = skillStats[item.code] || { attempted: 0, correct: 0 };
    const taxa = stat.attempted > 0 ? Math.round((stat.correct / stat.attempted) * 100) : 0;
    const info = BNCC_SKILLS_INFO[item.code];

    return {
      code: item.code,
      name: info ? info.title : item.code,
      shortName: item.shortName,
      taxa,
      correct: stat.correct,
      attempted: stat.attempted,
      color: item.color,
    };
  });

  const totalAttempted = data.reduce((acc, curr) => acc + curr.attempted, 0);
  const totalCorrect = data.reduce((acc, curr) => acc + curr.correct, 0);
  const averageAccuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;

  // Best skill identification
  const activeSkills = data.filter(d => d.attempted > 0);
  const bestSkill = activeSkills.length > 0
    ? [...activeSkills].sort((a, b) => b.taxa - a.taxa)[0]
    : null;

  // Custom Tooltip component for Recharts
  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: any[] }) => {
    if (active && payload && payload.length) {
      const item: ChartItem = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-lg border border-slate-800 text-xs space-y-1">
          <div className="flex items-center gap-2 font-mono text-[10px] text-indigo-300 uppercase">
            <span>{item.code}</span>
            <span aria-hidden="true">·</span>
            <span>{item.shortName}</span>
          </div>
          <p className="font-bold text-sm text-white font-display">
            Taxa de Acerto: {item.taxa}%
          </p>
          <p className="text-slate-300 font-mono">
            {item.correct} acertos em {item.attempted} questões
          </p>
          <p className="text-[10px] text-slate-400 pt-1 border-t border-slate-800">
            {item.taxa >= 80 ? '⭐ Domínio Consolidado' : item.taxa >= 50 ? '📈 Em Desenvolvimento' : item.attempted === 0 ? '🎮 Faça o módulo para pontuar' : '💡 Pratique mais este módulo'}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
      {/* Header zone */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-indigo-700 uppercase tracking-wider">
              <span>DIAGNÓSTICO FORMATIVO</span>
              <span aria-hidden="true">·</span>
              <span>Língua Portuguesa 4º Ano</span>
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 font-display">
              Resumo de Desempenho por Habilidade BNCC
            </h3>
          </div>
        </div>

        <button
          onClick={() => {
            soundManager.playClick();
            onNavigateToReport();
          }}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-center"
        >
          <span>Ver Relatório Completo</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Grid: Chart + KPI Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Recharts Bar Chart (7 cols on lg) */}
        <div className="lg:col-span-8 space-y-2">
          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 15, right: 15, left: -20, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="shortName"
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                  interval={0}
                  dy={8}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                  domain={[0, 100]}
                  ticks={[0, 25, 50, 75, 100]}
                  tickFormatter={(val) => `${val}%`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="taxa"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={54}
                  animationDuration={1000}
                >
                  {data.map((entry) => (
                    <Cell key={entry.code} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-100">
            {skillsList.map(s => (
              <div key={s.code} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                <span>{s.code}: {s.shortName}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Comparative KPI Metrics (4 cols on lg) */}
        <div className="lg:col-span-4 bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-4">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
            Destaques de Aprendizagem
          </h4>

          {/* Metric 1: Average Accuracy */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
            <span className="text-xs text-slate-500 block font-medium">Aproveitamento Médio Geral</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-slate-900 font-display tabular-nums">
                {averageAccuracy}%
              </span>
              <span className="text-xs font-mono text-slate-500">
                {totalCorrect}/{totalAttempted} acertos
              </span>
            </div>
          </div>

          {/* Metric 2: Best Skill */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
            <span className="text-xs text-slate-500 block font-medium">Habilidade de Maior Destaque</span>
            {bestSkill && bestSkill.attempted > 0 ? (
              <div>
                <p className="text-sm font-bold text-slate-900 font-display flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>{bestSkill.name}</span>
                </p>
                <p className="text-xs text-emerald-600 font-mono font-semibold mt-0.5">
                  {bestSkill.taxa}% de precisão ({bestSkill.code})
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">
                Responda às questões para revelar sua maior força!
              </p>
            )}
          </div>

          {/* Metric 3: Total Completed */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
            <span className="text-xs text-slate-500 block font-medium">Questões Analisadas</span>
            <p className="text-lg font-bold text-indigo-700 font-display tabular-nums">
              {totalAttempted} tentativas
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
