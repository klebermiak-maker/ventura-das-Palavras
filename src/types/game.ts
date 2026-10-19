/**
 * Types and interfaces for the BNCC 4th Grade Portuguese Game
 */

export type BNCCSkill = 'EF15LP03' | 'EF35LP03' | 'EF35LP04' | 'EF05LP03';

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
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface ExplicitQuestion {
  id: string;
  textId: string;
  question: string;
  paragraphRef: number;
  options: QuestionOption[];
  clueWord: string;
}

export interface CentralIdeaQuestion {
  id: string;
  textId: string;
  question: string;
  bestHeadlineQuestion: string;
  options: QuestionOption[];
  learningTip: string;
}

export interface ImplicitQuestion {
  id: string;
  textId: string;
  question: string;
  excerptToAnalyze: string;
  options: QuestionOption[];
  implicitClue: string;
  pedagogicalReasoning: string;
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

export interface UserStats {
  score: number;
  starsEarned: number;
  completedQuestions: Record<string, boolean>; // key: questionId, val: correct
  skillStats: Record<BNCCSkill, {
    attempted: number;
    correct: number;
  }>;
  badgesEarned: string[];
  recentBadges?: string[];
  lastPlayedDate?: string;
  studentName?: string;
  classroomId?: string;
  classroomName?: string;
}
