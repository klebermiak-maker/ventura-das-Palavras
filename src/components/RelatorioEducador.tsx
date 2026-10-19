import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Printer, RotateCcw, Award, CheckCircle2, AlertCircle, BookOpen, User, Star, Users } from 'lucide-react';
import { BNCCSkill } from '../types/game';
import { BNCC_SKILLS_INFO } from '../data/bnccContent';
import { soundManager } from '../utils/audio';
import { getPlayerLevelInfo } from '../utils/levels';

interface Props {
  skillStats: Record<BNCCSkill, { attempted: number; correct: number }>;
  score: number;
  starsCount: number;
  badgesEarned: string[];
  studentName: string;
  onUpdateStudentName: (name: string) => void;
  onResetProgress: () => void;
  onNavigate: (view: string) => void;
}

export const RelatorioEducador: React.FC<Props> = ({
  skillStats,
  score,
  starsCount,
  badgesEarned,
  studentName,
  onUpdateStudentName,
  onResetProgress,
  onNavigate,
}) => {
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const skillsList: BNCCSkill[] = ['EF15LP03', 'EF35LP03', 'EF35LP04', 'EF05LP03'];

  const getDiagnostic = (stats: { attempted: number; correct: number }) => {
    if (stats.attempted === 0) return { label: 'Não iniciado', color: 'text-slate-400 bg-slate-100', advice: 'Inicie os exercícios deste módulo para avaliar o desempenho.' };
    const pct = (stats.correct / stats.attempted) * 100;
    if (pct >= 80) return { label: 'Domínio Consolidado', color: 'text-emerald-700 bg-emerald-50 border border-emerald-200', advice: 'O estudante demonstra segurança total nesta habilidade.' };
    if (pct >= 50) return { label: 'Em Desenvolvimento', color: 'text-amber-700 bg-amber-50 border border-amber-200', advice: 'Boa compreensão, recomende a releitura atenta e o uso do recurso de destaque.' };
    return { label: 'Necessita Reforço', color: 'text-rose-700 bg-rose-50 border border-rose-200', advice: 'Sugerido retorno ao módulo e consulta às regras antes de novas tentativas.' };
  };

  const handlePrint = () => {
    soundManager.playClick();
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Bar for Actions (no-print) */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 no-print"
      >
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-indigo-700 font-semibold">
            <span>PAINEL PEDAGÓGICO</span>
            <span aria-hidden="true">·</span>
            <span>Avaliação Formativa 4º Ano EF</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display mt-1">
            Relatório de Desempenho & Diagnóstico BNCC
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Acompanhamento individual das competências de leitura, interpretação e acentuação gráfica da Língua Portuguesa.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              soundManager.playClick();
              onNavigate('turmas');
            }}
            className="px-3.5 py-2 border border-indigo-200 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 font-semibold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Relatórios por Turmas (Firebase)</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onNavigate('certificado');
            }}
            className="px-3.5 py-2 border border-amber-300 text-amber-900 bg-amber-100 hover:bg-amber-200 font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
          >
            <Award className="w-4 h-4 text-amber-600" />
            <span>Emitir Certificado 🏅</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-2 shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Relatório</span>
          </button>

          {!showConfirmReset ? (
            <button
              onClick={() => setShowConfirmReset(true)}
              className="px-3 py-2 border border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Zerar Dados</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-rose-50 p-1 rounded-lg border border-rose-200">
              <span className="text-[11px] text-rose-800 font-medium px-1">Confirmar?</span>
              <button
                onClick={() => {
                  soundManager.playClick();
                  onResetProgress();
                  setShowConfirmReset(false);
                }}
                className="px-2 py-1 bg-rose-600 text-white text-xs font-bold rounded cursor-pointer"
              >
                Sim
              </button>
              <button
                onClick={() => setShowConfirmReset(false)}
                className="px-2 py-1 text-slate-600 text-xs font-semibold cursor-pointer"
              >
                Não
              </button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Student Personalization Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
            <User className="w-7 h-7" />
          </div>
          <div className="flex-1">
            <label htmlFor="student-name-input" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Nome do Estudante:
            </label>
            <input
              id="student-name-input"
              type="text"
              value={studentName}
              onChange={e => onUpdateStudentName(e.target.value)}
              placeholder="Digite o nome do aluno(a)..."
              className="mt-1 text-lg sm:text-xl font-bold font-display text-slate-900 border-b-2 border-indigo-200 focus:border-indigo-600 focus:outline-none bg-transparent w-full sm:w-72 pb-1"
            />
          </div>
        </div>

        <div className="flex items-center gap-6 text-center sm:text-right w-full sm:w-auto justify-around sm:justify-end border-t sm:border-t-0 pt-4 sm:pt-0 border-slate-100">
          <div>
            <span className="text-xs text-slate-400 block font-mono">NÍVEL</span>
            <span className="text-base font-bold text-slate-900 font-display flex items-center gap-1 justify-center sm:justify-end">
              <span>{getPlayerLevelInfo(score).currentTier.icon}</span>
              <span>{getPlayerLevelInfo(score).currentTier.title}</span>
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-mono">PONTOS</span>
            <span className="text-2xl font-bold text-slate-900 font-display tabular-nums">{score}</span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-mono">ESTRELAS</span>
            <span className="text-2xl font-bold text-amber-500 font-display tabular-nums flex items-center gap-1 justify-center sm:justify-end">
              <Star className="w-5 h-5 fill-amber-500" />
              <span>{starsCount}</span>
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-mono">MEDALHAS</span>
            <span className="text-2xl font-bold text-indigo-600 font-display tabular-nums">{badgesEarned.length} / 5</span>
          </div>
        </div>
      </div>

      {/* Skill Diagnostic Cards */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 font-display">
          Desempenho por Habilidade da BNCC
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skillsList.map(code => {
            const info = BNCC_SKILLS_INFO[code];
            const stats = skillStats[code] || { attempted: 0, correct: 0 };
            const diag = getDiagnostic(stats);
            const percentage = stats.attempted > 0 ? Math.round((stats.correct / stats.attempted) * 100) : 0;

            return (
              <div
                key={code}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-mono font-bold text-indigo-700 block">
                      {code}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 font-display mt-0.5">
                      {info.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {info.shortDesc}
                    </p>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-md shrink-0 ${diag.color}`}>
                    {diag.label}
                  </span>
                </div>

                {/* Accuracy meter */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-600 font-medium">
                    <span>Taxa de Acerto</span>
                    <span className="font-mono tabular-nums">{percentage}% ({stats.correct}/{stats.attempted})</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        percentage >= 70 ? 'bg-emerald-500' :
                        percentage >= 40 ? 'bg-amber-500' :
                        stats.attempted === 0 ? 'bg-slate-300' : 'bg-rose-500'
                      }`}
                      style={{ width: `${stats.attempted > 0 ? percentage : 0}%` }}
                    />
                  </div>
                </div>

                {/* Pedagogical Advice */}
                <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <strong className="text-slate-800">Parecer Pedagógico:</strong> {diag.advice}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Printable Certificate Preview Section */}
      <div className="p-8 rounded-3xl border-2 border-indigo-200 bg-gradient-to-b from-indigo-50/40 via-white to-indigo-50/20 shadow-xs text-center space-y-6 print-only-container">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-amber-400 text-white flex items-center justify-center text-3xl shadow-sm">
            🏆
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-mono uppercase tracking-widest text-indigo-700 font-bold">
            Certificado de Mérito Pedagógico em Língua Portuguesa
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display">
            {studentName || 'Estudante da Expedição das Letras'}
          </h2>
          <p className="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            Comprovou dedicação no desenvolvimento das competências leitoras e ortográficas do 4º Ano do Ensino Fundamental, atingindo <strong>{score} pontos</strong>, <strong>{starsCount} estrelas douradas</strong> e o título honorário de <strong>{getPlayerLevelInfo(score).currentTier.title}</strong>.
          </p>
        </div>

        <div className="pt-6 border-t border-indigo-100 flex flex-wrap items-center justify-around gap-4 text-xs font-mono text-slate-500">
          <div>
            <span className="block font-bold text-slate-800">EF15LP03</span>
            <span>Localização de Fatos</span>
          </div>
          <div>
            <span className="block font-bold text-slate-800">EF35LP03</span>
            <span>Ideia Central</span>
          </div>
          <div>
            <span className="block font-bold text-slate-800">EF35LP04</span>
            <span>Deduções Implícitas</span>
          </div>
          <div>
            <span className="block font-bold text-slate-800">EF05LP03</span>
            <span>Acentuação Gráfica</span>
          </div>
        </div>
      </div>
    </div>
  );
};
