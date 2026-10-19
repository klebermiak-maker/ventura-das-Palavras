import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Star, Flame, Award, Sparkles, TrendingUp, Zap, Crown } from 'lucide-react';
import { FirebaseStudentPerformance } from '../services/firebase';
import { soundManager } from '../utils/audio';

interface Props {
  students: FirebaseStudentPerformance[];
  currentStudentName?: string;
  classroomName?: string;
}

export const RankingEstudantes: React.FC<Props> = ({
  students,
  currentStudentName,
  classroomName,
}) => {
  // Sort students descending by score and pick top 5
  const sortedStudents = [...students].sort((a, b) => b.score - a.score);
  const top5 = sortedStudents.slice(0, 5);
  const maxScore = top5[0]?.score || 1;

  // Check current student position
  const currentStudentRankIndex = sortedStudents.findIndex(
    s => s.studentName.toLowerCase().trim() === (currentStudentName || '').toLowerCase().trim()
  );
  const isCurrentStudentInTop5 = currentStudentRankIndex >= 0 && currentStudentRankIndex < 5;
  const currentStudentData = currentStudentRankIndex >= 0 ? sortedStudents[currentStudentRankIndex] : null;

  const handleCheer = () => {
    soundManager.playFanfare();
  };

  // Helper avatar generator with initials and fun colors
  const getAvatarBg = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 border-amber-300 shadow-amber-200';
      case 2:
        return 'bg-gradient-to-tr from-slate-400 to-slate-200 text-slate-900 border-slate-300 shadow-slate-200';
      case 3:
        return 'bg-gradient-to-tr from-amber-700 to-amber-500 text-white border-amber-600 shadow-amber-300';
      default:
        return 'bg-gradient-to-tr from-indigo-500 to-purple-400 text-white border-indigo-200 shadow-indigo-100';
    }
  };

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return { label: '1º Lugar', medal: '🥇', bg: 'bg-amber-100 text-amber-900 border-amber-300', icon: Trophy };
      case 2:
        return { label: '2º Lugar', medal: '🥈', bg: 'bg-slate-100 text-slate-800 border-slate-300', icon: Medal };
      case 3:
        return { label: '3º Lugar', medal: '🥉', bg: 'bg-orange-100 text-orange-900 border-orange-300', icon: Medal };
      case 4:
        return { label: '4º Lugar', medal: '🎖️', bg: 'bg-indigo-50 text-indigo-800 border-indigo-200', icon: Award };
      default:
        return { label: '5º Lugar', medal: '⭐', bg: 'bg-sky-50 text-sky-800 border-sky-200', icon: Award };
    }
  };

  if (students.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-3 shadow-xs">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center text-3xl mx-auto shadow-2xs">
          🏆
        </div>
        <h3 className="text-lg font-bold text-slate-900 font-display">Ranking de Estudantes</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Nenhum estudante com pontuação sincronizada nesta turma ainda. Jogue as missões e envie seus pontos para inaugurar o Top 5!
        </p>
      </div>
    );
  }

  // Podium positions: [2nd, 1st, 3rd]
  const podiumStudents = [
    { rank: 2, student: top5[1] },
    { rank: 1, student: top5[0] },
    { rank: 3, student: top5[2] },
  ];

  const runnersUp = top5.slice(3, 5); // 4th and 5th

  return (
    <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-indigo-800/60 space-y-6 relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold tracking-wider uppercase bg-amber-500 text-slate-950 flex items-center gap-1 shadow-xs">
              <Flame className="w-3.5 h-3.5 text-slate-950 fill-slate-950" />
              Top 5 da Turma
            </span>
            <span className="text-xs font-mono text-indigo-300">
              {classroomName || 'Turma Ativa'}
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black font-display text-white tracking-tight flex items-center gap-2">
            <span>Ranking dos Melhores Exploradores</span>
            <Sparkles className="w-5 h-5 text-amber-400" />
          </h3>

          <p className="text-xs text-indigo-200/90 max-w-xl">
            Reconhecimento à dedicação, leitura atenta e domínio das habilidades da Língua Portuguesa!
          </p>
        </div>

        <button
          onClick={handleCheer}
          className="self-start sm:self-center px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
          title="Tocar fanfarra para celebrar os campeões"
        >
          <Trophy className="w-4 h-4 fill-slate-950" />
          <span>Celebrar Campeões! 👏</span>
        </button>
      </div>

      {/* Top 3 Podium Display */}
      <div className="relative z-10 pt-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end max-w-3xl mx-auto">
          {podiumStudents.map(({ rank, student }) => {
            if (!student) {
              return (
                <div
                  key={`empty-${rank}`}
                  className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center text-xs text-indigo-300/60 h-44 flex flex-col items-center justify-center space-y-1"
                >
                  <span className="text-2xl opacity-40">
                    {rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉'}
                  </span>
                  <span>{rank}º Lugar vago</span>
                  <span className="text-[10px] text-indigo-400/60">Jogue para conquistar!</span>
                </div>
              );
            }

            const isCurrent = currentStudentName && student.studentName.toLowerCase().trim() === currentStudentName.toLowerCase().trim();
            const badge = getRankBadge(rank);
            const isFirst = rank === 1;

            return (
              <motion.div
                key={student.studentId}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: rank === 1 ? 0.1 : rank === 2 ? 0.18 : 0.25 }}
                className={`relative rounded-3xl p-5 text-center flex flex-col items-center justify-between transition-all ${
                  isFirst
                    ? 'bg-gradient-to-b from-amber-500/25 via-indigo-900/60 to-slate-900 border-2 border-amber-400 shadow-xl sm:order-2 sm:-translate-y-2'
                    : rank === 2
                    ? 'bg-gradient-to-b from-slate-400/20 via-indigo-900/50 to-slate-900 border border-slate-300/60 shadow-md sm:order-1'
                    : 'bg-gradient-to-b from-amber-700/20 via-indigo-900/50 to-slate-900 border border-amber-600/60 shadow-md sm:order-3'
                } ${isCurrent ? 'ring-2 ring-emerald-400' : ''}`}
              >
                {/* Crown for 1st Place */}
                {isFirst && (
                  <div className="absolute -top-4 w-9 h-9 bg-amber-400 text-slate-950 rounded-full flex items-center justify-center shadow-lg border border-amber-200">
                    <Crown className="w-5 h-5 fill-slate-950" />
                  </div>
                )}

                {/* You Badge */}
                {isCurrent && (
                  <div className="absolute -top-3 right-3 px-2 py-0.5 bg-emerald-500 text-slate-950 text-[10px] font-mono font-bold rounded-full shadow-xs">
                    Você!
                  </div>
                )}

                {/* Rank Badge */}
                <div className="flex items-center gap-1 text-xs font-mono font-bold uppercase tracking-wider mb-2">
                  <span className="text-base">{badge.medal}</span>
                  <span className={isFirst ? 'text-amber-300' : rank === 2 ? 'text-slate-200' : 'text-amber-400'}>
                    {badge.label}
                  </span>
                </div>

                {/* Student Avatar */}
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold font-display shadow-md border-2 mb-3 ${getAvatarBg(
                    rank
                  )}`}
                >
                  {student.studentName.slice(0, 2).toUpperCase()}
                </div>

                {/* Student Name & Level */}
                <div className="space-y-0.5 w-full">
                  <p className="text-sm sm:text-base font-bold font-display text-white truncate max-w-full" title={student.studentName}>
                    {student.studentName}
                  </p>
                  <p className="text-[11px] text-indigo-200 truncate">
                    {student.levelTitle}
                  </p>
                </div>

                {/* Score & Stars */}
                <div className="mt-3 pt-3 border-t border-white/10 w-full flex items-center justify-around text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-indigo-300 block">Pontos</span>
                    <span className="font-extrabold text-sm sm:text-base text-white tabular-nums">
                      {student.score}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-indigo-300 block">Estrelas</span>
                    <span className="font-bold text-amber-300 flex items-center justify-center gap-0.5 tabular-nums">
                      <Star className="w-3.5 h-3.5 fill-amber-300" />
                      <span>{student.starsEarned}</span>
                    </span>
                  </div>
                </div>

                {/* Podium Pedestal Graphic */}
                <div
                  className={`mt-3 w-full py-1.5 rounded-xl font-mono text-[11px] font-bold ${
                    isFirst
                      ? 'bg-amber-500/20 text-amber-200 border border-amber-400/40'
                      : rank === 2
                      ? 'bg-slate-400/20 text-slate-200 border border-slate-300/30'
                      : 'bg-amber-700/20 text-amber-300 border border-amber-600/30'
                  }`}
                >
                  Nível {student.levelNumber} · {student.badgesCount} Medalhas
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 4th & 5th Place Honorable Runners-up */}
      {runnersUp.length > 0 && (
        <div className="relative z-10 space-y-2">
          <div className="text-xs font-mono uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
            <span>Honra ao Mérito (4º e 5º Lugares)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {runnersUp.map((student, idx) => {
              const rank = idx + 4;
              const isCurrent =
                currentStudentName &&
                student.studentName.toLowerCase().trim() === currentStudentName.toLowerCase().trim();
              const badge = getRankBadge(rank);
              const progressPct = Math.round((student.score / maxScore) * 100);

              return (
                <div
                  key={student.studentId}
                  className={`bg-white/5 hover:bg-white/10 transition-colors rounded-2xl p-4 border border-white/10 flex items-center justify-between gap-3 ${
                    isCurrent ? 'ring-2 ring-emerald-400 bg-white/10' : ''
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-lg shrink-0">{badge.medal}</span>
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs font-display shrink-0 ${getAvatarBg(
                        rank
                      )}`}
                    >
                      {student.studentName.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs sm:text-sm font-bold text-white truncate">
                          {student.studentName}
                        </p>
                        {isCurrent && (
                          <span className="px-1.5 py-0.2 bg-emerald-500 text-slate-950 font-mono text-[9px] font-bold rounded">
                            Você
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-indigo-200 truncate">
                        {student.levelTitle} (Nív. {student.levelNumber})
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs sm:text-sm font-mono font-extrabold text-white">
                      {student.score} pts
                    </div>
                    <div className="text-[11px] font-mono text-amber-300 flex items-center justify-end gap-1">
                      <Star className="w-3 h-3 fill-amber-300" />
                      <span>{student.starsEarned} estrelas</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Motivational Student Status Callout */}
      <div className="relative z-10 pt-2 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        {currentStudentName ? (
          isCurrentStudentInTop5 ? (
            <div className="flex items-center gap-2 text-emerald-300 font-medium">
              <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Sensacional, <strong>{currentStudentName}</strong>! Você está brilhando entre os 5 maiores pontuadores da turma!
              </span>
            </div>
          ) : currentStudentData ? (
            <div className="flex items-center gap-2 text-amber-200 font-medium">
              <Zap className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                Olá, <strong>{currentStudentName}</strong>! Você está em #{currentStudentRankIndex + 1}º com {currentStudentData.score} pts. Jogue as missões e o Sprint para conquistar seu lugar no Top 5!
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-indigo-200">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                Olá, <strong>{currentStudentName}</strong>! Sincronize seu desempenho para disputar uma vaga no Top 5!
              </span>
            </div>
          )
        ) : (
          <div className="flex items-center gap-2 text-indigo-200">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Identifique seu nome para acompanhar sua posição e disputar o pódio!</span>
          </div>
        )}

        <div className="text-[11px] font-mono text-indigo-300/80">
          Total de {students.length} {students.length === 1 ? 'aluno registrado' : 'alunos registrados'} na turma
        </div>
      </div>
    </div>
  );
};
