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
import { EspacoDoProfessor } from './components/EspacoDoProfessor';
import { StudentIdentificationModal } from './components/StudentIdentificationModal';
import { RegrasAcentuacaoModal } from './components/RegrasAcentuacaoModal';
import { MentorTutorialModal } from './components/MentorTutorialModal';
import { DicasDeLeitura } from './components/DicasDeLeitura';
import { CelebrationOverlay, CelebrationData } from './components/CelebrationOverlay';
import { BNCCSkill, UserStats, ActivityLogItem } from './types/game';
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
  recentBadges: [],
  activityHistory: [],
  studentName: '',
  classroomId: 'turma-4a',
  classroomName: '4º Ano A',
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
  const [isTutorialOpen, setIsTutorialOpen] = useState<boolean>(false);
  const [isReadingTipsModalOpen, setIsReadingTipsModalOpen] = useState<boolean>(false);

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
    } else {
      const hasSeen = localStorage.getItem('has_seen_mentor_tutorial');
      if (hasSeen !== 'true') {
        setIsTutorialOpen(true);
      }
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

    const badgeMap: Record<string, { name: string; icon: string }> = {
      EF15LP03: { name: 'Detetive de Fatos', icon: '🔍' },
      EF35LP03: { name: 'Mestre da Ideia Central', icon: '🧭' },
      EF35LP04: { name: 'Mago das Entrelinhas', icon: '🕵️' },
      EF05LP03: { name: 'Campeão da Acentuação', icon: '⚡' },
      MESTRE: { name: 'Mestre da Língua Portuguesa', icon: '🏆' },
      SPRINT_MASTER: { name: 'Velocista das Palavras', icon: '🔥' },
    };

    let newlyUnlockedBadgeInfo: { name: string; icon: string } | null = null;

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
      const newlyEarnedIds: string[] = [];

      if (isCorrect && !updatedBadges.includes(skill)) {
        updatedBadges.push(skill);
        newlyEarnedIds.push(skill);
      }
      if (prev.starsEarned + stars >= 5 && !updatedBadges.includes('MESTRE')) {
        updatedBadges.push('MESTRE');
        newlyEarnedIds.push('MESTRE');
      }

      if (newlyEarnedIds.length > 0) {
        const lastId = newlyEarnedIds[newlyEarnedIds.length - 1];
        newlyUnlockedBadgeInfo = badgeMap[lastId] || { name: 'Nova Medalha!', icon: '🏅' };
      }

      const updatedRecentBadges = Array.from(new Set([...(prev.recentBadges || []), ...newlyEarnedIds]));

      // Log mission to activity history for tracking daily progress
      const missionMap: Record<string, { missionId: string; title: string; icon: string }> = {
        EF15LP03: { missionId: 'explicitas', title: 'Detetive dos Fatos', icon: '🔍' },
        EF35LP03: { missionId: 'central', title: 'A Bússola do Tema', icon: '🧭' },
        EF35LP04: { missionId: 'implicitas', title: 'Mago das Entrelinhas', icon: '🕵️' },
        EF05LP03: { missionId: 'acentuacao', title: 'Usina dos Acentos', icon: '⚡' },
      };

      const meta = missionMap[skill] || { missionId: 'explicitas', title: 'Missão BNCC', icon: '🎯' };
      const now = new Date();
      const newActivity: ActivityLogItem = {
        id: `act-${now.getTime()}-${Math.random().toString(36).substring(2, 6)}`,
        missionId: meta.missionId,
        missionTitle: meta.title,
        skillCode: skill,
        icon: meta.icon,
        scoreEarned: points,
        starsEarned: stars,
        completedAt: now.toISOString(),
        formattedDate: `Hoje às ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`,
        questionsAnswered: 1,
      };

      const updatedActivityHistory = [newActivity, ...(prev.activityHistory || [])].slice(0, 15);

      const updatedStats: UserStats = {
        ...prev,
        score: prev.score + points,
        starsEarned: prev.starsEarned + stars,
        completedQuestions: {
          ...prev.completedQuestions,
          [questionId]: isCorrect,
        },
        skillStats: updatedSkillStats,
        badgesEarned: updatedBadges,
        recentBadges: updatedRecentBadges,
        activityHistory: updatedActivityHistory,
      };

      syncToFirebaseIfIdentified(updatedStats);
      return updatedStats;
    });

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
    } else if (newlyUnlockedBadgeInfo) {
      const info = newlyUnlockedBadgeInfo as { name: string; icon: string };
      setCelebrationData({
        isOpen: true,
        type: 'badge_unlock',
        title: info.name,
        subtitle: 'Você desbloqueou um novo emblema! Veja a animação de brilho no painel do jogador.',
        points,
        stars,
        badgeName: info.name,
        badgeIcon: info.icon,
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
  };

  const handleAcknowledgeBadge = (badgeId: string) => {
    setStats(prev => {
      const updated: UserStats = {
        ...prev,
        recentBadges: (prev.recentBadges || []).filter(id => id !== badgeId),
      };
      return updated;
    });
  };

  const handleSimulateBadgeUnlock = (badgeId: string) => {
    setStats(prev => {
      const updated: UserStats = {
        ...prev,
        badgesEarned: Array.from(new Set([...prev.badgesEarned, badgeId])),
        recentBadges: Array.from(new Set([...(prev.recentBadges || []), badgeId])),
      };
      syncToFirebaseIfIdentified(updated);
      return updated;
    });
  };

  const handleAddSampleActivity = () => {
    const samples = [
      { missionId: 'sprint', title: 'Sprint Relâmpago das Palavras', icon: '🔥', skill: 'EF05LP03', score: 140, stars: 1 },
      { missionId: 'explicitas', title: 'Detetive dos Fatos', icon: '🔍', skill: 'EF15LP03', score: 100, stars: 1 },
      { missionId: 'acentuacao', title: 'Usina dos Acentos', icon: '⚡', skill: 'EF05LP03', score: 120, stars: 1 },
      { missionId: 'central', title: 'A Bússola do Tema', icon: '🧭', skill: 'EF35LP03', score: 100, stars: 1 },
      { missionId: 'implicitas', title: 'Mago das Entrelinhas', icon: '🕵️', skill: 'EF35LP04', score: 100, stars: 1 },
    ];
    const pick = samples[Math.floor(Math.random() * samples.length)];
    const now = new Date();
    const newItem: ActivityLogItem = {
      id: `sample-${now.getTime()}`,
      missionId: pick.missionId,
      missionTitle: pick.title,
      skillCode: pick.skill,
      icon: pick.icon,
      scoreEarned: pick.score,
      starsEarned: pick.stars,
      completedAt: now.toISOString(),
      formattedDate: `Hoje às ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`,
      questionsAnswered: 3,
    };
    setStats(prev => {
      const updated: UserStats = {
        ...prev,
        score: prev.score + pick.score,
        starsEarned: prev.starsEarned + pick.stars,
        activityHistory: [newItem, ...(prev.activityHistory || [])].slice(0, 15),
      };
      syncToFirebaseIfIdentified(updated);
      return updated;
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

    // If student hasn't experienced the Mentor Tutorial yet, introduce them warmly!
    const hasSeenTutorial = localStorage.getItem('has_seen_mentor_tutorial') === 'true';
    if (!hasSeenTutorial) {
      setIsTutorialOpen(true);
    } else if (pendingMission) {
      setCurrentView(pendingMission);
      setPendingMission(null);
    }
  };

  const handleCompleteTutorial = () => {
    try {
      localStorage.setItem('has_seen_mentor_tutorial', 'true');
    } catch {
      // Storage unavailable
    }
    setIsTutorialOpen(false);
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
        onOpenTutorial={() => setIsTutorialOpen(true)}
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
                recentBadges={stats.recentBadges || []}
                studentName={stats.studentName}
                classroomName={stats.classroomName}
                classroomId={stats.classroomId || 'turma-4a'}
                onOpenRules={() => setIsRulesModalOpen(true)}
                onOpenIdentityModal={() => setIsIdentityModalOpen(true)}
                onOpenTutorial={() => setIsTutorialOpen(true)}
                onBonusPoints={handleBonusPoints}
                onAcknowledgeBadge={handleAcknowledgeBadge}
                onSimulateBadgeUnlock={handleSimulateBadgeUnlock}
                activityHistory={stats.activityHistory || []}
                onAddSampleActivity={handleAddSampleActivity}
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

          {['professor', 'turmas', 'relatorio', 'certificado', 'ranking'].includes(currentView) && (
            <motion.div
              key="espaco-professor"
              variants={viewTransitionVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <EspacoDoProfessor
                userStats={stats}
                currentClassroomId={stats.classroomId || 'turma-4a'}
                initialTab={
                  currentView === 'ranking'
                    ? 'ranking'
                    : currentView === 'relatorio'
                    ? 'relatorio'
                    : currentView === 'certificado'
                    ? 'certificado'
                    : 'turmas'
                }
                onNavigate={setCurrentView}
                onOpenIdentityModal={() => setIsIdentityModalOpen(true)}
                onUpdateStudentName={handleUpdateStudentName}
                onResetProgress={handleResetProgress}
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

      {/* Gamified Mentor Tutorial Modal with Professor Olivia */}
      <AnimatePresence>
        {isTutorialOpen && (
          <MentorTutorialModal
            isOpen={isTutorialOpen}
            onClose={() => setIsTutorialOpen(false)}
            onComplete={handleCompleteTutorial}
            studentName={stats.studentName}
          />
        )}
      </AnimatePresence>

      {/* Interactive Reading Strategy Modal Accessible from Footer */}
      <AnimatePresence>
        {isReadingTipsModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white shadow-2xl p-1"
            >
              <button
                onClick={() => setIsReadingTipsModalOpen(false)}
                className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm cursor-pointer transition-colors shadow-2xs"
                title="Fechar dicas de leitura"
              >
                ✕
              </button>
              <DicasDeLeitura
                onSelectMission={(m) => {
                  setIsReadingTipsModalOpen(false);
                  handleSelectMission(m);
                }}
                onBonusPoints={handleBonusPoints}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Clean Footnote with Interactive Reading Tips Access */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Aventura das Palavras</span>
            <span aria-hidden="true">·</span>
            <span>4º Ano do Ensino Fundamental</span>
          </div>

          {/* Direct trigger for Reading Tips from Footer */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundManager.playClick();
                setIsReadingTipsModalOpen(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
              title="Abrir painel de Dicas de Leitura e Interpretação (EF35LP03 e EF35LP04)"
            >
              <span>💡</span>
              <span>Dicas de Leitura (EF35LP03 / EF35LP04)</span>
            </button>
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
