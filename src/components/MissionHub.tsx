import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { Search, Compass, Eye, Sparkles, Star, Award, ArrowRight, BookOpen, CheckCircle, BarChart3, HelpCircle, Users, User, UserCheck } from 'lucide-react';
import { BNCC_SKILLS_INFO } from '../data/bnccContent';
import { soundManager } from '../utils/audio';
import { DicaDeOuro } from './DicaDeOuro';
import { DicaDoDia } from './DicaDoDia';
import { NivelProgressoXP } from './NivelProgressoXP';
import { ResumoDesempenhoGrafico } from './ResumoDesempenhoGrafico';

interface Props {
  onSelectMission: (missionId: string) => void;
  starsCount: number;
  score: number;
  skillStats: Record<string, { attempted: number; correct: number }>;
  badgesEarned: string[];
  studentName?: string;
  classroomName?: string;
  onOpenRules: () => void;
  onOpenIdentityModal?: () => void;
  onBonusPoints?: (points: number) => void;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } },
};

export const MissionHub: React.FC<Props> = ({
  onSelectMission,
  starsCount,
  score,
  skillStats,
  badgesEarned,
  studentName,
  classroomName,
  onOpenRules,
  onOpenIdentityModal,
  onBonusPoints,
}) => {
  const missions = [
    {
      id: 'explicitas',
      code: 'EF15LP03',
      title: 'Detetive dos Fatos',
      desc: 'Encontre informações, datas, nomes e lugares descritos com clareza nos textos.',
      icon: Search,
      color: 'emerald',
      actionLabel: 'Iniciar Investigação',
      totalItems: 5,
    },
    {
      id: 'central',
      code: 'EF35LP03',
      title: 'A Bússola do Tema',
      desc: 'Descubra a ideia central e o tema global de cada crônica ou reportagem.',
      icon: Compass,
      color: 'sky',
      actionLabel: 'Ajustar a Bússola',
      totalItems: 4,
    },
    {
      id: 'implicitas',
      code: 'EF35LP04',
      title: 'Mago das Entrelinhas',
      desc: 'Deduzi fatos ocultos, sentimentos e intenções a partir de pistas no texto.',
      icon: Eye,
      color: 'amber',
      actionLabel: 'Decifrar Pistas',
      totalItems: 4,
    },
    {
      id: 'acentuacao',
      code: 'EF05LP03',
      title: 'Usina dos Acentos',
      desc: 'Descubra a sílaba tônica e acentue oxítonas, paroxítonas e proparoxítonas.',
      icon: Sparkles,
      color: 'indigo',
      actionLabel: 'Entrar na Usina',
      totalItems: 17,
    },
  ];

  const badges = [
    { id: 'EF15LP03', name: 'Detetive de Fatos', icon: '🔍', desc: 'Acertou perguntas explícitas' },
    { id: 'EF35LP03', name: 'Mestre da Ideia Central', icon: '🧭', desc: 'Identificou o tema global' },
    { id: 'EF35LP04', name: 'Mago das Entrelinhas', icon: '🕵️', desc: 'Fez deduções precisas' },
    { id: 'EF05LP03', name: 'Campeão da Acentuação', icon: '⚡', desc: 'Classificou tônicas e acentos' },
    { id: 'MESTRE', name: 'Mestre da Língua Portuguesa', icon: '🏆', desc: 'Conquistou mais de 5 estrelas' },
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
                onSelectMission('certificado');
              }}
              className="text-xs text-amber-800 hover:text-amber-950 font-bold bg-amber-100/80 hover:bg-amber-200 border border-amber-300 px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Award className="w-3.5 h-3.5 text-amber-600" />
              <span>Certificado 🏅</span>
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                onSelectMission('turmas');
              }}
              className="text-xs text-indigo-700 hover:text-indigo-900 font-bold bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Relatórios por Turmas (Firebase)</span>
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                onSelectMission('relatorio');
              }}
              className="text-xs text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Relatório Individual</span>
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
                whileHover={{ y: -3, transition: { duration: 0.18 } }}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow p-6 flex flex-col justify-between space-y-6 group"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                        m.color === 'emerald' ? 'bg-emerald-100 text-emerald-700' :
                        m.color === 'sky' ? 'bg-sky-100 text-sky-700' :
                        m.color === 'amber' ? 'bg-amber-100 text-amber-700' :
                        'bg-indigo-100 text-indigo-700'
                      }`}>
                        <Icon className="w-6 h-6" />
                      </div>
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
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      soundManager.playClick();
                      onSelectMission(m.id);
                    }}
                    className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 text-white ${
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
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
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
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
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

      {/* BNCC Skills Performance Bar Chart Summary */}
      <ResumoDesempenhoGrafico
        skillStats={skillStats}
        onNavigateToReport={() => onSelectMission('relatorio')}
      />

      {/* Badges / Conquistas Section */}
      <section className="bg-slate-50 rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-display flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <span>Medalhas & Distintivos de Conquista</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Demonstre domínio em cada habilidade para desbloquear as medalhas de honra
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {badges.map(b => {
            const isUnlocked = badgesEarned.includes(b.id) || (b.id === 'MESTRE' && starsCount >= 5);
            return (
              <motion.div
                key={b.id}
                whileHover={{ scale: 1.03 }}
                className={`p-4 rounded-xl border text-center transition-all flex flex-col items-center justify-center space-y-2 ${
                  isUnlocked
                    ? 'bg-white border-amber-300 shadow-xs ring-2 ring-amber-100'
                    : 'bg-slate-100/60 border-slate-200 opacity-60'
                }`}
              >
                <div className="text-3xl sm:text-4xl">
                  {b.icon}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 font-display">
                    {b.name}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {isUnlocked ? 'Desbloqueada!' : b.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Certificate CTA Banner */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-amber-50/70 p-4 rounded-xl border border-amber-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center text-xl shrink-0 shadow-xs">
              🎖️
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 font-display">
                Certificado Oficial de Conquista & Proficiência
              </h4>
              <p className="text-xs text-slate-600">
                Gere e baixe seu PDF personalizado exibindo suas medalhas, estrelas e pontuação total de {score} XP.
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              soundManager.playClick();
              onSelectMission('certificado');
            }}
            className="px-4 py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0"
          >
            <Award className="w-4 h-4 text-amber-200" />
            <span>Emitir Meu Certificado</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </motion.button>
        </div>
      </section>
    </div>
  );
};
