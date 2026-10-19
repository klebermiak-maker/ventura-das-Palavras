import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  School,
  CheckCircle,
  Sparkles,
  X,
  Plus,
  ArrowRight,
  ShieldAlert,
  GraduationCap,
  Users,
} from 'lucide-react';
import { FirebaseClassroom, fetchClassrooms, createClassroom } from '../services/firebase';
import { soundManager } from '../utils/audio';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentStudentName: string;
  currentClassroomId: string;
  onSaveIdentity: (name: string, classroomId: string, classroomName: string) => void;
  pendingMissionName?: string | null;
  onContinueAsGuest?: () => void;
}

export const StudentIdentificationModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentStudentName,
  currentClassroomId,
  onSaveIdentity,
  pendingMissionName,
  onContinueAsGuest,
}) => {
  const [name, setName] = useState(currentStudentName);
  const [classroomId, setClassroomId] = useState(currentClassroomId || 'turma-4a');
  const [classrooms, setClassrooms] = useState<FirebaseClassroom[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingClass, setIsCreatingClass] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newSchoolName, setNewSchoolName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [gradeFilter, setGradeFilter] = useState<'3' | '5' | '4' | 'all'>('4');

  const isFirstTime = !currentStudentName || currentStudentName.trim() === '';

  useEffect(() => {
    setName(currentStudentName);
    if (currentClassroomId) {
      setClassroomId(currentClassroomId);
      // Auto-set grade filter if matching
      if (currentClassroomId.includes('4') || currentClassroomId.startsWith('turma-4')) {
        setGradeFilter('4');
      } else if (currentClassroomId.includes('3') || currentClassroomId.startsWith('turma-3')) {
        setGradeFilter('3');
      } else if (currentClassroomId.includes('5') || currentClassroomId.startsWith('turma-5')) {
        setGradeFilter('5');
      }
    }
  }, [currentStudentName, currentClassroomId]);

  useEffect(() => {
    if (isOpen) {
      loadClassrooms();
      setErrorMessage('');
    }
  }, [isOpen]);

  const loadClassrooms = async () => {
    setIsLoading(true);
    try {
      const list = await fetchClassrooms();
      setClassrooms(list);
      if (!classroomId && list.length > 0) {
        // Default to 4º Ano A or 3º Ano A
        const defaultClass = list.find(c => c.id === 'turma-4a') || list.find(c => c.id === 'turma-3a') || list[0];
        setClassroomId(defaultClass.id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNewClassroom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;

    soundManager.playClick();
    setIsLoading(true);
    try {
      const created = await createClassroom(newClassName, newSchoolName || 'Escola Municipal Educandário Nossa Senhora Aparecida');
      setClassrooms(prev => [...prev, created]);
      setClassroomId(created.id);
      setIsCreatingClass(false);
      setNewClassName('');
      setNewSchoolName('');
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName || trimmedName.length < 2) {
      setErrorMessage('Por favor, digite seu nome com pelo menos 2 letras.');
      return;
    }

    soundManager.playCorrect();
    const selectedClass = classrooms.find(c => c.id === classroomId);
    const chosenClassroomId = classroomId || 'turma-4a';
    const chosenClassName = selectedClass ? selectedClass.name : '4º Ano A';

    onSaveIdentity(trimmedName, chosenClassroomId, chosenClassName);
  };

  // Group classrooms
  const turmas3 = classrooms.filter(
    c => c.id.startsWith('turma-3') || c.name.includes('3º') || c.name.toLowerCase().includes('terceiro')
  );
  const turmas5 = classrooms.filter(
    c => c.id.startsWith('turma-5') || c.name.includes('5º') || c.name.toLowerCase().includes('quinto')
  );
  const turmas4 = classrooms.filter(
    c => c.id.startsWith('turma-4') || c.name.includes('4º') || c.name.toLowerCase().includes('quarto')
  );
  const otherTurmas = classrooms.filter(
    c => !turmas3.includes(c) && !turmas5.includes(c) && !turmas4.includes(c)
  );

  const selectedClass = classrooms.find(c => c.id === classroomId) || turmas3[0] || classrooms[0];

  // Helper to quickly select a letter (A, B, C, D, E) for current grade
  const handleSelectLetter = (letter: string) => {
    soundManager.playClick();
    const targetGrade = gradeFilter === '5' ? '5' : gradeFilter === '4' ? '4' : '3';
    const targetId = `turma-${targetGrade}${letter.toLowerCase()}`;
    const found = classrooms.find(
      c => c.id === targetId || (c.name.includes(`${targetGrade}º`) && c.name.toUpperCase().includes(` ${letter}`))
    );
    if (found) {
      setClassroomId(found.id);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => {
          if (!isFirstTime) {
            onClose();
          }
        }}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs cursor-pointer"
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-50">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-md">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold tracking-wider text-indigo-700 uppercase">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Identificação Obrigatória</span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 font-display">
                {isFirstTime ? 'Quem é você na Aventura?' : 'Identificação do Estudante'}
              </h2>
            </div>
          </div>
          {!isFirstTime && (
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Informative Banner */}
        <div className="px-6 py-3 bg-amber-50/80 border-b border-amber-200/70 flex items-start gap-2.5 text-xs text-amber-900">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            {pendingMissionName ? (
              <span>
                Para acessar <strong>{pendingMissionName}</strong>, identifique-se e escolha sua turma para registrar seus pontos e medalhas.
              </span>
            ) : (
              <span>
                Para acumular pontos, disputar o <strong>Ranking da Turma</strong> e emitir seu <strong>Certificado de Conquista</strong>, digite seu nome e escolha sua turma.
              </span>
            )}
          </p>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Student Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between">
              <span>1. Nome do Aluno(a):</span>
              <span className="text-[11px] font-normal text-slate-400 lowercase">ex: Lucas Silva, Ana Beatriz</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                autoFocus={isFirstTime}
                value={name}
                onChange={e => {
                  setName(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="Digite seu primeiro nome e sobrenome"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 focus:outline-none text-sm font-semibold text-slate-900 transition-colors shadow-2xs"
              />
            </div>
            {errorMessage && (
              <p className="text-xs text-rose-600 font-semibold">{errorMessage}</p>
            )}
          </div>

          {/* Classroom Selection */}
          {!isCreatingClass ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-indigo-600" />
                  <span>2. Escolha sua Turma Escolar:</span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsCreatingClass(true)}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Nova Turma</span>
                </button>
              </div>

              {/* Grade Filter Tabs (4º Ano, 3º Ano, 5º Ano ou Todas) */}
              <div className="grid grid-cols-4 gap-1.5 bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    setGradeFilter('4');
                    const target = classrooms.find(c => c.id === 'turma-4a');
                    if (target) setClassroomId(target.id);
                  }}
                  className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    gradeFilter === '4'
                      ? 'bg-white text-emerald-700 shadow-xs ring-1 ring-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  📗 4º Ano
                </button>
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    setGradeFilter('3');
                    const target = classrooms.find(c => c.id === 'turma-3a');
                    if (target) setClassroomId(target.id);
                  }}
                  className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    gradeFilter === '3'
                      ? 'bg-white text-indigo-700 shadow-xs ring-1 ring-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  📘 3º Ano
                </button>
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    setGradeFilter('5');
                    const target = classrooms.find(c => c.id === 'turma-5a');
                    if (target) setClassroomId(target.id);
                  }}
                  className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    gradeFilter === '5'
                      ? 'bg-white text-amber-700 shadow-xs ring-1 ring-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  📙 5º Ano
                </button>
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    setGradeFilter('all');
                  }}
                  className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    gradeFilter === 'all'
                      ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-200'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Todas
                </button>
              </div>

              {/* Quick letter buttons A ao E for rapid selection */}
              <div className="flex items-center justify-between gap-1.5 bg-indigo-50/70 p-2.5 rounded-xl border border-indigo-100">
                <span className="text-[11px] font-bold text-indigo-900 uppercase tracking-wide shrink-0">
                  Letra ({gradeFilter === '5' ? '5º Ano' : gradeFilter === '4' ? '4º Ano' : gradeFilter === '3' ? '3º Ano' : 'Turma'}):
                </span>
                <div className="flex items-center gap-1.5">
                  {['A', 'B', 'C', 'D', 'E'].map(letter => {
                    const activeGrade = gradeFilter === '5' ? '5' : gradeFilter === '4' ? '4' : '3';
                    const targetId = `turma-${activeGrade}${letter.toLowerCase()}`;
                    const isSelected =
                      selectedClass &&
                      (selectedClass.id === targetId ||
                        (selectedClass.name.includes(`${activeGrade}º`) && selectedClass.name.endsWith(` ${letter}`)));
                    return (
                      <button
                        key={letter}
                        type="button"
                        onClick={() => handleSelectLetter(letter)}
                        className={`w-8 h-8 rounded-lg text-xs font-black transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-600 text-white shadow-xs scale-105 ring-2 ring-indigo-400'
                            : 'bg-white text-slate-700 border border-indigo-200 hover:bg-indigo-100 hover:text-indigo-900'
                        }`}
                        title={`Selecionar ${gradeFilter === '5' ? '5º Ano' : gradeFilter === '4' ? '4º Ano' : '3º Ano'} ${letter}`}
                      >
                        {letter}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* The Main Dropdown List (Lista Suspensa) */}
              <div className="relative">
                <select
                  value={classroomId}
                  onChange={e => {
                    soundManager.playClick();
                    setClassroomId(e.target.value);
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 focus:outline-none text-sm font-bold text-slate-900 bg-white transition-colors cursor-pointer shadow-xs"
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

                  {/* Other classes */}
                  {otherTurmas.length > 0 && (
                    <optgroup label="🏫 Outras Turmas">
                      {otherTurmas.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.name} {c.schoolName ? `— ${c.schoolName}` : ''}
                        </option>
                      ))}
                    </optgroup>
                  )}
                </select>
              </div>

              {/* Selected Classroom Preview Card */}
              {selectedClass && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                      <School className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{selectedClass.name}</div>
                      <div className="text-[11px] text-slate-500">
                        {selectedClass.schoolName || 'Escola'} {selectedClass.teacherName ? `• ${selectedClass.teacherName}` : ''}
                      </div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                    ✓ Turma Selecionada
                  </span>
                </div>
              )}
            </div>
          ) : (
            /* Create Classroom Mini-Form */
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">Nova Turma Escolar</span>
                <button
                  type="button"
                  onClick={() => setIsCreatingClass(false)}
                  className="text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  Voltar à seleção
                </button>
              </div>

              <input
                type="text"
                value={newClassName}
                onChange={e => setNewClassName(e.target.value)}
                placeholder="Nome da Turma (Ex: 3º Ano F ou 5º Ano F)"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-indigo-600 bg-white font-medium"
              />

              <input
                type="text"
                value={newSchoolName}
                onChange={e => setNewSchoolName(e.target.value)}
                placeholder="Escola (Ex: Escola Municipal Educandário Nossa Senhora Aparecida)"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-indigo-600 bg-white"
              />

              <button
                type="button"
                onClick={handleCreateNewClassroom}
                disabled={!newClassName.trim() || isLoading}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
              >
                Salvar Turma no Firebase
              </button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
            {isFirstTime ? (
              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  if (onContinueAsGuest) {
                    onContinueAsGuest();
                  } else {
                    onClose();
                  }
                }}
                className="text-xs text-slate-500 hover:text-slate-700 font-medium underline underline-offset-2 cursor-pointer"
              >
                Explorar como Visitante
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancelar
              </button>
            )}

            <button
              type="submit"
              disabled={!name.trim()}
              className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{isFirstTime ? 'Começar Aventura! 🚀' : 'Salvar e Conectar'}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
