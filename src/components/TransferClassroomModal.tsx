import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  X,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  School,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import {
  FirebaseClassroom,
  FirebaseStudentPerformance,
  fetchClassrooms,
  transferStudentClassroom,
} from '../services/firebase';
import { soundManager } from '../utils/audio';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  student: FirebaseStudentPerformance | null;
  currentClassroomId: string;
  currentClassroomName?: string;
  onSuccess: (updatedStudent: FirebaseStudentPerformance, newClassroomId: string, newClassroomName: string) => void;
}

export const TransferClassroomModal: React.FC<Props> = ({
  isOpen,
  onClose,
  student,
  currentClassroomId,
  currentClassroomName,
  onSuccess,
}) => {
  const [classrooms, setClassrooms] = useState<FirebaseClassroom[]>([]);
  const [targetClassId, setTargetClassId] = useState<string>('');
  const [gradeFilter, setGradeFilter] = useState<'all' | '3' | '4' | '5'>('all');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isSuccessState, setIsSuccessState] = useState<boolean>(false);
  const [transferredInfo, setTransferredInfo] = useState<{
    studentName: string;
    fromName: string;
    toName: string;
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadClassrooms();
      setIsSuccessState(false);
      setTransferredInfo(null);
      setErrorMsg('');
      setTargetClassId('');
    }
  }, [isOpen]);

  const loadClassrooms = async () => {
    setIsLoading(true);
    try {
      const list = await fetchClassrooms();
      setClassrooms(list);
      // Default to first different classroom
      const otherClass = list.find(c => c.id !== (student?.classroomId || currentClassroomId));
      if (otherClass) {
        setTargetClassId(otherClass.id);
      }
    } catch (err) {
      console.error('Erro ao carregar turmas:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !student) return null;

  const activeOldClassId = student.classroomId || currentClassroomId;
  const oldClassObj = classrooms.find(c => c.id === activeOldClassId);
  const oldClassName = oldClassObj?.name || currentClassroomName || 'Turma Anterior';
  const targetClassObj = classrooms.find(c => c.id === targetClassId);
  const targetClassName = targetClassObj?.name || 'Nova Turma';

  const filteredClassrooms = classrooms.filter(c => {
    if (gradeFilter === 'all') return true;
    return c.id.includes(gradeFilter) || c.name.includes(`${gradeFilter}º`);
  });

  const handleConfirmTransfer = async () => {
    if (!targetClassId) {
      setErrorMsg('Por favor, selecione a turma de destino.');
      return;
    }

    if (targetClassId === activeOldClassId) {
      setErrorMsg('O estudante já está matriculado nesta turma. Selecione uma turma diferente.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      soundManager.playClick();
      const updated = await transferStudentClassroom(student, activeOldClassId, targetClassId);
      soundManager.playCorrect();

      setTransferredInfo({
        studentName: student.studentName,
        fromName: oldClassName,
        toName: targetClassName,
      });
      setIsSuccessState(true);

      // Call parent callback
      onSuccess(updated, targetClassId, targetClassName);

      // Auto close after brief celebration
      setTimeout(() => {
        onClose();
      }, 1800);
    } catch (err: any) {
      console.error('Falha na transferência:', err);
      setErrorMsg('Não foi possível transferir o aluno. Tente novamente.');
      soundManager.playWrong();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        className="relative z-10 bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-6 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-xl shadow-xs shrink-0">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded">
                  Espaço do Professor
                </span>
                <span className="text-[10px] text-indigo-200 font-mono">Correção de Cadastro</span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold font-display text-white mt-1">
                Alterar Turma do Aluno
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-indigo-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Overlay View */}
        {isSuccessState && transferredInfo ? (
          <div className="p-8 text-center space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 12 }}
              className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl shadow-sm"
            >
              <CheckCircle2 className="w-10 h-10" />
            </motion.div>
            <h3 className="text-xl font-extrabold text-slate-900 font-display">
              Turma Alterada com Sucesso!
            </h3>
            <p className="text-sm text-slate-600 max-w-sm mx-auto">
              O estudante <strong className="text-indigo-900">{transferredInfo.studentName}</strong> foi transferido da turma{' '}
              <strong className="text-slate-800">{transferredInfo.fromName}</strong> para{' '}
              <strong className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {transferredInfo.toName}
              </strong>
              .
            </p>
            <div className="pt-2 text-xs text-slate-400 font-mono">
              Todos os pontos, estrelas e medalhas continuam preservados no Firebase.
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-5 overflow-y-auto">
            {/* Context Note */}
            <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200/80 flex items-start gap-2.5 text-xs text-amber-900">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong>O aluno selecionou a turma errada?</strong> Sem problemas! Esta ferramenta transfere o cadastro para a turma correta sem perder nenhuma estrela, medalha ou progresso de missões da BNCC.
              </p>
            </div>

            {/* Student Current Summary Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block">
                  Estudante Selecionado
                </span>
                <span className="text-base font-extrabold text-slate-900 font-display block">
                  {student.studentName}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {student.score} pts · ⭐ {student.starsEarned} estrelas · {student.levelTitle}
                </span>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-mono uppercase font-bold text-rose-500 block">
                  Turma Atual
                </span>
                <span className="inline-block mt-0.5 px-2.5 py-1 rounded-lg bg-rose-100 text-rose-800 text-xs font-bold font-mono">
                  {oldClassName}
                </span>
              </div>
            </div>

            {/* Step 2: Choose Target Class */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Selecione a Turma Correta de Destino:</span>
                </label>
                <span className="text-[11px] text-slate-400 font-mono">
                  {classrooms.length} turmas disponíveis
                </span>
              </div>

              {/* Grade Filter Tabs */}
              <div className="grid grid-cols-4 gap-1.5 bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setGradeFilter('all')}
                  className={`py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    gradeFilter === 'all'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Todas
                </button>
                <button
                  type="button"
                  onClick={() => setGradeFilter('3')}
                  className={`py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    gradeFilter === '3'
                      ? 'bg-white text-indigo-700 shadow-2xs font-extrabold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  3º Anos
                </button>
                <button
                  type="button"
                  onClick={() => setGradeFilter('4')}
                  className={`py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    gradeFilter === '4'
                      ? 'bg-white text-emerald-700 shadow-2xs font-extrabold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  4º Anos
                </button>
                <button
                  type="button"
                  onClick={() => setGradeFilter('5')}
                  className={`py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    gradeFilter === '5'
                      ? 'bg-white text-amber-700 shadow-2xs font-extrabold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  5º Anos
                </button>
              </div>

              {/* Classroom Radio Options List */}
              <div className="max-h-52 overflow-y-auto space-y-2 pr-1 divide-y divide-slate-100">
                {isLoading ? (
                  <div className="py-8 text-center text-xs text-slate-400 font-mono">
                    Carregando turmas escolares...
                  </div>
                ) : filteredClassrooms.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400">
                    Nenhuma turma encontrada para este filtro.
                  </div>
                ) : (
                  filteredClassrooms.map(c => {
                    const isSelected = targetClassId === c.id;
                    const isCurrent = c.id === activeOldClassId;

                    return (
                      <div
                        key={c.id}
                        onClick={() => {
                          if (!isCurrent) {
                            soundManager.playClick();
                            setTargetClassId(c.id);
                            if (errorMsg) setErrorMsg('');
                          }
                        }}
                        className={`pt-2 flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                          isCurrent
                            ? 'bg-slate-50 border-slate-200 opacity-60 cursor-not-allowed'
                            : isSelected
                            ? 'bg-indigo-50/90 border-indigo-400 shadow-xs ring-1 ring-indigo-400'
                            : 'bg-white border-slate-200 hover:border-indigo-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="targetClassroom"
                            checked={isSelected}
                            disabled={isCurrent}
                            onChange={() => setTargetClassId(c.id)}
                            className="text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                          />
                          <div>
                            <span className="text-xs font-bold text-slate-900 block flex items-center gap-1.5">
                              <span>{c.name}</span>
                              {isCurrent && (
                                <span className="text-[9px] font-mono font-semibold text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                                  Turma Atual
                                </span>
                              )}
                              {isSelected && !isCurrent && (
                                <span className="text-[9px] font-mono font-bold text-indigo-700 bg-indigo-100 px-1.5 py-0.2 rounded">
                                  Nova Turma 🎯
                                </span>
                              )}
                            </span>
                            <span className="text-[11px] text-slate-500 block">
                              {c.teacherName || 'Professor Responsável'}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] font-mono text-slate-400 block">
                            {c.id.includes('3') ? 'Ensino Fundamental' : 'BNCC'}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-xs text-rose-700">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Preview Summary */}
            {targetClassId && targetClassId !== activeOldClassId && (
              <div className="p-3 rounded-xl bg-indigo-50/80 border border-indigo-200/80 text-xs text-indigo-950 flex items-center justify-between">
                <span>Transferência:</span>
                <span className="font-bold flex items-center gap-1.5 font-mono">
                  <span className="text-slate-600 line-through">{oldClassName}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="text-indigo-800 bg-white px-2 py-0.5 rounded shadow-2xs border border-indigo-200">
                    {targetClassName}
                  </span>
                </span>
              </div>
            )}

            {/* Actions */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleConfirmTransfer}
                disabled={isSubmitting || !targetClassId || targetClassId === activeOldClassId}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Transferindo no Firestore...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirmar Transferência 🚀</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
