import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  Legend,
} from 'recharts';
import {
  Compass,
  Search,
  Eye,
  Sparkles,
  TrendingUp,
  Award,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Zap,
  Target,
  BookOpen,
  Info,
} from 'lucide-react';
import { BNCCSkill } from '../types/game';
import { BNCC_SKILLS_INFO } from '../data/bnccContent';
import { soundManager } from '../utils/audio';

interface Props {
  skillStats: Record<string, { attempted: number; correct: number }>;
  studentName?: string;
  onSelectMission?: (missionId: string) => void;
  onNavigateToReport?: () => void;
}

interface SkillRadarData {
  code: BNCCSkill;
  subject: string;
  shortLabel: string;
  missionId: string;
  missionTitle: string;
  icon: any;
  studentScore: number; // 0 to 100
  targetScore: number;  // Expected standard 80%
  attempted: number;
  correct: number;
  color: string;
  badgeBg: string;
  description: string;
  recommendedTip: string;
}

export const MapaDeHabilidades: React.FC<Props> = ({
  skillStats,
  studentName = '',
  onSelectMission,
  onNavigateToReport,
}) => {
  const [selectedSkillCode, setSelectedSkillCode] = useState<BNCCSkill | 'ALL'>('ALL');
  const [showTargetBenchmark, setShowTargetBenchmark] = useState<boolean>(true);

  const skillsConfig: {
    code: BNCCSkill;
    shortLabel: string;
    missionId: string;
    missionTitle: string;
    icon: any;
    color: string;
    badgeBg: string;
    recommendedTip: string;
  }[] = [
    {
      code: 'EF15LP03',
      shortLabel: 'Fatos Explícitos',
      missionId: 'explicitas',
      missionTitle: 'Detetive dos Fatos',
      icon: Search,
      color: '#10B981', // emerald
      badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      recommendedTip: 'Localize datas, nomes e lugares descritos com exatidão nas linhas do texto.',
    },
    {
      code: 'EF35LP03',
      shortLabel: 'Ideia Central',
      missionId: 'central',
      missionTitle: 'A Bússola do Tema',
      icon: Compass,
      color: '#0EA5E9', // sky
      badgeBg: 'bg-sky-50 text-sky-800 border-sky-200',
      recommendedTip: 'Identifique o tema do texto do início ao fim, sem se apegar a detalhes isolados.',
    },
    {
      code: 'EF35LP04',
      shortLabel: 'Entrelinhas',
      missionId: 'implicitas',
      missionTitle: 'Mago das Entrelinhas',
      icon: Eye,
      color: '#F59E0B', // amber
      badgeBg: 'bg-amber-50 text-amber-900 border-amber-200',
      recommendedTip: 'Junte as pistas com sua experiência para deduzir sentimentos e intenções ocultas.',
    },
    {
      code: 'EF05LP03',
      shortLabel: 'Acentuação',
      missionId: 'acentuacao',
      missionTitle: 'Usina dos Acentos',
      icon: Sparkles,
      color: '#6366F1', // indigo
      badgeBg: 'bg-indigo-50 text-indigo-900 border-indigo-200',
      recommendedTip: 'Descubra a sílaba tônica (oxítonas, paroxítonas e proparoxítonas) e aplique as regras.',
    },
  ];

  const radarData: SkillRadarData[] = skillsConfig.map(config => {
    const stat = skillStats[config.code] || { attempted: 0, correct: 0 };
    const accuracy = stat.attempted > 0 ? Math.round((stat.correct / stat.attempted) * 100) : 0;
    const info = BNCC_SKILLS_INFO[config.code];

    return {
      code: config.code,
      subject: config.shortLabel,
      shortLabel: config.shortLabel,
      missionId: config.missionId,
      missionTitle: config.missionTitle,
      icon: config.icon,
      studentScore: accuracy,
      targetScore: 80, // 80% BNCC benchmark
      attempted: stat.attempted,
      correct: stat.correct,
      color: config.color,
      badgeBg: config.badgeBg,
      description: info ? info.shortDesc : 'Habilidade BNCC de Língua Portuguesa',
      recommendedTip: config.recommendedTip,
    };
  });

  // Calculate totals and overall proficiency
  const totalAttempted = radarData.reduce((acc, curr) => acc + curr.attempted, 0);
  const totalCorrect = radarData.reduce((acc, curr) => acc + curr.correct, 0);
  const averageMastery = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;

  // Identify strengths (Pontos Fortes) and reinforcement areas (Áreas de Reforço)
  const strongSkills = radarData.filter(s => s.attempted >= 2 && s.studentScore >= 70);
  const reinforcementSkills = radarData.filter(s => s.attempted === 0 || s.studentScore < 70);

  // Proficiency label & badge
  const getProficiencyStatus = (avg: number) => {
    if (avg >= 85) return { label: 'Avançado', color: 'text-emerald-700 bg-emerald-100 border-emerald-300', icon: '🌟' };
    if (avg >= 70) return { label: 'Proficiente', color: 'text-sky-700 bg-sky-100 border-sky-300', icon: '🎯' };
    if (avg >= 50) return { label: 'Básico', color: 'text-amber-800 bg-amber-100 border-amber-300', icon: '⚡' };
    return { label: 'Em Desenvolvimento', color: 'text-rose-700 bg-rose-100 border-rose-300', icon: '🌱' };
  };

  const currentProficiency = getProficiencyStatus(averageMastery);

  // Custom Recharts Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload as SkillRadarData;
      return (
        <div className="bg-slate-900 text-white p-3.5 rounded-2xl shadow-xl border border-slate-700 text-xs space-y-1.5 z-50">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-amber-400">{dataPoint.code}</span>
            <span className="font-bold text-white">· {dataPoint.subject}</span>
          </div>
          <div className="flex items-center justify-between gap-4 pt-1 border-t border-slate-700/80 font-mono">
            <span className="text-slate-300">Rendimento Aluno:</span>
            <span className="font-bold text-emerald-400 text-sm tabular-nums">
              {dataPoint.studentScore}%
            </span>
          </div>
          <div className="flex items-center justify-between gap-4 font-mono text-[11px]">
            <span className="text-slate-400">Acertos / Tentativas:</span>
            <span className="text-slate-200">
              {dataPoint.correct} / {dataPoint.attempted}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4 font-mono text-[11px]">
            <span className="text-slate-400">Meta BNCC (4º Ano):</span>
            <span className="text-amber-300 font-bold">80%</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <section className="bg-white rounded-3xl border border-slate-200/90 shadow-md p-6 sm:p-8 space-y-8 relative overflow-hidden">
      {/* Decorative ambient gradient */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-emerald-400/10 via-sky-400/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-indigo-500/10 via-purple-400/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6 relative z-10">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-mono font-extrabold uppercase tracking-wider text-emerald-900 bg-emerald-100/90 border border-emerald-300 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xs">
              <Target className="w-3.5 h-3.5 text-emerald-600" />
              <span>Diagnóstico Radar BNCC</span>
            </span>

            <span className="text-[11px] font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-full flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
              <span>4 Descritores do 4º Ano</span>
            </span>

            <span className={`text-[11px] font-mono font-bold px-2.5 py-1 rounded-full border flex items-center gap-1 shadow-2xs ${currentProficiency.color}`}>
              <span>{currentProficiency.icon}</span>
              <span>{currentProficiency.label} ({averageMastery}%)</span>
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 tracking-tight flex items-center gap-2.5">
            <span>🕸️ Mapa de Habilidades & Radar de Aprendizagem</span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
            Visualize o equilíbrio de competências leitoras de {studentName ? <strong>{studentName}</strong> : 'seu perfil'}. Identifique onde você já brilha e quais habilidades merecem mais treino!
          </p>
        </div>

        {/* Target Benchmark Toggle */}
        <div className="flex items-center gap-3 shrink-0 self-start md:self-auto">
          <button
            onClick={() => {
              soundManager.playClick();
              setShowTargetBenchmark(!showTargetBenchmark);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
              showTargetBenchmark
                ? 'bg-amber-50 text-amber-900 border-amber-300 shadow-2xs'
                : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>{showTargetBenchmark ? 'Meta BNCC Ativa (80%)' : 'Ocultar Meta'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Radar Chart + Diagnostic Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        {/* Left Column: Interactive Radar Chart */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center p-4 bg-slate-50/70 rounded-3xl border border-slate-200/80">
          <div className="w-full h-72 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} outerRadius="75%">
                <PolarGrid stroke="#cbd5e1" strokeDasharray="3 3" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: '#334155', fontSize: 11, fontWeight: 700 }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 100]}
                  tick={{ fill: '#94a3b8', fontSize: 10 }}
                  stroke="#cbd5e1"
                />

                {/* Benchmark Radar Polygon */}
                {showTargetBenchmark && (
                  <Radar
                    name="Meta BNCC (4º Ano)"
                    dataKey="targetScore"
                    stroke="#f59e0b"
                    fill="#f59e0b"
                    fillOpacity={0.12}
                    strokeDasharray="4 4"
                    strokeWidth={2}
                  />
                )}

                {/* Student Current Performance Polygon */}
                <Radar
                  name={studentName || 'Meu Rendimento'}
                  dataKey="studentScore"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.45}
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#059669', stroke: '#ffffff', strokeWidth: 2 }}
                />

                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: 10, fontSize: 12, fontWeight: 600 }}
                  iconType="circle"
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-2 text-center text-xs text-slate-500 flex items-center justify-center gap-4">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Verde: Seu Desempenho</span>
            </span>
            {showTargetBenchmark && (
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Tracejado: Meta (80%)</span>
              </span>
            )}
          </div>
        </div>

        {/* Right Column: Pedagogical Diagnosis Cards */}
        <div className="lg:col-span-6 space-y-4">
          {/* Box 1: Pontos Fortes (Fortalezas) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200/90 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                  <Award className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-extrabold text-emerald-950 font-display">
                  Pontos Fortes (Habilidades Consolidadas)
                </h3>
              </div>
              <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                {strongSkills.length} de 4
              </span>
            </div>

            {strongSkills.length > 0 ? (
              <div className="space-y-2">
                {strongSkills.map(s => {
                  const Icon = s.icon;
                  return (
                    <div
                      key={s.code}
                      className="p-3 bg-white rounded-xl border border-emerald-200 flex items-center justify-between gap-3 shadow-2xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-slate-900 truncate block">
                            {s.code}: {s.shortLabel}
                          </span>
                          <span className="text-[11px] text-emerald-700 font-semibold block">
                            {s.correct} acertos ({s.studentScore}%)
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 shrink-0">
                        Excelente Domínio 👏
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-emerald-800 bg-white/80 p-3 rounded-xl border border-emerald-200">
                Jogue mais missões para atingir 70% de acertos e registrar seus pontos fortes no radar!
              </p>
            )}
          </div>

          {/* Box 2: Áreas que Precisam de Reforço */}
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200/90 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs shadow-2xs">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-extrabold text-amber-950 font-display">
                  Áreas que Precisam de Reforço (Atenção & Treino)
                </h3>
              </div>
              <span className="text-[11px] font-mono font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md">
                {reinforcementSkills.length} precisam de atenção
              </span>
            </div>

            {reinforcementSkills.length > 0 ? (
              <div className="space-y-2">
                {reinforcementSkills.map(s => {
                  const Icon = s.icon;
                  return (
                    <div
                      key={s.code}
                      className="p-3 bg-white rounded-xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-slate-900 truncate block">
                            {s.code}: {s.shortLabel}
                          </span>
                          <span className="text-[11px] text-amber-800 font-medium block">
                            {s.attempted === 0 ? 'Nenhuma questão tentada ainda' : `${s.studentScore}% de precisão (${s.correct}/${s.attempted})`}
                          </span>
                        </div>
                      </div>

                      {onSelectMission && (
                        <button
                          onClick={() => {
                            soundManager.playClick();
                            onSelectMission(s.missionId);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-[11px] transition-colors cursor-pointer flex items-center justify-center gap-1.5 shrink-0 shadow-2xs"
                        >
                          <span>Treinar Agora</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-emerald-800 bg-white/80 p-3 rounded-xl border border-emerald-200 font-bold">
                🎉 Parabéns extraordinário! Você atingiu ou superou a meta de 70% em todas as habilidades BNCC!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 4 Skills Micro-Deck (Detailed Cards with Progress Bars and Mentoring Tips) */}
      <div className="space-y-3 pt-2">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
          Progresso Detalhado Habilidade a Habilidade
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {radarData.map(s => {
            const Icon = s.icon;
            const isStrength = s.studentScore >= 70 && s.attempted >= 2;

            return (
              <div
                key={s.code}
                className="bg-white rounded-2xl border border-slate-200/90 p-4.5 space-y-3 flex flex-col justify-between shadow-2xs hover:shadow-sm hover:border-slate-300 transition-all"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${s.color}20`, color: s.color }}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
                      isStrength ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {s.code}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900 leading-tight">
                      {s.shortLabel}
                    </h4>
                    <span className="text-[11px] text-slate-500 block truncate">
                      {s.missionTitle}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-slate-500">Rendimento</span>
                      <span className="font-bold text-slate-900">{s.studentScore}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${s.studentScore}%`,
                          backgroundColor: s.color,
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span>{s.correct} acertos</span>
                      <span>Meta: 80%</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-600 leading-relaxed bg-slate-50 p-2 rounded-lg border border-slate-100">
                    💡 <em>{s.recommendedTip}</em>
                  </p>
                </div>

                {onSelectMission && (
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      onSelectMission(s.missionId);
                    }}
                    className="w-full mt-2 py-2 text-xs font-bold rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Abrir Missão</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
