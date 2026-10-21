/**
 * Types and interfaces for the BNCC 4th Grade Portuguese Game
 * Aventura das Palavras - Alinhamento Pedagógico BNCC
 */

export type BNCCSkill = 'EF15LP03' | 'EF35LP03' | 'EF35LP04' | 'EF05LP03';

export type GameMode = 'aprender' | 'desafio';

export type DiagnosticClassification =
  | 'not_evaluated'       // Ainda não avaliada (0 questões respondidas)
  | 'evaluating'           // Em avaliação (1 a N-1 questões respondidas, abaixo do mínimo)
  | 'needs_reinforcement'  // Precisa de reforço (< 60%)
  | 'developing'           // Em desenvolvimento (60% a 79%)
  | 'mastered';            // Objetivo atingido (>= 80%)

export interface PedagogicalCriteria {
  minQuestionsRequired: number; // Padrão: 3 questões distintas
  thresholdReinforcement: number; // < 60%
  thresholdDeveloping: number; // 60% a 79%
  thresholdMastered: number; // >= 80%
}

export interface BNCCSkillInfo {
  code: BNCCSkill;
  title: string;
  shortDesc: string;
  badgeName: string;
  colorScheme: {
    bg: string;
    border: string;
    text: string;
    accent: string;
  };
}

export interface TextParagraph {
  id: number;
  text: string;
  highlightClue?: string;
}

export interface ReadingText {
  id: string;
  title: string;
  genre: 'Fábula' | 'Curiosidade Científica' | 'Crônica' | 'Notícia Escolar' | 'Diário de Bordo';
  paragraphs: TextParagraph[];
  authorOrSource: string;
  themeIcon: string;
}

export interface QuestionOption {
  id: string; // Identificador estável (ex: 'opt-cervos'), imutável
  text: string;
  isCorrect: boolean;
  explanation: string;
  displayLetter?: string; // Atribuído apenas na renderização visual ('A', 'B', 'C', 'D')
}

export interface ProgressiveHint {
  level1Guidance: string; // Nível 1: Orientar o que procurar (conceitual/estratégia)
  level2Paragraph?: number; // Nível 2: Indicar o parágrafo relevante
  level3Excerpt?: string; // Nível 3: Destacar o trecho exato no texto
}

export interface ExplicitQuestion {
  id: string;
  textId: string;
  question: string;
  paragraphRef: number;
  options: QuestionOption[];
  clueWord: string;
  progressiveHint?: ProgressiveHint;
}

export interface CentralIdeaQuestion {
  id: string;
  textId: string;
  question: string;
  bestHeadlineQuestion: string;
  options: QuestionOption[];
  learningTip: string;
  progressiveHint?: ProgressiveHint;
}

export interface ImplicitQuestion {
  id: string;
  textId: string;
  question: string;
  excerptToAnalyze: string;
  options: QuestionOption[];
  implicitClue: string;
  pedagogicalReasoning: string;
  progressiveHint?: ProgressiveHint;
}

export type SyllableClassification = 'oxitona' | 'paroxitona' | 'proparoxitona';

export interface SyllableExercise {
  id: string;
  word: string; // e.g. "café"
  syllables: string[]; // ["ca", "fé"]
  tonicIndex: number; // 1 (0-indexed)
  classification: SyllableClassification;
  needsAccent: boolean;
  accentRuleExplanation: string;
  wordWithoutAccent?: string; // e.g. "cafe"
}

export interface ActivityLogItem {
  id: string;
  missionId: string;
  missionTitle: string;
  skillCode?: string;
  icon: string;
  scoreEarned: number;
  starsEarned: number;
  completedAt: string;
  formattedDate?: string;
  questionsAnswered?: number;
  isDemo?: boolean; // Identificação explícita de itens de demonstração
}

export interface QuestionAnswerRecord {
  questionId: string;
  skill: BNCCSkill;
  firstTryCorrect: boolean; // Acertou na 1ª tentativa sem dica
  answeredWithHint: boolean; // Acertou utilizando dica
  hintsUsed: number;
  hintLevelsUsed: number[]; // Níveis 1, 2 e/ou 3
  attemptsCount: number; // Quantidade de tentativas
  finalCorrect: boolean;
  answeredAt: string;
  gameMode: GameMode;
}

export interface DetailedSkillStat {
  distinctQuestionsAttempted: number;
  distinctQuestionsCorrect: number;
  firstTryWithoutHintCorrect: number;
  withHintCorrect: number;
  afterRetryCorrect: number;
  totalHintsUsed: number;
  totalAttempts: number;
}

export interface InProgressSession {
  missionId: string;
  missionTitle: string;
  questionIndex: number;
  totalQuestions: number;
  timestamp: string;
}

export interface UserAccessibilitySettings {
  fontSize: 'normal' | 'grande' | 'muito_grande';
  reduceMotion: boolean;
  isMuted: boolean;
}

export interface UserStats {
  score: number;
  starsEarned: number;
  completedQuestions: Record<string, boolean>; // key: questionId, val: correct
  skillStats: Record<BNCCSkill, {
    attempted: number;
    correct: number;
  }>;
  detailedSkillStats?: Record<BNCCSkill, DetailedSkillStat>;
  questionAnswers?: Record<string, QuestionAnswerRecord>;
  badgesEarned: string[];
  recentBadges?: string[];
  activityHistory?: ActivityLogItem[];
  lastPlayedDate?: string;
  studentName?: string;
  classroomId?: string;
  classroomName?: string;
  hasSeenTutorial?: boolean;
  isGuest?: boolean;
  gameMode?: GameMode;
  inProgressSession?: InProgressSession | null;
  accessibility?: UserAccessibilitySettings;
  participationPoints?: number; // Pontos de engajamento
  learningPoints?: number; // Pontos de aprendizagem
}
