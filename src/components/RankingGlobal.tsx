import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Medal,
  Star,
  Award,
  Sparkles,
  RefreshCw,
  Crown,
  Users,
  School,
  ArrowRight,
  TrendingUp,
  Flame,
  ShieldCheck,
  GraduationCap,
  Heart,
  Zap,
  Filter,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  GlobalRankedStudent,
  fetchGlobalRankingFromFirebase,
  OFFICIAL_SCHOOL_NAME,
} from '../services/firebase';
import { soundManager } from '../utils/audio';

interface Props {
  currentStudentName?: string;
  userScore: number;
  userStars: number;
  userClassroomId?: string;
  userClassroomName?: string;
  onSelectMission?: (missionId: string) => void;
  onOpenIdentityModal?: () => void;
}

export const RankingGlobal: React.FC<Props> = ({
  currentStudentName = '',
  userScore,
  userStars,
  userClassroomId = 'turma-4a',
  userClassroomName = '4º Ano A',
  onSelectMission,
  onOpenIdentityModal,
}) => {
  const [rankedStudents, setRankedStudents] = useState<GlobalRankedStudent[]>([]);
  const [totalStudentsCount, setTotalStudentsCount] = useState<number>(0);
  const [classroomsCount, setClassroomsCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [gradeFilter, setGradeFilter] = useState<'all' | '3' | '4' | '5'>('all');
  const [cheeredStudentId, setCheeredStudentId] = useState<string | null>(null);

  useEffect(() => {
    loadGlobalRanking();
  }, []);

  const loadGlobalRanking = async () => {
    setIsLoading(true);
    try {
      const data = await fetchGlobalRankingFromFirebase(20);
      setRankedStudents(data.students);
      setTotalStudentsCount(data.totalStudentsCount);
      setClassroomsCount(data.classroomsCount);
    } catch (err) {
      console.error('Erro ao carregar ranking global:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    soundManager.playClick();
    loadGlobalRanking();
  };

  const handleCheer = (studentId: string, studentName: string) => {
    soundManager.playFanfare();
    setCheeredStudentId(studentId);

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#f59e0b', '#10b981', '#6366f1', '#ec4899', '#3b82f6'],
      });
    } catch {
      // Confetti fallback
    }

    setTimeout(() => {
      setCheeredStudentId(null);
    }, 2000);
  };

  // Merge the current logged-in student's live score if greater or not yet synced
  const mergedPool = [...rankedStudents];
  if (currentStudentName && currentStudentName.trim() !== '') {
    const existingIdx = mergedPool.findIndex(
      s => s.studentName.toLowerCase().trim() === currentStudentName.toLowerCase().trim()
    );

    if (existingIdx >= 0) {
      if (userScore > mergedPool[existingIdx].score) {
        mergedPool[existingIdx] = {
          ...mergedPool[existingIdx],
          score: userScore,
          starsEarned: Math.max(mergedPool[existingIdx].starsEarned, userStars),
          classroomName: userClassroomName || mergedPool[existingIdx].classroomName,
        };
      }
    } else if (userScore > 0) {
      mergedPool.push({
        studentId: 'user_active_' + Date.now(),
        studentName: currentStudentName,
        classroomId: userClassroomId,
        classroomName: userClassroomName,
        score: userScore,
        starsEarned: userStars,
        levelNumber: 1,
        levelTitle: 'Aprendiz',
        badgesCount: 1,
        ef15lp03_correct: 0,
        ef15lp03_attempted: 0,
        ef35lp03_correct: 0,
        ef35lp03_attempted: 0,
        ef35lp04_correct: 0,
        ef35lp04_attempted: 0,
        ef05lp03_correct: 0,
        ef05lp03_attempted: 0,
        updatedAt: new Date().toISOString(),
      });
    }
  }

  // Re-sort after potential local merge
  mergedPool.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.starsEarned - a.starsEarned;
  });

  // Apply grade filter if user wants to filter by 3º, 4º or 5º ano
  const filteredStudents = mergedPool.filter(s => {
    if (gradeFilter === 'all') return true;
    const name = (s.classroomName || '').toLowerCase();
    const id = (s.classroomId || '').toLowerCase();
    return name.includes(`${gradeFilter}º`) || id.includes(`turma-${gradeFilter}`);
  });

  // The Top 10
  const top10 = filteredStudents.slice(0, 10);
  const highestScore = top10[0]?.score || 1;

  // Current user ranking calculations
  const currentUserIndexInFiltered = filteredStudents.findIndex(
    s => s.studentName.toLowerCase().trim() === currentStudentName.toLowerCase().trim()
  );
  const isCurrentUserInTop10 = currentUserIndexInFiltered >= 0 && currentUserIndexInFiltered < 10;
  const currentUserRank = currentUserIndexInFiltered >= 0 ? currentUserIndexInFiltered + 1 : null;
  const cutoffScoreForTop10 = top10.length >= 10 ? top10[9].score : 0;
  const pointsNeededForTop10 = Math.max(0, cutoffScoreForTop10 - userScore + 10);

  // Helper avatar styling for podium
  const getPodiumBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return {
          label: '1º Lugar Geral',
          tag: 'Campeão da Escola',
          crown: true,
          medalIcon: '🥇',
          bgGradient: 'from-amber-400 via-yellow-300 to-amber-500',
          textColor: 'text-amber-950',
          borderColor: 'border-amber-400',
          ringColor: 'ring-amber-300/60',
          pedestalHeight: 'h-48 sm:h-56',
        };
      case 2:
        return {
          label: '2º Lugar Geral',
          tag: 'Vice-Campeão',
          crown: false,
          medalIcon: '🥈',
          bgGradient: 'from-slate-200 via-slate-300 to-slate-400',
          textColor: 'text-slate-900',
          borderColor: 'border-slate-300',
          ringColor: 'ring-slate-300/60',
          pedestalHeight: 'h-40 sm:h-44',
        };
      case 3:
        return {
          label: '3º Lugar Geral',
          tag: '3º Colocado',
          crown: false,
          medalIcon: '🥉',
          bgGradient: 'from-amber-600 via-orange-400 to-amber-700',
          textColor: 'text-white',
          borderColor: 'border-amber-600',
          ringColor: 'ring-amber-500/60',
          pedestalHeight: 'h-32 sm:h-36',
        };
      default:
        return {
          label: `${rank}º Lugar`,
          tag: 'Top 10',
          crown: false,
          medalIcon: '🎖️',
          bgGradient: 'from-indigo-600 to-indigo-800',
          textColor: 'text-white',
          borderColor: 'border-indigo-400',
          ringColor: 'ring-indigo-300',
          pedestalHeight: 'h-24',
        };
    }
  };

  return (
    <section className="bg-white rounded-3xl border border-slate-200/90 shadow-md p-6 sm:p-8 space-y-8 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute -top-16 -right-16 w-72 h-72 bg-gradient-to-br from-amber-400/10 to-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-gradient-to-tr from-sky-400/10 to-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header with Title, School Banner and Live Refresh */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6 relative z-10">
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-mono font-extrabold uppercase tracking-wider text-amber-900 bg-amber-100 border border-amber-300 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xs">
              <Trophy className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
              <span>Ranking Global Oficial</span>
            </span>

            <span className="text-[11px] font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-full flex items-center gap-1">
              <School className="w-3.5 h-3.5 text-indigo-500" />
              <span className="truncate max-w-[280px]">{OFFICIAL_SCHOOL_NAME}</span>
            </span>

            <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Sincronizado via Firestore</span>
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 tracking-tight flex items-center gap-2.5">
            <span>🏆 Top 10 Melhores Alunos de Todas as Turmas</span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
            Acompanhe a tabela geral da escola! Os 10 estudantes com as maiores pontuações somadas nas missões BNCC e no Sprint Relâmpago.
          </p>
        </div>

        {/* Action Controls & Filters */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {/* Grade filter buttons */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => {
                soundManager.playClick();
                setGradeFilter('all');
              }}
              className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                gradeFilter === 'all'
                  ? 'bg-white text-indigo-950 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => {
                soundManager.playClick();
                setGradeFilter('3');
              }}
              className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                gradeFilter === '3'
                  ? 'bg-white text-indigo-950 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              3º Anos
            </button>
            <button
              onClick={() => {
                soundManager.playClick();
                setGradeFilter('4');
              }}
              className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                gradeFilter === '4'
                  ? 'bg-white text-indigo-950 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              4º Anos
            </button>
            <button
              onClick={() => {
                soundManager.playClick();
                setGradeFilter('5');
              }}
              className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                gradeFilter === '5'
                  ? 'bg-white text-indigo-950 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              5º Anos
            </button>
          </div>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-bold text-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="Consultar Firestore e recarregar ranking global"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-indigo-600' : ''}`} />
            <span>{isLoading ? 'Consultando...' : 'Atualizar'}</span>
          </button>
        </div>
      </div>

      {/* Quick Stat Highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-2xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center text-lg shrink-0">
            🥇
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Líder Atual</span>
            <span className="text-sm font-extrabold text-slate-900 truncate block max-w-[130px]">
              {top10[0]?.studentName || '—'}
            </span>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-2xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-lg shrink-0">
            ⚡
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Maior Pontuação</span>
            <span className="text-sm font-extrabold text-indigo-950 tabular-nums">
              {top10[0]?.score ? `${top10[0].score} pts` : '—'}
            </span>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-2xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center text-lg shrink-0">
            👥
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Alunos no Radar</span>
            <span className="text-sm font-extrabold text-slate-900 tabular-nums">
              {totalStudentsCount} participantes
            </span>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-2xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-lg shrink-0">
            🏫
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Turmas na Disputa</span>
            <span className="text-sm font-extrabold text-slate-900">
              {classroomsCount || 15} Turmas (A ao E)
            </span>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-slate-600 font-medium">Consultando estudantes no Firestore...</p>
        </div>
      ) : top10.length === 0 ? (
        <div className="py-12 text-center text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          Nenhum estudante encontrado para o filtro selecionado.
        </div>
      ) : (
        <div className="space-y-8">
          {/* THE TOP 3 PODIUM */}
          <div className="pt-6 pb-2">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-6 text-center">
              Pódio dos Campeões Gerais (Top 3)
            </h3>

            <div className="grid grid-cols-3 gap-2 sm:gap-6 items-end max-w-2xl mx-auto">
              {/* 2nd Place (Silver - Left) */}
              {top10[1] && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.1 }}
                  className="flex flex-col items-center text-center space-y-2 order-1"
                >
                  <div className="relative">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-slate-200 to-slate-400 text-slate-900 font-black text-xl sm:text-2xl flex items-center justify-center shadow-md border-2 border-slate-300">
                      🥈
                    </div>
                  </div>

                  <div className="w-full">
                    <span className="text-[10px] font-bold font-mono text-slate-500 block uppercase">2º Lugar</span>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate max-w-[110px] sm:max-w-[140px] mx-auto">
                      {top10[1].studentName}
                    </h4>
                    <span className="text-[10px] text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full font-bold block max-w-[100px] sm:max-w-[120px] mx-auto truncate mt-0.5">
                      {top10[1].classroomName}
                    </span>
                    <span className="text-xs sm:text-sm font-extrabold text-slate-900 font-mono block mt-1">
                      {top10[1].score} pts
                    </span>
                  </div>

                  {/* Pedestal block */}
                  <div className="w-full h-24 sm:h-28 rounded-t-2xl bg-gradient-to-t from-slate-300 to-slate-200 border-t-4 border-slate-400 flex flex-col items-center justify-center shadow-inner">
                    <span className="text-2xl font-black text-slate-600 font-display">2</span>
                    <button
                      onClick={() => handleCheer(top10[1].studentId, top10[1].studentName)}
                      className="mt-1 text-[10px] font-bold text-slate-700 hover:text-slate-950 bg-white/70 hover:bg-white px-2 py-0.5 rounded-md transition-colors cursor-pointer"
                    >
                      {cheeredStudentId === top10[1].studentId ? '🎉 Torcida!' : '👏 Torcer'}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* 1st Place (Gold - Center, elevated) */}
              {top10[0] && (
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="flex flex-col items-center text-center space-y-2 order-2 -mt-6 sm:-mt-8"
                >
                  <div className="relative">
                    <motion.div
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute -top-7 left-1/2 -translate-x-1/2 text-2xl filter drop-shadow-sm"
                    >
                      👑
                    </motion.div>
                    <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-amber-400 via-yellow-300 to-amber-500 text-slate-950 font-black text-2xl sm:text-3xl flex items-center justify-center shadow-lg border-2 border-amber-300 ring-4 ring-amber-200/60">
                      🥇
                    </div>
                  </div>

                  <div className="w-full">
                    <span className="text-[10px] font-bold font-mono text-amber-700 block uppercase">1º Lugar Geral</span>
                    <h4 className="text-sm sm:text-base font-black text-slate-950 truncate max-w-[130px] sm:max-w-[160px] mx-auto font-display">
                      {top10[0].studentName}
                    </h4>
                    <span className="text-[11px] text-amber-900 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-full font-extrabold block max-w-[110px] sm:max-w-[130px] mx-auto truncate mt-0.5">
                      {top10[0].classroomName}
                    </span>
                    <span className="text-sm sm:text-base font-black text-amber-700 font-mono block mt-1">
                      {top10[0].score} pts
                    </span>
                  </div>

                  {/* Pedestal block */}
                  <div className="w-full h-32 sm:h-36 rounded-t-2xl bg-gradient-to-t from-amber-300 via-amber-200 to-amber-100 border-t-4 border-amber-400 flex flex-col items-center justify-center shadow-inner relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
                    <span className="text-3xl font-black text-amber-800 font-display relative z-10">1</span>
                    <button
                      onClick={() => handleCheer(top10[0].studentId, top10[0].studentName)}
                      className="mt-1 text-[11px] font-extrabold text-amber-950 bg-amber-400 hover:bg-amber-300 border border-amber-500/40 px-3 py-1 rounded-lg transition-colors cursor-pointer shadow-xs relative z-10"
                    >
                      {cheeredStudentId === top10[0].studentId ? '🎉 Parabéns!' : '👏 Celebrar'}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* 3rd Place (Bronze - Right) */}
              {top10[2] && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.15 }}
                  className="flex flex-col items-center text-center space-y-2 order-3"
                >
                  <div className="relative">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-amber-600 to-amber-800 text-white font-black text-xl sm:text-2xl flex items-center justify-center shadow-md border-2 border-amber-600">
                      🥉
                    </div>
                  </div>

                  <div className="w-full">
                    <span className="text-[10px] font-bold font-mono text-amber-800 block uppercase">3º Lugar</span>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate max-w-[110px] sm:max-w-[140px] mx-auto">
                      {top10[2].studentName}
                    </h4>
                    <span className="text-[10px] text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full font-bold block max-w-[100px] sm:max-w-[120px] mx-auto truncate mt-0.5">
                      {top10[2].classroomName}
                    </span>
                    <span className="text-xs sm:text-sm font-extrabold text-slate-900 font-mono block mt-1">
                      {top10[2].score} pts
                    </span>
                  </div>

                  {/* Pedestal block */}
                  <div className="w-full h-20 sm:h-24 rounded-t-2xl bg-gradient-to-t from-orange-200 to-orange-100 border-t-4 border-amber-700 flex flex-col items-center justify-center shadow-inner">
                    <span className="text-2xl font-black text-amber-900 font-display">3</span>
                    <button
                      onClick={() => handleCheer(top10[2].studentId, top10[2].studentName)}
                      className="mt-1 text-[10px] font-bold text-amber-900 hover:text-amber-950 bg-white/70 hover:bg-white px-2 py-0.5 rounded-md transition-colors cursor-pointer"
                    >
                      {cheeredStudentId === top10[2].studentId ? '🎉 Torcida!' : '👏 Torcer'}
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* THE COMPLETE TOP 10 LIST */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
                Classificação Geral: Posições de 1º a 10º
              </h4>
              <span className="text-xs text-slate-400">
                Ordenado por pontos e estrelas
              </span>
            </div>

            <div className="space-y-2.5">
              {top10.map((student, idx) => {
                const rank = idx + 1;
                const isCurrent =
                  currentStudentName &&
                  student.studentName.toLowerCase().trim() === currentStudentName.toLowerCase().trim();
                const scorePercent = Math.min(100, Math.round((student.score / highestScore) * 100));

                return (
                  <motion.div
                    key={student.studentId || `student-${idx}`}
                    whileHover={{ scale: 1.01 }}
                    className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isCurrent
                        ? 'bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100/60 border-emerald-300 ring-2 ring-emerald-300/50 shadow-sm'
                        : rank === 1
                        ? 'bg-amber-50/50 border-amber-200/90 hover:border-amber-300'
                        : rank === 2
                        ? 'bg-slate-50 border-slate-200 hover:border-slate-300'
                        : rank === 3
                        ? 'bg-orange-50/40 border-orange-200/80 hover:border-orange-300'
                        : 'bg-white border-slate-200/80 hover:border-slate-300'
                    }`}
                  >
                    {/* Left: Rank, Avatar and Student Info */}
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Rank badge */}
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold font-mono text-xs shrink-0 ${
                          rank === 1
                            ? 'bg-amber-400 text-slate-950 font-black shadow-xs ring-2 ring-amber-300'
                            : rank === 2
                            ? 'bg-slate-300 text-slate-900 font-black'
                            : rank === 3
                            ? 'bg-amber-700 text-white font-black'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `${rank}º`}
                      </div>

                      {/* Student info */}
                      <div className="min-w-0 space-y-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm text-slate-900 truncate">
                            {student.studentName}
                          </span>

                          {isCurrent && (
                            <span className="text-[10px] font-mono font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-600 text-white shadow-2xs">
                              Você!
                            </span>
                          )}

                          <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md">
                            {student.classroomName || 'Turma'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
                          <span className="font-medium text-slate-600">
                            {student.levelTitle || 'Explorador'}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="flex items-center gap-1 text-amber-600 font-semibold">
                            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                            <span>{student.starsEarned} estrelas</span>
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{student.badgesCount || 1} medalhas</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Score, Bar and Cheer Button */}
                    <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      {/* Visual score comparison bar */}
                      <div className="hidden md:flex flex-col items-end gap-1 w-28">
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              rank === 1 ? 'bg-amber-500' : isCurrent ? 'bg-emerald-500' : 'bg-indigo-500'
                            }`}
                            style={{ width: `${scorePercent}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">
                          {scorePercent}% do líder
                        </span>
                      </div>

                      {/* Score display */}
                      <div className="text-right">
                        <span className="text-base sm:text-lg font-black font-mono text-slate-950 tabular-nums block">
                          {student.score} pts
                        </span>
                      </div>

                      {/* Cheer button */}
                      <button
                        onClick={() => handleCheer(student.studentId, student.studentName)}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-amber-300 bg-white hover:bg-amber-50 text-xs font-semibold text-slate-700 hover:text-amber-950 transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                        title="Enviar aplauso e torcida para este estudante"
                      >
                        <span>👏</span>
                        <span className="hidden sm:inline">Torcer</span>
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* CURRENT STUDENT POSITION BANNER */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 border border-indigo-800 shadow-md">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-xl shadow-xs shrink-0">
                {isCurrentUserInTop10 ? '🎖️' : '🚀'}
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-amber-300 uppercase">
                    Seu Status no Ranking da Escola
                  </span>
                  {currentStudentName ? (
                    <span className="text-xs font-bold text-white font-display">({currentStudentName})</span>
                  ) : (
                    <span className="text-xs text-amber-200 font-semibold">(Estudante Convidado)</span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-indigo-100">
                  {isCurrentUserInTop10 ? (
                    <span className="font-bold text-emerald-300">
                      Parabéns! Você está no Top 10 Oficial da Escola (Posição #{currentUserRank}) com {userScore} pontos!
                    </span>
                  ) : currentUserRank ? (
                    <span>
                      Você está na posição <strong>#{currentUserRank}</strong> da escola com <strong>{userScore} pts</strong>.{' '}
                      Faltam apenas <strong>{pointsNeededForTop10} pts</strong> para conquistar um lugar no Top 10!
                    </span>
                  ) : (
                    <span>
                      Identifique-se com seu nome e turma para que suas conquistas figurem no Ranking Global!
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {currentStudentName ? (
                onSelectMission && (
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      onSelectMission('sprint');
                    }}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Flame className="w-3.5 h-3.5 text-slate-950 fill-slate-950" />
                    <span>Jogar Sprint e Ganhar Pontos</span>
                  </button>
                )
              ) : (
                onOpenIdentityModal && (
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      onOpenIdentityModal();
                    }}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <GraduationCap className="w-3.5 h-3.5 text-slate-950" />
                    <span>Identificar meu Aluno</span>
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
