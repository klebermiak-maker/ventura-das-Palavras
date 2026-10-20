/**
 * Question Shuffling & Non-Repeating Pool Manager
 * Implements Fisher-Yates randomization for questions and multiple-choice options,
 * ensuring no deterministic order and fresh challenges on every run.
 */

/**
 * Pure Fisher-Yates shuffle that returns a new array with items in randomized order.
 */
export function shuffleArray<T>(items: readonly T[] | T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }
  return result;
}

export interface GenericOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation?: string;
}

export interface GenericQuestion {
  id: string;
  options: GenericOption[];
  [key: string]: any;
}

/**
 * Shuffles the options of a question and assigns fresh standard letters ('a', 'b', 'c', 'd')
 * while maintaining isCorrect and explanation intact.
 */
export function shuffleOptions<T extends { id: string; text: string; isCorrect: boolean; explanation?: string }>(
  options: T[]
): T[] {
  const letters = ['a', 'b', 'c', 'd', 'e'];
  const shuffled = shuffleArray(options);
  return shuffled.map((opt, idx) => ({
    ...opt,
    displayLetter: letters[idx] || `${idx + 1}`,
  }));
}

/**
 * Shuffles both the list of questions and the options inside each question.
 */
export function shuffleQuestionsAndOptions<T extends GenericQuestion>(questions: T[]): T[] {
  const shuffledQuestions = shuffleArray(questions);
  return shuffledQuestions.map(q => ({
    ...q,
    options: shuffleOptions(q.options),
  }));
}

/**
 * Filters and prioritizes questions:
 * 1. Questions not yet completed/answered correctly in previous runs
 * 2. If all completed, returns the full set freshly shuffled
 */
export function prioritizeUncompletedQuestions<T extends { id: string }>(
  allQuestions: T[],
  completedQuestions: Record<string, boolean> = {}
): T[] {
  const uncompleted = allQuestions.filter(q => !completedQuestions[q.id]);
  if (uncompleted.length > 0) {
    return shuffleArray(uncompleted);
  }
  return shuffleArray(allQuestions);
}
