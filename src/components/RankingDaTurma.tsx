import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Medal,
  Star,
  Flame,
  Award,
  Sparkles,
  TrendingUp,
  Users,
  School,
  ArrowRight,
  RefreshCw,
  Crown,
  Heart,
  Zap,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  FirebaseStudentPerformance,
  fetchStudentsInClassroom,
  OFFICIAL_SCHOOL_NAME,
} from '../services/firebase';
import { soundManager } from '../utils/audio';

interface Props {
  classroomId: string;
  classroomName?: string;
  currentStudentName?: string;
  userScore: number;
  userStars: number;
  onSelectMission: (missionId: string) => void;
  onOpenIdentityModal?: () => void;
}

export const RankingDaTurma: React.FC<Props> = ({
  classroomId,
  classroomName = '4º Ano A',
  currentStudentName = '',
  userScore,
  userStars,
  onSelectMission,
  onOpenIdentityModal,
}) => {
  const [students, setStudents] = useState<FirebaseStudentPerformance[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showAllStudents, setShowAllStudents] = useState<boolean>(false);
  const [cheeredStudentId, setCheeredStudentId] = useState<string | null>(null);

  // Load students of this classroom from Firestore
  useEffect(() => {
    loadClassRanking();
  }, [classroomId]);

  const loadClassRanking = async () => {
    setIsLoading(true);
    try {
      const data = await fetchStudentsInClassroom(classroomId);
      setStudents(data);
    } catch (err) {
      console.error('Erro ao carregar ranking da turma:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Merge current user's local score if not yet in Firestore or if local score is higher
  const mergedStudents = [...students];
  if (currentStudentName && currentStudentName.trim() !== '') {
    const existingIndex = mergedStudents.findIndex(
      s => s.studentName.toLowerCase().trim() === currentStudentName.toLowerCase().trim()
    );

    if (existingIndex >= 0) {
      if (userScore > mergedStudents[existingIndex].score) {
        mergedStudents[existingIndex] = {
          ...mergedStudents[existingIndex],
          score: userScore,
          starsEarned: Math.max(mergedStudents[existingIndex].starsEarned, userStars),
        };
      }
    } else if (userScore > 0) {
      mergedStudents.push({
        studentId: 'current_user_' + Date.now(),
        studentName: currentStudentName,
        classroomId,
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

  // Sort descending by score, tie-break by stars
  const sortedStudents = mergedStudents.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.starsEarned - a.starsEarned;
  });

  const topStudents = showAllStudents ? sortedStudents : sortedStudents.slice(0, 5);

  // Current student rank
  const currentStudentRank = sortedStudents.findIndex(
    s => s.studentName.toLowerCase().trim() === (currentStudentName || '').toLowerCase().trim()
  );
  const userRankNumber = currentStudentRank >= 0 ? currentStudentRank + 1 : null;
  const leaderScore = sortedStudents[0]?.score || 0;
  const scoreDifferenceToLeader = leaderScore > userScore ? leaderScore - userScore : 0;

  // Cheer celebration
  const handleCheer = (studentId: string, studentName: string) => {
    soundManager.playCorrect();
    setCheeredStudentId(studentId);
    setTimeout(() => setCheeredStudentId(null), 1800);

    confetti({
      particleCount: 25,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#f59e0b', '#6366f1', '#10b981'],
    });
  };

  const handleGlobalCheer = () => {
    soundManager.playFanfare();
    confetti({
      particleCount: 50,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#fbbf24', '#f59e0b', '#3b82f6', '#ec4899'],
    });
  };

  const getRankBadgeInfo = (index: number) => {
    switch (index) {
      case 0:
        return {
          title: '1º Lugar',
          medal: '🥇',
          bg: 'bg-amber-400 text-slate-950 font-black',
          podiumBg: 'bg-gradient-to-t from-amber-500 to-yellow-300 text-slate-950 border-amber-300',
          height: 'h-40 sm:h-44',
          glow: 'ring-4 ring-amber-400/40 shadow-amber-400/30',
        };
      case 1:
        return {
          title: '2º Lugar',
          medal: '🥈',
          bg: 'bg-slate-300 text-slate-900 font-bold',
          podiumBg: 'bg-gradient-to-t from-slate-400 to-slate-200 text-slate-900 border-slate-300',
          height: 'h-32 sm:h-36',
          glow: 'ring-2 ring-slate-300/40',
        };
      case 2:
        return {
          title: '3º Lugar',
          medal: '🥉',
          bg: 'bg-amber-600 text-white font-bold',
          podiumBg: 'bg-gradient-to-t from-amber-700 to-amber-500 text-white border-amber-600',
          height: 'h-28 sm:h-32',
          glow: 'ring-2 ring-amber-600/40',
        };
      default:
        return {
          title: `${index + 1}º Lugar`,
          medal: '⭐',
          bg: 'bg-indigo-900 text-indigo-200',
          podiumBg: 'bg-indigo-950',
          height: 'h-24',
          glow: '',
        };
    }
  };

  return (
    <section
      aria-label="Ranking da Turma"
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 border-2 border-indigo-700/50 shadow-xl space-y-6"
    >
      {/* Decorative Lights */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-indigo-800/60">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-0.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase bg-amber-400 text-slate-950 flex items-center gap-1.5 shadow-sm">
              <Trophy className="w-3.5 h-3.5 fill-slate-950" />
              Ranking Oficial da Turma
            </span>

            <span className="text-xs text-indigo-200 font-mono flex items-center gap-1">
              <School className="w-3.5 h-3.5 text-indigo-400" />
              <span>{classroomName}</span>
              <span className="opacity-60">·</span>
              <span className="text-[11px] truncate max-w-[220px]">{OFFICIAL_SCHOOL_NAME}</span>
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            Quadro de Líderes dos Colegas de Classe
          </h2>
          <p className="text-xs text-indigo-200 max-w-xl">
            Competição saudável e colaborativa! Ganhe pontos nas missões de Língua Portuguesa para subir no pódio da sua turma.
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleGlobalCheer}
            className="px-3 py-2 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
            title="Celebrar o progresso de toda a turma com confetes"
          >
            <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
            <span>Aplaudir Turma 👏</span>
          </button>

          <button
            onClick={loadClassRanking}
            disabled={isLoading}
            className="p-2 rounded-xl text-xs font-semibold bg-indigo-900/70 hover:bg-indigo-800 text-indigo-200 border border-indigo-700/60 transition-colors cursor-pointer"
            title="Atualizar ranking em tempo real"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Student's Personal Status Card (Feedback & Gamified Motivation) */}
      <div className="relative z-10 bg-indigo-900/40 rounded-2xl border border-indigo-700/60 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center text-xl font-bold shadow-md shrink-0 border border-indigo-400/40">
            {userRankNumber ? (userRankNumber <= 3 ? ['🥇', '🥈', '🥉'][userRankNumber - 1] : `#${userRankNumber}`) : '👤'}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white font-display">
                {currentStudentName || 'Estudante Não Identificado'}
              </span>
              {userRankNumber && (
                <span className="text-[11px] font-mono font-bold bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full">
                  {userRankNumber}º no Ranking
                </span>
              )}
            </div>

            <p className="text-xs text-indigo-200 mt-0.5">
              {!currentStudentName ? (
                'Identifique-se e escolha sua turma para exibir seu nome no pódio dos colegas!'
              ) : userRankNumber === 1 ? (
                '🏆 Você é o Líder da turma! Continue praticando para manter sua coroa de ouro!'
              ) : userRankNumber ? (
                `Você possui ${userScore} XP (${userStars} ⭐). Faltam apenas ${scoreDifferenceToLeader} pts para alcançar o 1º lugar!`
              ) : (
                'Jogue uma missão para marcar seus primeiros pontos e entrar no ranking da turma!'
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {!currentStudentName && onOpenIdentityModal ? (
            <button
              onClick={onOpenIdentityModal}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
            >
              Identificar-me Agora 🚀
            </button>
          ) : (
            <button
              onClick={() => onSelectMission('sprint')}
              className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md flex items-center gap-2"
            >
              <Zap className="w-3.5 h-3.5 fill-slate-950" />
              <span>Jogar para Subir</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Olympic Podium (Top 3 Colleagues) */}
      {sortedStudents.length >= 3 && (
        <div className="pt-2">
          <div className="text-center mb-3">
            <span className="text-[11px] font-mono uppercase font-bold tracking-widest text-indigo-300">
              ✦ Pódio de Destaque da Turma ✦
            </span>
          </div>

          <div className="flex items-end justify-center gap-2 sm:gap-4 max-w-xl mx-auto pt-6">
            {/* 2nd Place (Silver) */}
            {sortedStudents[1] && (
              <div className="flex-1 flex flex-col items-center">
                <div className="relative mb-2 text-center">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-slate-400 to-slate-200 text-slate-900 border-2 border-slate-300 flex items-center justify-center font-bold text-lg shadow-md mx-auto">
                    🥈
                  </div>
                  <p className="text-xs font-bold text-white mt-1 truncate max-w-[100px] sm:max-w-[120px] font-display">
                    {sortedStudents[1].studentName}
                  </p>
                  <span className="text-[11px] font-mono font-bold text-slate-300 block">
                    {sortedStudents[1].score} pts
                  </span>
                </div>
                <div className="w-full h-28 sm:h-32 bg-gradient-to-t from-slate-700/80 to-slate-600/70 border-t-2 border-slate-400 rounded-t-2xl flex flex-col items-center justify-center p-2 shadow-inner">
                  <span className="text-2xl font-black text-slate-200 font-display">2º</span>
                  <span className="text-[10px] text-slate-300 font-mono">Prata</span>
                </div>
              </div>
            )}

            {/* 1st Place (Gold / Crown) */}
            {sortedStudents[0] && (
              <div className="flex-1 flex flex-col items-center">
                <div className="relative mb-2 text-center">
                  <Crown className="w-6 h-6 text-amber-400 fill-amber-400 mx-auto -mb-1 animate-bounce" />
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 border-2 border-amber-300 flex items-center justify-center font-bold text-2xl shadow-lg ring-4 ring-amber-400/30 mx-auto">
                    🥇
                  </div>
                  <p className="text-xs sm:text-sm font-extrabold text-amber-300 mt-1 truncate max-w-[110px] sm:max-w-[130px] font-display">
                    {sortedStudents[0].studentName}
                  </p>
                  <span className="text-xs font-mono font-black text-white block">
                    {sortedStudents[0].score} pts
                  </span>
                </div>
                <div className="w-full h-36 sm:h-44 bg-gradient-to-t from-amber-600/90 via-amber-500/80 to-yellow-400/70 border-t-2 border-yellow-300 rounded-t-2xl flex flex-col items-center justify-center p-2 shadow-lg">
                  <span className="text-3xl font-black text-slate-950 font-display">1º</span>
                  <span className="text-xs text-slate-950 font-extrabold font-mono uppercase tracking-wider">
                    Campeão
                  </span>
                </div>
              </div>
            )}

            {/* 3rd Place (Bronze) */}
            {sortedStudents[2] && (
              <div className="flex-1 flex flex-col items-center">
                <div className="relative mb-2 text-center">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-amber-700 to-amber-500 text-white border-2 border-amber-600 flex items-center justify-center font-bold text-lg shadow-md mx-auto">
                    🥉
                  </div>
                  <p className="text-xs font-bold text-white mt-1 truncate max-w-[100px] sm:max-w-[120px] font-display">
                    {sortedStudents[2].studentName}
                  </p>
                  <span className="text-[11px] font-mono font-bold text-amber-300 block">
                    {sortedStudents[2].score} pts
                  </span>
                </div>
                <div className="w-full h-24 sm:h-28 bg-gradient-to-t from-amber-800/80 to-amber-700/70 border-t-2 border-amber-600 rounded-t-2xl flex flex-col items-center justify-center p-2 shadow-inner">
                  <span className="text-2xl font-black text-amber-200 font-display">3º</span>
                  <span className="text-[10px] text-amber-200 font-mono">Bronze</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Leaderboard Table / Cards */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-indigo-300 pb-1">
          <span className="font-mono uppercase font-bold tracking-wider">
            Posição & Aluno
          </span>
          <span className="font-mono uppercase font-bold tracking-wider">
            Pontuação & Estrelas
          </span>
        </div>

        <div className="space-y-2">
          {topStudents.map((student, idx) => {
            const isCurrentUser =
              currentStudentName &&
              student.studentName.toLowerCase().trim() === currentStudentName.toLowerCase().trim();
            const badgeInfo = getRankBadgeInfo(idx);
            const isCheered = cheeredStudentId === student.studentId;

            return (
              <motion.div
                key={student.studentId || idx}
                whileHover={{ scale: 1.01 }}
                className={`p-3 sm:p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  isCurrentUser
                    ? 'bg-indigo-600/30 border-amber-400 ring-2 ring-amber-400/50 shadow-md'
                    : 'bg-indigo-900/30 hover:bg-indigo-900/50 border-indigo-800/60'
                }`}
              >
                {/* Left: Rank + Avatar + Name */}
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`w-7 h-7 rounded-lg text-xs flex items-center justify-center shrink-0 font-display ${badgeInfo.bg}`}
                  >
                    {idx + 1}º
                  </span>

                  <div className="truncate">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs sm:text-sm font-display truncate">
                        {student.studentName}
                      </span>
                      {isCurrentUser && (
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 shrink-0">
                          Você
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-indigo-300 truncate block">
                      {student.levelTitle || 'Estudante da BNCC'}
                    </span>
                  </div>
                </div>

                {/* Right: Score + Cheer Button */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-sm sm:text-base font-extrabold font-mono text-white block">
                      {student.score} pts
                    </span>
                    <span className="text-[11px] font-mono text-amber-400 flex items-center justify-end gap-1">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>{student.starsEarned}</span>
                    </span>
                  </div>

                  {/* Encouragement Button */}
                  <button
                    onClick={() => handleCheer(student.studentId, student.studentName)}
                    className={`p-2 rounded-xl text-xs transition-all cursor-pointer border ${
                      isCheered
                        ? 'bg-amber-400 text-slate-950 border-amber-300 scale-110'
                        : 'bg-indigo-950/70 hover:bg-indigo-800 text-indigo-200 border-indigo-700/60'
                    }`}
                    title="Incentivar este colega"
                  >
                    <Heart className={`w-3.5 h-3.5 ${isCheered ? 'fill-rose-600 text-rose-600 animate-ping' : ''}`} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Expand / Collapse Full Class Button */}
      {sortedStudents.length > 5 && (
        <div className="text-center pt-2">
          <button
            onClick={() => {
              soundManager.playClick();
              setShowAllStudents(!showAllStudents);
            }}
            className="inline-flex items-center gap-1.5 text-xs text-indigo-300 hover:text-white font-semibold transition-colors cursor-pointer py-1"
          >
            {showAllStudents ? (
              <>
                <ChevronUp className="w-4 h-4" />
                <span>Mostrar Apenas o Top 5</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                <span>Ver Todos os {sortedStudents.length} Alunos da Turma</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Positive Pedagogy Footnote */}
      <div className="pt-2 border-t border-indigo-800/60 flex items-center justify-between text-xs text-indigo-300">
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Competição saudável: todos os pontos somam para o sucesso da turma!</span>
        </span>

        <button
          onClick={() => onSelectMission('turmas')}
          className="text-amber-400 hover:text-amber-300 font-bold transition-colors cursor-pointer flex items-center gap-1"
        >
          <span>Painel Detalhado da Turma</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </section>
  );
};
