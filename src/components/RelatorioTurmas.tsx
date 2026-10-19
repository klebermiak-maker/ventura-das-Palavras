import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  Legend,
} from 'recharts';
import {
  Users,
  School,
  BarChart3,
  RefreshCw,
  Plus,
  ArrowRight,
  Printer,
  Sparkles,
  Trophy,
  Star,
  CheckCircle2,
  CloudUpload,
  UserCheck,
} from 'lucide-react';
import {
  FirebaseClassroom,
  FirebaseStudentPerformance,
  fetchClassrooms,
  fetchStudentsInClassroom,
  createClassroom,
  syncStudentPerformanceToFirebase,
} from '../services/firebase';
import { BNCCSkill, UserStats } from '../types/game';
import { getPlayerLevelInfo } from '../utils/levels';
import { soundManager } from '../utils/audio';
import { RankingEstudantes } from './RankingEstudantes';

interface Props {
  userStats: UserStats;
  currentClassroomId: string;
  onNavigate: (view: string) => void;
  onOpenIdentityModal: () => void;
}

export const RelatorioTurmas: React.FC<Props> = ({
  userStats,
  currentClassroomId,
  onNavigate,
  onOpenIdentityModal,
}) => {
  const [classrooms, setClassrooms] = useState<FirebaseClassroom[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>(currentClassroomId || 'turma-3a');
  const [students, setStudents] = useState<FirebaseStudentPerformance[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [gradeFilter, setGradeFilter] = useState<'all' | '3' | '5' | '4'>('all');

  // Modal create class state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newSchoolName, setNewSchoolName] = useState('');
  const [newTeacherName, setNewTeacherName] = useState('');

  useEffect(() => {
    loadClassrooms();
  }, []);

  useEffect(() => {
    if (currentClassroomId) {
      setSelectedClassId(currentClassroomId);
      if (currentClassroomId.includes('3') || currentClassroomId.startsWith('turma-3')) {
        setGradeFilter('3');
      } else if (currentClassroomId.includes('5') || currentClassroomId.startsWith('turma-5')) {
        setGradeFilter('5');
      }
    }
  }, [currentClassroomId]);

  useEffect(() => {
    if (selectedClassId) {
      loadStudents(selectedClassId);
    }
  }, [selectedClassId]);

  const loadClassrooms = async () => {
    setIsLoading(true);
    try {
      const list = await fetchClassrooms();
      setClassrooms(list);
      if (list.length > 0 && !selectedClassId) {
        const defaultClass = list.find(c => c.id === 'turma-3a') || list[0];
        setSelectedClassId(defaultClass.id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStudents = async (classId: string) => {
    setIsLoading(true);
    try {
      const list = await fetchStudentsInClassroom(classId);
      // Sort students by score descending
      list.sort((a, b) => b.score - a.score);
      setStudents(list);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSyncCurrentStudent = async () => {
    if (!userStats.studentName) {
      onOpenIdentityModal();
      return;
    }

    soundManager.playClick();
    setIsSyncing(true);
    setSyncSuccess(false);

    try {
      const levelInfo = getPlayerLevelInfo(userStats.score);
      await syncStudentPerformanceToFirebase(
        selectedClassId,
        userStats.studentName,
        userStats.studentName,
        userStats.score,
        userStats.starsEarned,
        levelInfo.currentTier.level,
        levelInfo.currentTier.title,
        userStats.badgesEarned.length,
        userStats.skillStats
      );

      soundManager.playCorrect();
      setSyncSuccess(true);
      await loadStudents(selectedClassId);

      setTimeout(() => setSyncSuccess(false), 3500);
    } catch (e) {
      console.error('Failed to sync student to Firebase:', e);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;

    soundManager.playClick();
    try {
      const created = await createClassroom(newClassName, newSchoolName, newTeacherName);
      setClassrooms(prev => [...prev, created]);
      setSelectedClassId(created.id);
      setIsCreateOpen(false);
      setNewClassName('');
      setNewSchoolName('');
      setNewTeacherName('');
    } catch (e) {
      console.error(e);
    }
  };

  const selectedClass = classrooms.find(c => c.id === selectedClassId) || classrooms[0];

  // Group classrooms
  const turmas3 = classrooms.filter(c => c.id.startsWith('turma-3') || c.name.includes('3º') || c.name.toLowerCase().includes('terceiro'));
  const turmas5 = classrooms.filter(c => c.id.startsWith('turma-5') || c.name.includes('5º') || c.name.toLowerCase().includes('quinto'));
  const turmas4 = classrooms.filter(c => c.id.startsWith('turma-4') || c.name.includes('4º') || c.name.toLowerCase().includes('quarto'));
  const otherTurmas = classrooms.filter(
    c => !turmas3.includes(c) && !turmas5.includes(c) && !turmas4.includes(c)
  );

  const handleSelectLetter = (letter: string) => {
    soundManager.playClick();
    const targetGrade = gradeFilter === '5' ? '5' : gradeFilter === '4' ? '4' : '3';
    const targetId = `turma-${targetGrade}${letter.toLowerCase()}`;
    const found = classrooms.find(
      c => c.id === targetId || (c.name.includes(`${targetGrade}º`) && c.name.toUpperCase().includes(` ${letter}`))
    );
    if (found) {
      setSelectedClassId(found.id);
    }
  };

  // Calculate classroom aggregates for the bar chart
  const calculateClassSkillAverage = (skillKey: 'ef15lp03' | 'ef35lp03' | 'ef35lp04' | 'ef05lp03') => {
    if (students.length === 0) return 0;
    let totalCorrect = 0;
    let totalAttempted = 0;

    students.forEach(s => {
      totalCorrect += s[`${skillKey}_correct`] || 0;
      totalAttempted += s[`${skillKey}_attempted`] || 0;
    });

    return totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;
  };

  const chartData = [
    {
      code: 'EF15LP03',
      name: 'Fatos Explícitos',
      mediaTurma: calculateClassSkillAverage('ef15lp03'),
      color: '#10B981',
    },
    {
      code: 'EF35LP03',
      name: 'Ideia Central',
      mediaTurma: calculateClassSkillAverage('ef35lp03'),
      color: '#0EA5E9',
    },
    {
      code: 'EF35LP04',
      name: 'Entrelinhas',
      mediaTurma: calculateClassSkillAverage('ef35lp04'),
      color: '#F59E0B',
    },
    {
      code: 'EF05LP03',
      name: 'Acentuação',
      mediaTurma: calculateClassSkillAverage('ef05lp03'),
      color: '#6366F1',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 no-print">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-indigo-700 font-semibold uppercase tracking-wider">
            <School className="w-3.5 h-3.5" />
            <span>PAINEL DO EDUCADOR</span>
            <span aria-hidden="true">·</span>
            <span>INTEGRAÇÃO COM O FIREBASE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display mt-0.5">
            Relatórios por Turmas da BNCC
          </h1>
          <p className="text-sm text-slate-600 mt-0.5 max-w-2xl">
            Acompanhe a evolução de cada turma do 4º ano, compare médias de acertos nas quatro habilidades da BNCC e consulte o ranking dos estudantes em tempo real.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 font-medium text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir Relatório</span>
          </button>

          <button
            onClick={handleSyncCurrentStudent}
            disabled={isSyncing}
            className={`px-4 py-2 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-xs ${
              syncSuccess
                ? 'bg-emerald-600 hover:bg-emerald-700'
                : 'bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50'
            }`}
          >
            {isSyncing ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : syncSuccess ? (
              <CheckCircle2 className="w-3.5 h-3.5" />
            ) : (
              <CloudUpload className="w-3.5 h-3.5" />
            )}
            <span>{syncSuccess ? 'Sincronizado!' : 'Salvar Aluno no Firebase'}</span>
          </button>
        </div>
      </div>

      {/* Classroom Selection Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        {/* Grade tabs & Action buttons */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          {/* Grade Filter Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                setGradeFilter('3');
                const target = classrooms.find(c => c.id === 'turma-3a');
                if (target) setSelectedClassId(target.id);
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                gradeFilter === '3'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📘 3º Ano (A ao E)
            </button>
            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                setGradeFilter('5');
                const target = classrooms.find(c => c.id === 'turma-5a');
                if (target) setSelectedClassId(target.id);
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                gradeFilter === '5'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📙 5º Ano (A ao E)
            </button>
            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                setGradeFilter('4');
                const target = classrooms.find(c => c.id === 'turma-4a');
                if (target) setSelectedClassId(target.id);
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                gradeFilter === '4'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📗 4º Ano
            </button>
            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                setGradeFilter('all');
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                gradeFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Todas
            </button>
          </div>

          {/* Quick Letter Pills (A ao E) */}
          <div className="flex items-center gap-1.5 bg-indigo-50/60 px-3 py-1.5 rounded-xl border border-indigo-100">
            <span className="text-[11px] font-bold text-indigo-800 uppercase tracking-wide mr-1">
              Letra:
            </span>
            {['A', 'B', 'C', 'D', 'E'].map(letter => {
              const activeGrade = gradeFilter === '5' ? '5' : gradeFilter === '4' ? '4' : '3';
              const targetId = `turma-${activeGrade}${letter.toLowerCase()}`;
              const isSelected = selectedClass && (selectedClass.id === targetId || selectedClass.name.endsWith(` ${letter}`));
              return (
                <button
                  key={letter}
                  type="button"
                  onClick={() => handleSelectLetter(letter)}
                  className={`w-7 h-7 rounded-lg text-xs font-black transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-xs ring-2 ring-indigo-400'
                      : 'bg-white text-slate-700 border border-indigo-200 hover:bg-indigo-100 hover:text-indigo-900'
                  }`}
                  title={`Selecionar ${gradeFilter === '5' ? '5º Ano' : '3º Ano'} ${letter}`}
                >
                  {letter}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => loadStudents(selectedClassId)}
              disabled={isLoading}
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg flex items-center gap-1.5 hover:bg-slate-50 transition-colors cursor-pointer"
              title="Atualizar dados do Firebase"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Atualizar</span>
            </button>

            <button
              onClick={() => setIsCreateOpen(true)}
              className="px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Criar Turma</span>
            </button>
          </div>
        </div>

        {/* Dropdown Selection Input (Lista Suspensa) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <label className="text-[11px] font-mono uppercase font-bold text-slate-500 block">
                Lista Suspensa de Turmas Selecionada:
              </label>
              <select
                value={selectedClassId}
                onChange={e => {
                  soundManager.playClick();
                  setSelectedClassId(e.target.value);
                }}
                className="w-full text-base sm:text-lg font-bold font-display text-slate-900 bg-transparent border-b-2 border-indigo-200 focus:border-indigo-600 focus:outline-none cursor-pointer pr-4 py-1"
              >
                {/* 3º Ano (A ao E) */}
                {(gradeFilter === 'all' || gradeFilter === '3') && turmas3.length > 0 && (
                  <optgroup label="📘 3º Ano do Ensino Fundamental (Turmas A até E)">
                    {turmas3.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} {c.schoolName ? `— ${c.schoolName}` : ''}
                      </option>
                    ))}
                  </optgroup>
                )}

                {/* 5º Ano (A ao E) */}
                {(gradeFilter === 'all' || gradeFilter === '5') && turmas5.length > 0 && (
                  <optgroup label="📙 5º Ano do Ensino Fundamental (Turmas A até E)">
                    {turmas5.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} {c.schoolName ? `— ${c.schoolName}` : ''}
                      </option>
                    ))}
                  </optgroup>
                )}

                {/* 4º Ano (A ao E) */}
                {(gradeFilter === 'all' || gradeFilter === '4') && turmas4.length > 0 && (
                  <optgroup label="📗 4º Ano do Ensino Fundamental (Turmas A até E)">
                    {turmas4.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} {c.schoolName ? `— ${c.schoolName}` : ''}
                      </option>
                    ))}
                  </optgroup>
                )}

                {/* Outras Turmas */}
                {otherTurmas.length > 0 && (
                  <optgroup label="🏫 Outras Turmas Cadastradas">
                    {otherTurmas.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} {c.schoolName ? `— ${c.schoolName}` : ''}
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>
            </div>
          </div>

          {selectedClass && (
            <div className="text-right text-xs text-slate-500 pl-4 border-l border-slate-100 hidden sm:block">
              <div className="font-semibold text-slate-700">{selectedClass.schoolName || 'Escola Municipal'}</div>
              <div>{selectedClass.teacherName || 'Educador Responsável'}</div>
            </div>
          )}
        </div>
      </div>

      {/* Class Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-medium block">Total de Alunos na Turma</span>
          <p className="text-2xl font-extrabold text-slate-900 font-display tabular-nums">
            {students.length} {students.length === 1 ? 'estudante' : 'estudantes'}
          </p>
          <p className="text-[11px] text-slate-400">
            {selectedClass ? selectedClass.teacherName || 'Professor(a) Responsável' : ''}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-medium block">Pontuação Média da Turma</span>
          <p className="text-2xl font-extrabold text-indigo-600 font-display tabular-nums">
            {students.length > 0
              ? Math.round(students.reduce((acc, s) => acc + s.score, 0) / students.length)
              : 0}{' '}
            pts
          </p>
          <p className="text-[11px] text-slate-400">Média geral de XP acumulado</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-medium block">Líder do Ranking da Turma</span>
          {students.length > 0 ? (
            <div>
              <p className="text-lg font-bold text-slate-900 font-display flex items-center gap-1">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>{students[0].studentName}</span>
              </p>
              <p className="text-xs text-amber-700 font-mono font-semibold">
                {students[0].score} pts · {students[0].levelTitle}
              </p>
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">Nenhum aluno cadastrado nesta turma ainda.</p>
          )}
        </div>
      </div>

      {/* Top 5 Students Ranking Podium & Leaderboard */}
      <RankingEstudantes
        students={students}
        currentStudentName={userStats.studentName}
        classroomName={selectedClass?.name}
      />

      {/* Classroom BNCC Bar Chart with Recharts */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-indigo-700 uppercase tracking-wider">
              <span>GRÁFICO COLETIVO DA TURMA</span>
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 font-display mt-0.5">
              Média de Aproveitamento da Turma por Habilidade BNCC
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">Dados sincronizados no Firestore</span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 15, right: 15, left: -20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="name"
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: '#e2e8f0' }}
                dy={8}
              />
              <YAxis
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#e2e8f0' }}
                domain={[0, 100]}
                ticks={[0, 25, 50, 75, 100]}
                tickFormatter={v => `${v}%`}
              />
              <Tooltip
                formatter={(value: any) => [`${value}%`, 'Média da Turma']}
                labelFormatter={(label: any) => `Habilidade: ${label}`}
              />
              <Bar dataKey="mediaTurma" radius={[8, 8, 0, 0]} maxBarSize={56} animationDuration={1000}>
                {chartData.map(entry => (
                  <Cell key={entry.code} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Students Roster & Ranking Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 font-display">
              Quadro de Desempenho dos Alunos
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Registros individuais salvos no Firebase Firestore
            </p>
          </div>

          <button
            onClick={onOpenIdentityModal}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 cursor-pointer"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Alterar Aluno Ativo</span>
          </button>
        </div>

        {students.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 font-mono uppercase text-slate-500">
                <tr>
                  <th className="px-6 py-3 font-semibold">Posição</th>
                  <th className="px-6 py-3 font-semibold">Estudante</th>
                  <th className="px-6 py-3 font-semibold">Nível / Patente</th>
                  <th className="px-6 py-3 font-semibold text-right">Pontos</th>
                  <th className="px-6 py-3 font-semibold text-right">Estrelas</th>
                  <th className="px-6 py-3 font-semibold text-center">Fatos (EF15)</th>
                  <th className="px-6 py-3 font-semibold text-center">Ideia (EF35)</th>
                  <th className="px-6 py-3 font-semibold text-center">Pistas (EF35)</th>
                  <th className="px-6 py-3 font-semibold text-center">Acentos (EF05)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((student, idx) => {
                  const isCurrent = userStats.studentName === student.studentName;
                  return (
                    <tr
                      key={student.studentId}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isCurrent ? 'bg-indigo-50/40 font-semibold' : ''
                      }`}
                    >
                      <td className="px-6 py-3.5 font-mono text-slate-400">
                        {idx === 0 ? '🥇 1º' : idx === 1 ? '🥈 2º' : idx === 2 ? '🥉 3º' : `${idx + 1}º`}
                      </td>
                      <td className="px-6 py-3.5 font-medium text-slate-900">
                        <div className="flex items-center gap-1.5">
                          <span>{student.studentName}</span>
                          {isCurrent && (
                            <span className="text-[10px] font-mono text-indigo-700 bg-indigo-100 px-1.5 py-0.2 rounded">
                              Você
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-3.5 text-slate-600">
                        {student.levelTitle} (Nív. {student.levelNumber})
                      </td>
                      <td className="px-6 py-3.5 font-mono font-bold text-slate-900 text-right tabular-nums">
                        {student.score}
                      </td>
                      <td className="px-6 py-3.5 font-mono text-amber-600 text-right tabular-nums">
                        ⭐ {student.starsEarned}
                      </td>
                      <td className="px-6 py-3.5 text-center font-mono">
                        {student.ef15lp03_attempted > 0
                          ? `${Math.round((student.ef15lp03_correct / student.ef15lp03_attempted) * 100)}%`
                          : '-'}
                      </td>
                      <td className="px-6 py-3.5 text-center font-mono">
                        {student.ef35lp03_attempted > 0
                          ? `${Math.round((student.ef35lp03_correct / student.ef35lp03_attempted) * 100)}%`
                          : '-'}
                      </td>
                      <td className="px-6 py-3.5 text-center font-mono">
                        {student.ef35lp04_attempted > 0
                          ? `${Math.round((student.ef35lp04_correct / student.ef35lp04_attempted) * 100)}%`
                          : '-'}
                      </td>
                      <td className="px-6 py-3.5 text-center font-mono">
                        {student.ef05lp03_attempted > 0
                          ? `${Math.round((student.ef05lp03_correct / student.ef05lp03_attempted) * 100)}%`
                          : '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center text-xl mx-auto">
              📝
            </div>
            <p className="text-sm font-semibold text-slate-700">Nenhum aluno registrado nesta turma ainda.</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Clique no botão acima "Salvar Aluno no Firebase" para enviar o desempenho do estudante conectado!
            </p>
          </div>
        )}
      </div>

      {/* Create Classroom Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
            onClick={() => setIsCreateOpen(false)}
          />
          <div className="relative z-10 bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 font-display">Cadastrar Nova Turma no Firebase</h3>
            <form onSubmit={handleCreateClass} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nome da Turma:</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: 4º Ano D (Vespertino)"
                  value={newClassName}
                  onChange={e => setNewClassName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Escola:</label>
                <input
                  type="text"
                  placeholder="Ex: Escola Municipal Monteiro Lobato"
                  value={newSchoolName}
                  onChange={e => setNewSchoolName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Professor(a) Responsável:</label>
                <input
                  type="text"
                  placeholder="Ex: Prof. Roberto Albuquerque"
                  value={newTeacherName}
                  onChange={e => setNewTeacherName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 text-slate-600 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!newClassName.trim()}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl"
                >
                  Salvar Turma
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
