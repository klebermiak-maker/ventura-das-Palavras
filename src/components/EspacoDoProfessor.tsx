import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  Users,
  Award,
  BarChart3,
  BookOpen,
  ArrowLeft,
  School,
  Sparkles,
  FileText,
  Printer,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers,
  Trophy,
} from 'lucide-react';
import { UserStats, BNCCSkill } from '../types/game';
import { RelatorioTurmas } from './RelatorioTurmas';
import { RelatorioEducador } from './RelatorioEducador';
import { CertificadoConquista } from './CertificadoConquista';
import { RankingGlobal } from './RankingGlobal';
import { OFFICIAL_SCHOOL_NAME } from '../services/firebase';
import { soundManager } from '../utils/audio';

export type ProfessorTab = 'turmas' | 'certificado' | 'relatorio' | 'ranking';

interface Props {
  userStats: UserStats;
  currentClassroomId: string;
  initialTab?: ProfessorTab;
  onNavigate: (view: string) => void;
  onOpenIdentityModal: () => void;
  onUpdateStudentName: (name: string) => void;
  onResetProgress: () => void;
}

export const EspacoDoProfessor: React.FC<Props> = ({
  userStats,
  currentClassroomId,
  initialTab = 'turmas',
  onNavigate,
  onOpenIdentityModal,
  onUpdateStudentName,
  onResetProgress,
}) => {
  const [activeTab, setActiveTab] = useState<ProfessorTab>(initialTab);

  const handleTabChange = (tab: ProfessorTab) => {
    soundManager.playClick();
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      {/* Top Banner do Espaço do Professor */}
      <section className="bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-900 text-white border-b border-indigo-800/40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    soundManager.playClick();
                    onNavigate('hub');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-indigo-200 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Voltar às Missões dos Alunos</span>
                </button>

                <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300 bg-amber-400/10 border border-amber-400/20 px-2.5 py-1 rounded-md">
                  Área Pedagógica Restrita
                </span>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-2xl shadow-sm shrink-0">
                  <GraduationCap className="w-7 h-7" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white tracking-tight">
                    Espaço do Professor & Coordenação
                  </h1>
                  <p className="text-xs sm:text-sm text-indigo-200 flex items-center gap-2 mt-0.5">
                    <School className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{OFFICIAL_SCHOOL_NAME}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Summary Pill Box */}
            <div className="flex flex-wrap items-center gap-3 bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/15">
              <div className="px-3 py-1.5 text-center">
                <div className="text-[10px] uppercase font-mono text-indigo-300 font-bold">Turma Ativa</div>
                <div className="text-sm font-bold text-white mt-0.5">{userStats.classroomName || '4º Ano A'}</div>
              </div>

              <div className="h-8 w-px bg-white/20" />

              <div className="px-3 py-1.5 text-center">
                <div className="text-[10px] uppercase font-mono text-indigo-300 font-bold">Aluno Selecionado</div>
                <div className="text-sm font-bold text-amber-300 mt-0.5 truncate max-w-[150px]">
                  {userStats.studentName || 'Não identificado'}
                </div>
              </div>

              <div className="h-8 w-px bg-white/20" />

              <button
                onClick={() => {
                  soundManager.playClick();
                  onOpenIdentityModal();
                }}
                className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                <span>Trocar Turma / Aluno</span>
              </button>
            </div>
          </div>

          {/* Navigation Segmented Tabs for the Teacher Space */}
          <div className="mt-8 pt-4 border-t border-indigo-800/60 flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={() => handleTabChange('turmas')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'turmas'
                  ? 'bg-white text-indigo-950 shadow-md ring-2 ring-amber-400/50'
                  : 'bg-white/10 hover:bg-white/20 text-indigo-100 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4 text-indigo-600" />
              <span>1. Relatórios das Turmas & Estatísticas</span>
            </button>

            <button
              onClick={() => handleTabChange('certificado')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'certificado'
                  ? 'bg-white text-amber-950 shadow-md ring-2 ring-amber-400/50'
                  : 'bg-white/10 hover:bg-white/20 text-indigo-100 hover:text-white'
              }`}
            >
              <Award className="w-4 h-4 text-amber-500" />
              <span>2. Emissão de Certificados de Conquista</span>
            </button>

            <button
              onClick={() => handleTabChange('relatorio')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'relatorio'
                  ? 'bg-white text-emerald-950 shadow-md ring-2 ring-amber-400/50'
                  : 'bg-white/10 hover:bg-white/20 text-indigo-100 hover:text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-emerald-600" />
              <span>3. Diagnóstico Individual do Estudante</span>
            </button>

            <button
              onClick={() => handleTabChange('ranking')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'ranking'
                  ? 'bg-white text-amber-950 shadow-md ring-2 ring-amber-400/50'
                  : 'bg-white/10 hover:bg-white/20 text-indigo-100 hover:text-white'
              }`}
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>4. Ranking Global (Top 10 Geral)</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Tab Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'turmas' && (
            <motion.div
              key="tab-turmas"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mb-6 p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-indigo-950">
                      Painel Geral de Turmas & Rendimento Coletivo
                    </h2>
                    <p className="text-xs text-indigo-700">
                      Monitore o avanço das turmas nos descritores da BNCC, compare as pontuações e gere relatórios impressos.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleTabChange('certificado')}
                    className="px-3.5 py-2 text-xs font-bold rounded-lg bg-white border border-indigo-200 text-indigo-900 hover:bg-indigo-100 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Award className="w-3.5 h-3.5 text-amber-600" />
                    <span>Ir para Certificados</span>
                  </button>
                </div>
              </div>

              <RelatorioTurmas
                userStats={userStats}
                currentClassroomId={currentClassroomId}
                onNavigate={onNavigate}
                onOpenIdentityModal={onOpenIdentityModal}
              />
            </motion.div>
          )}

          {activeTab === 'certificado' && (
            <motion.div
              key="tab-certificado"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-amber-950">
                      Central de Emissão de Certificados Oficiais
                    </h2>
                    <p className="text-xs text-amber-800">
                      Personalize e emita diplomas de conquista com brasão escolar, assinatura da professora, temas coloridos e download em PDF ou impressão em papel A4.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleTabChange('turmas')}
                    className="px-3.5 py-2 text-xs font-bold rounded-lg bg-white border border-amber-300 text-amber-900 hover:bg-amber-100 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Users className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Ver Turma</span>
                  </button>
                </div>
              </div>

              <CertificadoConquista
                userStats={userStats}
                onNavigate={onNavigate}
                onOpenIdentityModal={onOpenIdentityModal}
              />
            </motion.div>
          )}

          {activeTab === 'relatorio' && (
            <motion.div
              key="tab-relatorio"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-emerald-950">
                      Diagnóstico Pedagógico Individual por Habilidade
                    </h2>
                    <p className="text-xs text-emerald-800">
                      Avaliação detalhada dos pontos fortes, habilidades consolidadas e intervenções recomendadas para o estudante selecionado.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleTabChange('certificado')}
                    className="px-3.5 py-2 text-xs font-bold rounded-lg bg-white border border-emerald-300 text-emerald-900 hover:bg-emerald-100 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Award className="w-3.5 h-3.5 text-amber-600" />
                    <span>Emitir Certificado deste Aluno</span>
                  </button>
                </div>
              </div>

              <RelatorioEducador
                skillStats={userStats.skillStats}
                score={userStats.score}
                starsCount={userStats.starsEarned}
                badgesEarned={userStats.badgesEarned}
                studentName={userStats.studentName || ''}
                onUpdateStudentName={onUpdateStudentName}
                onResetProgress={onResetProgress}
                onNavigate={onNavigate}
              />
            </motion.div>
          )}

          {activeTab === 'ranking' && (
            <motion.div
              key="tab-ranking"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <RankingGlobal
                currentStudentName={userStats.studentName || ''}
                userScore={userStats.score}
                userStars={userStats.starsEarned}
                userClassroomId={currentClassroomId}
                userClassroomName={userStats.classroomName || '4º Ano A'}
                onSelectMission={onNavigate}
                onOpenIdentityModal={onOpenIdentityModal}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};
