import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion, type Variants } from 'framer-motion';
import { Header } from './components/Header';
import { MissionHub } from './components/MissionHub';
import { ExplicitasGame } from './components/ExplicitasGame';
import { IdeiaCentralGame } from './components/IdeiaCentralGame';
import { ImplicitasGame } from './components/ImplicitasGame';
import { AcentuacaoGame } from './components/AcentuacaoGame';
import { SprintGame } from './components/SprintGame';
import { RelatorioEducador } from './components/RelatorioEducador';
import { RelatorioTurmas } from './components/RelatorioTurmas';
import { DicionarioVisual } from './components/DicionarioVisual';
import { CertificadoConquista } from './components/CertificadoConquista';
import { StudentIdentificationModal } from './components/StudentIdentificationModal';
import { RegrasAcentuacaoModal } from './components/RegrasAcentuacaoModal';
import { CelebrationOverlay, CelebrationData } from './components/CelebrationOverlay';
import { BNCCSkill, UserStats } from './types/game';
import { soundManager } from './utils/audio';
import { getPlayerLevelInfo } from './utils/levels';
import {
  testFirestoreConnection,
  syncStudentPerformanceToFirebase,
} from './services/firebase';

const STORAGE_KEY = 'aventura_palavras_bncc_v1';

const defaultStats: UserStats = {
  score: 0,
  starsEarned: 0,
  completedQuestions: {},
  skillStats: {
    EF15LP03: { attempted: 0, correct: 0 },
    EF35LP03: { attempted: 0, correct: 0 },
    EF35LP04: { attempted: 0, correct: 0 },
    EF05LP03: { attempted: 0, correct: 0 },
  },
  badgesEarned: [],
  studentName: '',
  classroomId: 'turma-3a',
  classroomName: '3º Ano A',
};

const viewTransitionVariants: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.16, ease: [0.16, 1, 0.3, 1] } },
};

export default function App() {
  const [currentView, setCurrentView] = useState<string>('hub');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState<boolean>(false);
  const [isIdentityModalOpen, setIsIdentityModalOpen] = useState<boolean>(false);
  const [pendingMission, setPendingMission] = useState<string | null>(null);
  const [celebrationData, setCelebrationData] = useState<CelebrationData | null>(null);

  const [stats, setStats] = useState<UserStats>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...defaultStats, ...JSON.parse(saved) };
      }
    } catch {
      // Fallback
    }
    return defaultStats;
  });

  // Verify Firestore connection on boot
  useEffect(() => {
    testFirestoreConnection().catch(err => {
      console.warn('Firestore initial connection check:', err);
    });
  }, []);

  // Prompt student identification on initial app boot if student has not identified themselves yet
  useEffect(() => {
    if (!stats.studentName || stats.studentName.trim() === '') {
      setIsIdentityModalOpen(true);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    } catch {
      // Storage unavailable or quota
    }
  }, [stats]);

  // Helper to sync to Firestore whenever user is identified and achieves progress
  const syncToFirebaseIfIdentified = (updatedStats: UserStats) => {
    if (!updatedStats.studentName) return;
    const tier = getPlayerLevelInfo(updatedStats.score).currentTier;
    syncStudentPerformanceToFirebase(
      updatedStats.classroomId || 'turma-4a',
      updatedStats.studentName,
      updatedStats.studentName,
      updatedStats.score,
      updatedStats.starsEarned,
      tier.level,
      tier.title,
      updatedStats.badgesEarned.length,
      updatedStats.skillStats
    ).catch(err => console.error('Auto sync to Firebase failed:', err));
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundManager.setMuted(nextMuted);
    if (!nextMuted) {
      soundManager.playClick();
    }
  };

  const handleEarnScore = (points: number, stars: number, skill: BNCCSkill, questionId: string) => {
    const isCorrect = stars > 0;
    const oldScore = stats.score;
    const newScore = stats.score + points;
    const oldTier = getPlayerLevelInfo(oldScore).currentTier;
    const newTier = getPlayerLevelInfo(newScore).currentTier;

    if (newTier.level > oldTier.level) {
      setCelebrationData({
        isOpen: true,
        type: 'level_up',
        title: `Nível ${newTier.level}: ${newTier.title}!`,
        subtitle: newTier.perkDescription,
        points,
        stars,
        levelTitle: newTier.title,
        levelIcon: newTier.icon,
      });
    } else if (isCorrect) {
      setCelebrationData({
        isOpen: true,
        type: 'correct',
        title: 'Resposta Exata!',
        subtitle: 'Você demonstrou excelente raciocínio leitor!',
        points,
        stars,
      });
    }

    setStats(prev => {
      const currentSkillStat = prev.skillStats[skill] || { attempted: 0, correct: 0 };

      const updatedSkillStats = {
        ...prev.skillStats,
        [skill]: {
          attempted: currentSkillStat.attempted + 1,
          correct: currentSkillStat.correct + (isCorrect ? 1 : 0),
        },
      };

      const updatedBadges = [...prev.badgesEarned];
      if (isCorrect && !updatedBadges.includes(skill)) {
        updatedBadges.push(skill);
      }
      if (prev.starsEarned + stars >= 5 && !updatedBadges.includes('MESTRE')) {
        updatedBadges.push('MESTRE');
      }

      const updatedStats = {
        ...prev,
        score: prev.score + points,
        starsEarned: prev.starsEarned + stars,
        completedQuestions: {
          ...prev.completedQuestions,
          [questionId]: isCorrect,
        },
        skillStats: updatedSkillStats,
        badgesEarned: updatedBadges,
      };

      syncToFirebaseIfIdentified(updatedStats);
      return updatedStats;
    });
  };

  const handleBonusPoints = (pts: number) => {
    const oldScore = stats.score;
    const newScore = stats.score + pts;
    const oldTier = getPlayerLevelInfo(oldScore).currentTier;
    const newTier = getPlayerLevelInfo(newScore).currentTier;

    setStats(prev => {
      const updated = { ...prev, score: prev.score + pts };
      syncToFirebaseIfIdentified(updated);
      return updated;
    });

    if (newTier.level > oldTier.level) {
      setCelebrationData({
        isOpen: true,
        type: 'level_up',
        title: `Nível ${newTier.level}: ${newTier.title}!`,
        subtitle: newTier.perkDescription,
        points: pts,
        levelTitle: newTier.title,
        levelIcon: newTier.icon,
      });
    }
  };

  const handleResetProgress = () => {
    setStats(defaultStats);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  };

  const missionDisplayNames: Record<string, string> = {
    explicitas: 'Detetive dos Fatos (Informações Explícitas)',
    central: 'A Bússola do Tema (Ideia Central)',
    implicitas: 'Mago das Entrelinhas (Inferências)',
    acentuacao: 'Usina dos Acentos (Acentuação Gráfica)',
    sprint: 'Sprint Relâmpago das Palavras',
  };

  const handleSelectMission = (view: string) => {
    const isGameMission = ['explicitas', 'central', 'implicitas', 'acentuacao', 'sprint'].includes(view);
    if (isGameMission && (!stats.studentName || stats.studentName.trim() === '')) {
      setPendingMission(view);
      setIsIdentityModalOpen(true);
      return;
    }
    setCurrentView(view);
  };

  const handleUpdateStudentName = (name: string) => {
    setStats(prev => {
      const updated = { ...prev, studentName: name };
      syncToFirebaseIfIdentified(updated);
      return updated;
    });
  };

  const handleSaveIdentity = (name: string, classroomId: string, classroomName: string) => {
    const updated: UserStats = {
      ...stats,
      studentName: name,
      classroomId,
      classroomName,
    };
    setStats(updated);
    syncToFirebaseIfIdentified(updated);
    setIsIdentityModalOpen(false);
    if (pendingMission) {
      setCurrentView(pendingMission);
      setPendingMission(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Bar Header */}
      <Header
        currentView={currentView}
        onNavigate={handleSelectMission}
        starsCount={stats.starsEarned}
        score={stats.score}
        studentName={stats.studentName}
        classroomName={stats.classroomName}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onOpenRules={() => setIsRulesModalOpen(true)}
        onOpenIdentityModal={() => setIsIdentityModalOpen(true)}
        onResetProgress={handleResetProgress}
      />

      {/* Main Content Area with Animated Transitions */}
      <main className="flex-1 overflow-x-hidden">
        <AnimatePresence mode="wait">
          {currentView === 'hub' && (
            <motion.div
              key="hub"
              variants={viewTransitionVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <MissionHub
                onSelectMission={handleSelectMission}
                starsCount={stats.starsEarned}
                score={stats.score}
                skillStats={stats.skillStats}
                badgesEarned={stats.badgesEarned}
                studentName={stats.studentName}
                classroomName={stats.classroomName}
                onOpenRules={() => setIsRulesModalOpen(true)}
                onOpenIdentityModal={() => setIsIdentityModalOpen(true)}
                onBonusPoints={handleBonusPoints}
              />
            </motion.div>
          )}

          {currentView === 'explicitas' && (
            <motion.div
              key="explicitas"
              variants={viewTransitionVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <ExplicitasGame
                onEarnScore={handleEarnScore}
                onNavigate={setCurrentView}
                completedQuestions={stats.completedQuestions}
              />
            </motion.div>
          )}

          {currentView === 'central' && (
            <motion.div
              key="central"
              variants={viewTransitionVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <IdeiaCentralGame
                onEarnScore={handleEarnScore}
                onNavigate={setCurrentView}
                completedQuestions={stats.completedQuestions}
              />
            </motion.div>
          )}

          {currentView === 'implicitas' && (
            <motion.div
              key="implicitas"
              variants={viewTransitionVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <ImplicitasGame
                onEarnScore={handleEarnScore}
                onNavigate={setCurrentView}
                completedQuestions={stats.completedQuestions}
              />
            </motion.div>
          )}

          {currentView === 'acentuacao' && (
            <motion.div
              key="acentuacao"
              variants={viewTransitionVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <AcentuacaoGame
                onEarnScore={handleEarnScore}
                onNavigate={setCurrentView}
                onOpenRules={() => setIsRulesModalOpen(true)}
                completedQuestions={stats.completedQuestions}
              />
            </motion.div>
          )}

          {currentView === 'sprint' && (
            <motion.div
              key="sprint"
              variants={viewTransitionVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <SprintGame
                onEarnScore={handleEarnScore}
                onNavigate={setCurrentView}
                onOpenRules={() => setIsRulesModalOpen(true)}
              />
            </motion.div>
          )}

          {currentView === 'relatorio' && (
            <motion.div
              key="relatorio"
              variants={viewTransitionVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <RelatorioEducador
                skillStats={stats.skillStats}
                score={stats.score}
                starsCount={stats.starsEarned}
                badgesEarned={stats.badgesEarned}
                studentName={stats.studentName || ''}
                onUpdateStudentName={handleUpdateStudentName}
                onResetProgress={handleResetProgress}
                onNavigate={setCurrentView}
              />
            </motion.div>
          )}

          {currentView === 'turmas' && (
            <motion.div
              key="turmas"
              variants={viewTransitionVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <RelatorioTurmas
                userStats={stats}
                currentClassroomId={stats.classroomId || 'turma-4a'}
                onNavigate={setCurrentView}
                onOpenIdentityModal={() => setIsIdentityModalOpen(true)}
              />
            </motion.div>
          )}

          {currentView === 'dicionario' && (
            <motion.div
              key="dicionario"
              variants={viewTransitionVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <DicionarioVisual
                onNavigate={setCurrentView}
                onBonusPoints={handleBonusPoints}
                studentName={stats.studentName}
              />
            </motion.div>
          )}

          {currentView === 'certificado' && (
            <motion.div
              key="certificado"
              variants={viewTransitionVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <CertificadoConquista
                userStats={stats}
                onNavigate={setCurrentView}
                onOpenIdentityModal={() => setIsIdentityModalOpen(true)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Interactive Quick Reference Booklet Modal with Exit/Enter animations */}
      <AnimatePresence>
        {isRulesModalOpen && (
          <RegrasAcentuacaoModal
            isOpen={isRulesModalOpen}
            onClose={() => setIsRulesModalOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Student Identification & Classroom Connection Modal */}
      <AnimatePresence>
        {isIdentityModalOpen && (
          <StudentIdentificationModal
            isOpen={isIdentityModalOpen}
            onClose={() => {
              setIsIdentityModalOpen(false);
              setPendingMission(null);
            }}
            currentStudentName={stats.studentName || ''}
            currentClassroomId={stats.classroomId || 'turma-4a'}
            onSaveIdentity={handleSaveIdentity}
            pendingMissionName={pendingMission ? missionDisplayNames[pendingMission] || pendingMission : null}
            onContinueAsGuest={() => {
              setIsIdentityModalOpen(false);
              if (pendingMission) {
                setCurrentView(pendingMission);
                setPendingMission(null);
              }
            }}
          />
        )}
      </AnimatePresence>

      {/* Celebratory Confetti & Congratulations Overlay */}
      <AnimatePresence>
        {celebrationData && celebrationData.isOpen && (
          <CelebrationOverlay
            data={celebrationData}
            onClose={() => setCelebrationData(null)}
          />
        )}
      </AnimatePresence>

      {/* Clean Footnote */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Aventura das Palavras</span>
            <span aria-hidden="true">·</span>
            <span>4º Ano do Ensino Fundamental</span>
          </div>

          <div className="flex items-center gap-3 text-slate-400">
            <span>EF15LP03</span>
            <span aria-hidden="true">·</span>
            <span>EF35LP03</span>
            <span aria-hidden="true">·</span>
            <span>EF35LP04</span>
            <span aria-hidden="true">·</span>
            <span>EF05LP03</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
