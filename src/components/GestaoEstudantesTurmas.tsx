import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Search,
  RefreshCw,
  ArrowRight,
  Filter,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  Sparkles,
  School,
  Star,
  Trophy,
  ShieldAlert,
} from 'lucide-react';
import {
  FirebaseClassroom,
  FirebaseStudentPerformance,
  fetchClassrooms,
  fetchStudentsInClassroom,
} from '../services/firebase';
import { TransferClassroomModal } from './TransferClassroomModal';
import { soundManager } from '../utils/audio';

interface Props {
  currentClassroomId: string;
  onStudentTransferred?: (studentName: string, newClassroomId: string, newClassroomName: string) => void;
  onNavigateToDiagnostic?: () => void;
}

interface StudentWithClassroom extends FirebaseStudentPerformance {
  classroomName: string;
}

export const GestaoEstudantesTurmas: React.FC<Props> = ({
  currentClassroomId,
  onStudentTransferred,
  onNavigateToDiagnostic,
}) => {
  const [classrooms, setClassrooms] = useState<FirebaseClassroom[]>([]);
  const [allStudents, setAllStudents] = useState<StudentWithClassroom[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedGrade, setSelectedGrade] = useState<'all' | '3' | '4' | '5'>('all');
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('all');

  // Modal State
  const [isTransferModalOpen, setIsTransferModalOpen] = useState<boolean>(false);
  const [selectedStudentForTransfer, setSelectedStudentForTransfer] = useState<FirebaseStudentPerformance | null>(null);

  // Success Notification Banner
  const [recentTransferNotice, setRecentTransferNotice] = useState<{
    studentName: string;
    newClassroomName: string;
  } | null>(null);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const classesList = await fetchClassrooms();
      setClassrooms(classesList);

      const classMap = new Map<string, string>();
      classesList.forEach(c => classMap.set(c.id, c.name));

      // Fetch students for all classrooms in parallel
      const studentPromises = classesList.map(async c => {
        try {
          const list = await fetchStudentsInClassroom(c.id);
          return list.map(st => ({
            ...st,
            classroomId: c.id,
            classroomName: c.name || classMap.get(st.classroomId) || c.id,
          }));
        } catch {
          return [];
        }
      });

      const results = await Promise.all(studentPromises);
      const combined: StudentWithClassroom[] = [];
      const seen = new Set<string>();

      results.forEach(group => {
        group.forEach(st => {
          if (!seen.has(st.studentId)) {
            seen.add(st.studentId);
            combined.push(st);
          }
        });
      });

      // Sort alphabetically by student name
      combined.sort((a, b) => a.studentName.localeCompare(b.studentName, 'pt-BR'));
      setAllStudents(combined);
    } catch (err) {
      console.error('Erro ao carregar dados dos estudantes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenTransfer = (student: FirebaseStudentPerformance) => {
    soundManager.playClick();
    setSelectedStudentForTransfer(student);
    setIsTransferModalOpen(true);
  };

  const handleTransferSuccess = (
    updatedStudent: FirebaseStudentPerformance,
    newClassroomId: string,
    newClassroomName: string
  ) => {
    // Update local state list immediately
    setAllStudents(prev =>
      prev.map(st => {
        if (st.studentId === updatedStudent.studentId) {
          return {
            ...st,
            ...updatedStudent,
            classroomId: newClassroomId,
            classroomName: newClassroomName,
          };
        }
        return st;
      })
    );

    setRecentTransferNotice({
      studentName: updatedStudent.studentName,
      newClassroomName,
    });

    if (onStudentTransferred) {
      onStudentTransferred(updatedStudent.studentName, newClassroomId, newClassroomName);
    }

    setTimeout(() => {
      setRecentTransferNotice(null);
    }, 6000);
  };

  // Filter students based on search term, grade filter and class filter
  const filteredStudents = allStudents.filter(st => {
    const matchesSearch =
      st.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      st.classroomName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesGrade =
      selectedGrade === 'all' ||
      st.classroomId.includes(selectedGrade) ||
      st.classroomName.includes(`${selectedGrade}º`);

    const matchesClass =
      selectedClassFilter === 'all' || st.classroomId === selectedClassFilter;

    return matchesSearch && matchesGrade && matchesClass;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Context */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-2xl shadow-xs shrink-0">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                  Gestão & Remanejamento
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {allStudents.length} alunos cadastrados
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold font-display text-slate-900 mt-1">
                Alteração de Turma & Organização de Estudantes
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              loadAllData();
            }}
            disabled={isLoading}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer flex items-center gap-2 self-start md:self-auto border border-slate-200"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Atualizar do Firestore</span>
          </button>
        </div>

        {/* Informative Box explaining the feature */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-amber-100/70 border border-amber-200 flex items-start gap-3 text-xs text-amber-950">
          <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">
              Correção Imediata para Alunos que Selecionaram a Turma Errada:
            </p>
            <p className="leading-relaxed text-amber-900">
              É comum que alunos do Ensino Fundamental I cliquem por engano em outra turma ao entrar no jogo. Localize o aluno na busca abaixo e clique em{' '}
              <strong className="underline underline-offset-2">"Alterar Turma"</strong>. O sistema transferirá o cadastro no Firestore preservando 100% dos pontos, estrelas e medalhas conquistadas.
            </p>
          </div>
        </div>

        {/* Success Notice Banner */}
        <AnimatePresence>
          {recentTransferNotice && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  O estudante <strong>{recentTransferNotice.studentName}</strong> foi remanejado com sucesso para a{' '}
                  <strong className="text-emerald-700 font-bold bg-white px-2 py-0.5 rounded border border-emerald-200">
                    {recentTransferNotice.newClassroomName}
                  </strong>
                  !
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-700">Firestore Sincronizado</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filter Bar */}
        <div className="pt-2 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Buscar aluno por nome ou turma..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 focus:outline-none text-xs text-slate-900 bg-white"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Grade Selector Tabs */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Ano:</span>
            </span>

            <div className="flex items-center bg-slate-100 p-1 rounded-xl gap-1">
              {(['all', '3', '4', '5'] as const).map(grade => (
                <button
                  key={grade}
                  onClick={() => {
                    soundManager.playClick();
                    setSelectedGrade(grade);
                  }}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    selectedGrade === grade
                      ? 'bg-white text-indigo-900 shadow-2xs font-extrabold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {grade === 'all' ? 'Todos' : `${grade}º Ano`}
                </button>
              ))}
            </div>

            {/* Class specific dropdown */}
            <select
              value={selectedClassFilter}
              onChange={e => {
                soundManager.playClick();
                setSelectedClassFilter(e.target.value);
              }}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-indigo-600"
            >
              <option value="all">Todas as Turmas Específicas</option>
              {classrooms.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-extrabold text-slate-900 font-display">
              Alunos Encontrados ({filteredStudents.length})
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Clique em "Alterar Turma" para transferir
          </span>
        </div>

        {isLoading ? (
          <div className="py-16 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
            <p className="text-xs text-slate-500 font-medium">Carregando lista de alunos do Firestore...</p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center text-xl mx-auto">
              🔍
            </div>
            <p className="text-sm font-semibold text-slate-700">Nenhum estudante encontrado com esses filtros.</p>
            <p className="text-xs text-slate-400">Tente buscar por outro nome ou limpar os filtros de ano escolar.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 font-mono uppercase text-slate-500">
                <tr>
                  <th className="px-6 py-3 font-semibold">Aluno(a)</th>
                  <th className="px-6 py-3 font-semibold">Turma Atual</th>
                  <th className="px-6 py-3 font-semibold text-right">Pontuação</th>
                  <th className="px-6 py-3 font-semibold text-right">Estrelas</th>
                  <th className="px-6 py-3 font-semibold">Patente BNCC</th>
                  <th className="px-6 py-3 font-semibold text-center">Ações do Professor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map(student => (
                  <tr key={student.studentId} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 text-white flex items-center justify-center font-bold text-xs uppercase shadow-2xs">
                          {student.studentName.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block text-xs">
                            {student.studentName}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            ID: {student.studentId.substring(0, 16)}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-3.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-900 font-bold font-mono text-xs">
                        <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                        <span>{student.classroomName}</span>
                      </span>
                    </td>

                    <td className="px-6 py-3.5 font-mono font-bold text-slate-900 text-right tabular-nums">
                      {student.score} pts
                    </td>

                    <td className="px-6 py-3.5 font-mono text-amber-600 text-right tabular-nums font-semibold">
                      ⭐ {student.starsEarned}
                    </td>

                    <td className="px-6 py-3.5 text-slate-600">
                      <span className="text-xs font-medium">{student.levelTitle}</span>
                      <span className="text-[10px] text-slate-400 block font-mono">Nível {student.levelNumber}</span>
                    </td>

                    <td className="px-6 py-3.5 text-center">
                      <button
                        onClick={() => handleOpenTransfer(student)}
                        className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-all cursor-pointer shadow-xs hover:shadow-sm inline-flex items-center gap-1.5 border border-amber-500/30"
                        title="Corrigir a turma deste estudante caso ele tenha escolhido errado"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-slate-900" />
                        <span>Alterar Turma 🔄</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Transfer Classroom Modal */}
      <AnimatePresence>
        {isTransferModalOpen && selectedStudentForTransfer && (
          <TransferClassroomModal
            isOpen={isTransferModalOpen}
            onClose={() => {
              setIsTransferModalOpen(false);
              setSelectedStudentForTransfer(null);
            }}
            student={selectedStudentForTransfer}
            currentClassroomId={selectedStudentForTransfer.classroomId || currentClassroomId}
            currentClassroomName={
              classrooms.find(c => c.id === selectedStudentForTransfer.classroomId)?.name
            }
            onSuccess={handleTransferSuccess}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
