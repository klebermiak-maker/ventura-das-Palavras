import React, { useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Search, Compass, Eye, Sparkles, Star, Award, ArrowRight, BookOpen, CheckCircle, BarChart3, HelpCircle, Users, User, UserCheck, GraduationCap, Trophy, Lightbulb, Target } from 'lucide-react';
import { BNCC_SKILLS_INFO } from '../data/bnccContent';
import { soundManager } from '../utils/audio';
import { DicaDeOuro } from './DicaDeOuro';
import { DicaDoDia } from './DicaDoDia';
import { NivelProgressoXP } from './NivelProgressoXP';
import { ResumoDesempenhoGrafico } from './ResumoDesempenhoGrafico';
import { PainelMedalhas } from './PainelMedalhas';
import { HistoricoAtividades } from './HistoricoAtividades';
import { RankingDaTurma } from './RankingDaTurma';
import { RankingGlobal } from './RankingGlobal';
import { DicasDeLeitura } from './DicasDeLeitura';
import { MapaDeHabilidades } from './MapaDeHabilidades';
import { ActivityLogItem } from '../types/game';

interface Props {
  onSelectMission: (missionId: string) => void;
  starsCount: number;
  score: number;
  skillStats: Record<string, { attempted: number; correct: number }>;
  badgesEarned: string[];
  recentBadges?: string[];
  activityHistory?: ActivityLogItem[];
  studentName?: string;
  classroomName?: string;
  classroomId?: string;
  onOpenRules: () => void;
  onOpenIdentityModal?: () => void;
  onOpenTutorial?: () => void;
  onBonusPoints?: (points: number) => void;
  onAcknowledgeBadge?: (badgeId: string) => void;
  onSimulateBadgeUnlock?: (badgeId: string) => void;
  onAddSampleActivity?: () => void;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
};

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.88,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1], // Smooth cubic-bezier exponential ease-out
    },
  },
};

export const MissionHub: React.FC<Props> = ({
  onSelectMission,
  starsCount,
  score,
  skillStats,
  badgesEarned,
  recentBadges = [],
  activityHistory = [],
  studentName,
  classroomName,
  classroomId,
  onOpenRules,
  onOpenIdentityModal,
  onOpenTutorial,
  onBonusPoints,
  onAcknowledgeBadge,
  onSimulateBadgeUnlock,
  onAddSampleActivity,
}) => {
  const [rankingTab, setRankingTab] = useState<'global' | 'turma'>('global');
  const [chartViewMode, setChartViewMode] = useState<'radar' | 'barras'>('radar');

  const missions = [
    {
      id: 'explicitas',
      code: 'EF15LP03',
      title: 'Detetive dos Fatos',
      desc: 'Encontre informações, datas, nomes e lugares descritos com clareza nos textos exclusivos.',
      icon: Search,
      color: 'emerald',
      actionLabel: 'Iniciar Investigação',
      totalItems: 5,
    },
    {
      id: 'central',
      code: 'EF35LP03',
      title: 'A Bússola do Tema',
      desc: 'Descubra a ideia central e o tema global de crônicas e fábulas exclusivas.',
      icon: Compass,
      color: 'sky',
      actionLabel: 'Ajustar a Bússola',
      totalItems: 5,
    },
    {
      id: 'implicitas',
      code: 'EF35LP04',
      title: 'Mago das Entrelinhas',
      desc: 'Deduzi pistas ocultas, sentimentos e intenções em histórias e contos exclusivos.',
      icon: Eye,
      color: 'amber',
      actionLabel: 'Decifrar Pistas',
      totalItems: 5,
    },
    {
      id: 'acentuacao',
      code: 'EF05LP03',
      title: 'Usina dos Acentos',
      desc: 'Descubra a sílaba tônica e acentue oxítonas, paroxítonas e proparoxítonas em desafios progressivos.',
      icon: Sparkles,
      color: 'indigo',
      actionLabel: 'Entrar na Usina',
      totalItems: 15,
    },
  ];



  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Student Identification & Firebase Status Strip */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl border p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
          studentName
            ? 'bg-white border-slate-200'
            : 'bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-100/60 border-amber-300 ring-2 ring-amber-200/50'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${
              studentName
                ? 'bg-indigo-50 border border-indigo-200 text-indigo-700'
                : 'bg-amber-500 text-white animate-bounce'
            }`}
          >
            <User className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold text-slate-900 font-display">
                {studentName ? studentName : 'Estudante Não Identificado'}
              </span>
              {studentName ? (
                <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Turma Conectada
                </span>
              ) : (
                <span className="text-[10px] font-mono text-amber-800 bg-amber-200 border border-amber-300 px-2 py-0.5 rounded-full font-bold">
                  ⚠️ Identificação Necessária
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              {studentName
                ? `Turma: ${classroomName || '4º Ano A'} · Desempenho e medalhas sincronizados na nuvem`
                : 'Você precisa se identificar e escolher sua turma para salvar estrelas e entrar no Ranking.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onOpenIdentityModal && (
            <button
              onClick={() => {
                soundManager.playClick();
                onOpenIdentityModal();
              }}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-xs ${
                studentName
                  ? 'text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200'
                  : 'text-white bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 shadow-sm'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>{studentName ? 'Trocar Turma / Aluno' : 'Escolher Turma & Aluno 🚀'}</span>
            </button>
          )}

          <button
            onClick={() => {
              soundManager.playClick();
              onSelectMission('turmas');
            }}
            className="px-3.5 py-2 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors cursor-pointer border border-indigo-200 flex items-center gap-1.5"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Ver Ranking da Turma</span>
          </button>
        </div>
      </motion.div>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white p-8 sm:p-12 border border-indigo-800/50 shadow-md"
      >
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-16 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-indigo-300">
            <span>Ensino Fundamental I</span>
            <span aria-hidden="true">·</span>
            <span>{classroomName || '3º ao 5º Ano'}</span>
            <span aria-hidden="true">·</span>
            <span>Língua Portuguesa BNCC</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display text-white">
            Expedição das Letras: Conquiste o Saber
          </h1>

          <p className="text-base sm:text-lg text-indigo-100/90 leading-relaxed max-w-2xl">
            Embarque nesta jornada interativa para dominar a leitura atenta, decifrar mistérios nas entrelinhas e dominar a acentuação das palavras!
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                soundManager.playClick();
                onSelectMission('explicitas');
              }}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-sm hover:shadow-md cursor-pointer flex items-center gap-2"
            >
              <span>Começar Missão 1</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                soundManager.playClick();
                onOpenRules();
              }}
              className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded-xl transition-colors cursor-pointer flex items-center gap-2 border border-white/10"
            >
              <BookOpen className="w-4 h-4" />
              <span>Ver Manual de Acentos</span>
            </motion.button>

            {onOpenTutorial && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  soundManager.playClick();
                  onOpenTutorial();
                }}
                className="px-5 py-3 bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 font-semibold text-sm rounded-xl transition-colors cursor-pointer flex items-center gap-2 border border-amber-400/30 shadow-xs"
              >
                <span>🦉</span>
                <span>Tutorial com a Mentora Olívia</span>
              </motion.button>
            )}
          </div>
        </div>

        {/* Live Score Strip */}
        <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div>
            <span className="text-indigo-300 block">Pontuação Total</span>
            <span className="text-xl sm:text-2xl font-bold font-display text-white tabular-nums">
              {score} pts
            </span>
          </div>
          <div>
            <span className="text-indigo-300 block">Estrelas de Ouro</span>
            <span className="text-xl sm:text-2xl font-bold font-display text-amber-400 tabular-nums flex items-center gap-1">
              <Star className="w-5 h-5 fill-amber-400" />
              <span>{starsCount}</span>
            </span>
          </div>
          <div>
            <span className="text-indigo-300 block">Medalhas Obtidas</span>
            <span className="text-xl sm:text-2xl font-bold font-display text-white tabular-nums">
              {badgesEarned.length} / 5
            </span>
          </div>
          <div>
            <span className="text-indigo-300 block">Habilidades BNCC</span>
            <span className="text-xl sm:text-2xl font-bold font-display text-emerald-400">
              4 Cobertas
            </span>
          </div>
        </div>
      </motion.section>

      {/* Level Progression & XP Bar */}
      <NivelProgressoXP score={score} />

      {/* Dica do Dia: Sugestão de Tema Gramatical BNCC para preparação dos desafios */}
      <DicaDoDia
        onSelectMission={onSelectMission}
        onBonusPoints={onBonusPoints}
      />

      {/* Dica de Ouro Card */}
      <DicaDeOuro onBonusPoints={onBonusPoints} />

      {/* Dicas de Leitura: Estratégias de Interpretação Textual (EF35LP03 e EF35LP04) */}
      <div id="dicas-leitura-section">
        <DicasDeLeitura
          onSelectMission={onSelectMission}
          onBonusPoints={onBonusPoints}
        />
      </div>

      {/* 4 Missions Grid */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 font-display">
              Trilha de Missões BNCC
            </h2>
            <p className="text-sm text-slate-500">
              Escolha uma estação de treino para aprimorar suas habilidades de leitor e escritor
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {onOpenTutorial && (
              <button
                onClick={() => {
                  soundManager.playClick();
                  onOpenTutorial();
                }}
                className="text-xs text-amber-950 hover:text-black font-bold bg-amber-400 hover:bg-amber-300 border border-amber-500/30 px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                title="Abrir o tutorial narrado pela Professora Olívia"
              >
                <span>🦉</span>
                <span>Tutorial da Mentora</span>
              </button>
            )}

            <button
              onClick={() => {
                soundManager.playClick();
                const el = document.getElementById('dicas-leitura-section');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="text-xs text-sky-800 hover:text-sky-950 font-bold bg-sky-50 hover:bg-sky-100 border border-sky-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
              title="Ir para as Dicas Estratégicas de Interpretação Textual (EF35LP03 e EF35LP04)"
            >
              <Lightbulb className="w-3.5 h-3.5 text-sky-600" />
              <span>Dicas de Leitura 💡</span>
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                const el = document.getElementById('mapa-habilidades-section');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="text-xs text-emerald-800 hover:text-emerald-950 font-bold bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
              title="Ver o Mapa de Radar das 4 habilidades BNCC com pontos fortes e reforço"
            >
              <Target className="w-3.5 h-3.5 text-emerald-600" />
              <span>Mapa de Habilidades 🎯</span>
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                onSelectMission('dicionario');
              }}
              className="text-xs text-purple-700 hover:text-purple-900 font-bold bg-purple-50 border border-purple-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Dicionário Visual 📖</span>
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                onSelectMission('professor');
              }}
              className="text-xs text-slate-950 font-bold bg-amber-300 hover:bg-amber-400 border border-amber-400 px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
              title="Acessar o Espaço do Professor com relatórios de turmas e emissão de certificados"
            >
              <GraduationCap className="w-3.5 h-3.5 text-slate-900" />
              <span>Espaço do Professor 👨‍🏫</span>
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                onSelectMission('certificado');
              }}
              className="text-xs text-amber-900 hover:text-amber-950 font-bold bg-amber-100/90 hover:bg-amber-200 border border-amber-300 px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Award className="w-3.5 h-3.5 text-amber-700" />
              <span>Certificados 🏅</span>
            </button>
          </div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {missions.map(m => {
            const stats = skillStats[m.code] || { attempted: 0, correct: 0 };
            const Icon = m.icon;

            return (
              <motion.div
                key={m.id}
                variants={cardVariants}
                whileHover={{
                  y: -5,
                  scale: 1.02,
                  transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  soundManager.playClick();
                  onSelectMission(m.id);
                }}
                className="bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-lg transition-all p-6 flex flex-col justify-between space-y-6 group cursor-pointer hover:border-slate-300 relative overflow-hidden"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 3 }}
                        transition={{ type: 'spring', stiffness: 350, damping: 15 }}
                        className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${
                          m.color === 'emerald' ? 'bg-emerald-100 text-emerald-700' :
                          m.color === 'sky' ? 'bg-sky-100 text-sky-700' :
                          m.color === 'amber' ? 'bg-amber-100 text-amber-700' :
                          'bg-indigo-100 text-indigo-700'
                        }`}
                      >
                        <Icon className="w-6 h-6" />
                      </motion.div>
                      <div>
                        <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                          <span>{m.code}</span>
                          <span aria-hidden="true">·</span>
                          <span>{m.totalItems} Desafios</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 font-display group-hover:text-indigo-600 transition-colors">
                          {m.title}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed">
                    {m.desc}
                  </p>

                  {/* Progress Indicator */}
                  <div className="space-y-1.5 pt-2">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Progresso da Habilidade</span>
                      <span className="font-mono font-semibold tabular-nums text-slate-700">
                        {stats.correct} acertos de {stats.attempted} tentativas
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          m.color === 'emerald' ? 'bg-emerald-500' :
                          m.color === 'sky' ? 'bg-sky-500' :
                          m.color === 'amber' ? 'bg-amber-500' :
                          'bg-indigo-500'
                        }`}
                        style={{ width: `${Math.min(100, stats.attempted > 0 ? (stats.correct / m.totalItems) * 100 : 0)}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Habilidade BNCC alinhada</span>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      soundManager.playClick();
                      onSelectMission(m.id);
                    }}
                    className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 text-white shadow-2xs ${
                      m.color === 'emerald' ? 'bg-emerald-600 hover:bg-emerald-700' :
                      m.color === 'sky' ? 'bg-sky-600 hover:bg-sky-700' :
                      m.color === 'amber' ? 'bg-amber-600 hover:bg-amber-700' :
                      'bg-indigo-600 hover:bg-indigo-700'
                    }`}
                  >
                    <span>{m.actionLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Sprint de Palavras Arcade Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.012, y: -2 }}
          className="bg-gradient-to-r from-amber-500 via-amber-600 to-rose-600 text-white rounded-3xl p-6 sm:p-8 shadow-md flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-3xl shadow-xs shrink-0">
              ⚡
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider uppercase text-amber-200">
                <span>MODO ESPECIAL DE VELOCIDADE</span>
                <span aria-hidden="true">·</span>
                <span>BÔNUS DE XP</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold font-display text-white">
                Sprint de Palavras: Desafio de 60 Segundos!
              </h3>
              <p className="text-xs sm:text-sm text-amber-100 max-w-xl leading-relaxed">
                Responda a 10 perguntas rápidas de acentuação antes que o tempo esgote. Quanto maior sua sequência de acertos, maior o combo de pontos!
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              soundManager.playClick();
              onSelectMission('sprint');
            }}
            className="w-full md:w-auto px-6 py-3.5 bg-slate-950 hover:bg-slate-900 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 shrink-0"
          >
            <span>Jogar Sprint Agora</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </motion.button>
        </motion.div>

        {/* Dicionário Visual Glossário Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.012, y: -2 }}
          className="bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 text-white rounded-3xl p-6 sm:p-8 shadow-md flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-3xl shadow-xs shrink-0">
              📖
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider uppercase text-purple-200">
                <span>VOCABULÁRIO & ORTOGRAFIA</span>
                <span aria-hidden="true">·</span>
                <span>GLOSSÁRIO ILUSTRADO</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold font-display text-white">
                Dicionário Visual: Termos Complexos dos Jogos
              </h3>
              <p className="text-xs sm:text-sm text-purple-100 max-w-xl leading-relaxed">
                Descubra o significado, divisão silábica com sílaba tônica, pronúncia por voz e regras de ortografia de termos desafiadores como <em>Caatinga</em>, <em>Carapaça</em>, <em>Embaúba</em>, <em>Telescópio</em> e <em>Proparoxítona</em>.
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              soundManager.playClick();
              onSelectMission('dicionario');
            }}
            className="w-full md:w-auto px-6 py-3.5 bg-white hover:bg-slate-100 text-indigo-950 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 shrink-0"
          >
            <span>Abrir Dicionário Visual</span>
            <ArrowRight className="w-4 h-4 text-indigo-700" />
          </motion.button>
        </motion.div>
      </section>

      {/* Histórico das Últimas 5 Atividades & Progresso Diário */}
      <HistoricoAtividades
        activityHistory={activityHistory}
        onSelectMission={onSelectMission}
        onAddSampleActivity={onAddSampleActivity}
      />

      {/* Ranking & Hall da Fama: Competição Saudável com Ranking Global (Top 10) e Ranking da Turma */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2.5 px-1">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm">
              🏆
            </div>
            <div>
              <span className="font-extrabold text-sm text-slate-900 font-display block">
                Tabelas de Classificação & Conquista
              </span>
              <span className="text-[11px] text-slate-500 block">
                Alunos com maiores pontuações no sistema BNCC
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => {
                soundManager.playClick();
                setRankingTab('global');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                rankingTab === 'global'
                  ? 'bg-amber-400 text-slate-950 shadow-xs ring-2 ring-amber-300 font-extrabold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              <span>🌍</span>
              <span>Top 10 Global (Escola)</span>
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                setRankingTab('turma');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                rankingTab === 'turma'
                  ? 'bg-indigo-600 text-white shadow-xs font-extrabold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              <span>🏫</span>
              <span>Minha Turma ({classroomName || '4º Ano A'})</span>
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {rankingTab === 'global' ? (
            <motion.div
              key="tab-ranking-global"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <RankingGlobal
                currentStudentName={studentName || ''}
                userScore={score}
                userStars={starsCount}
                userClassroomId={classroomId || 'turma-4a'}
                userClassroomName={classroomName || '4º Ano A'}
                onSelectMission={onSelectMission}
                onOpenIdentityModal={onOpenIdentityModal}
              />
            </motion.div>
          ) : (
            <motion.div
              key="tab-ranking-turma"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <RankingDaTurma
                classroomId={classroomId || 'turma-4a'}
                classroomName={classroomName || '4º Ano A'}
                currentStudentName={studentName || ''}
                userScore={score}
                userStars={starsCount}
                onSelectMission={onSelectMission}
                onOpenIdentityModal={onOpenIdentityModal}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Diagnóstico de Habilidades BNCC: Mapa de Radar & Gráfico de Barras */}
      <div id="mapa-habilidades-section" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2.5 px-1">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
              🎯
            </div>
            <div>
              <span className="font-extrabold text-sm text-slate-900 font-display block">
                Mapa Diagnóstico de Habilidades BNCC
              </span>
              <span className="text-[11px] text-slate-500 block">
                Gráfico de radar multidimensional com pontos fortes e áreas que precisam de reforço
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => {
                soundManager.playClick();
                setChartViewMode('radar');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                chartViewMode === 'radar'
                  ? 'bg-emerald-600 text-white shadow-xs font-extrabold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              <span>🕸️</span>
              <span>Mapa Radar BNCC</span>
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                setChartViewMode('barras');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                chartViewMode === 'barras'
                  ? 'bg-indigo-600 text-white shadow-xs font-extrabold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              <span>📊</span>
              <span>Gráfico de Barras</span>
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {chartViewMode === 'radar' ? (
            <motion.div
              key="view-radar"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <MapaDeHabilidades
                skillStats={skillStats}
                studentName={studentName}
                onSelectMission={onSelectMission}
                onNavigateToReport={() => onSelectMission('relatorio')}
              />
            </motion.div>
          ) : (
            <motion.div
              key="view-barras"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <ResumoDesempenhoGrafico
                skillStats={skillStats}
                onNavigateToReport={() => onSelectMission('relatorio')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Badges / Conquistas Section with Glowing & Pulsing Framer Motion animations */}
      <PainelMedalhas
        badgesEarned={badgesEarned}
        recentBadges={recentBadges}
        starsCount={starsCount}
        score={score}
        onSelectMission={onSelectMission}
        onAcknowledgeBadge={onAcknowledgeBadge}
        onSimulateBadgeUnlock={onSimulateBadgeUnlock}
      />
    </div>
  );
};
