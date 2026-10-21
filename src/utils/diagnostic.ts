/**
 * Pedagogical Diagnostic Engine for BNCC 4th Grade Portuguese
 * Implements unified, transparent criteria across charts, reports, cards, and certificates.
 */

import { BNCCSkill, DiagnosticClassification, PedagogicalCriteria } from '../types/game';

export const DEFAULT_PEDAGOGICAL_CRITERIA: PedagogicalCriteria = {
  minQuestionsRequired: 3, // Quantidade mínima de questões distintas para classificar
  thresholdReinforcement: 60, // < 60%
  thresholdDeveloping: 80, // 60% a 79%
  thresholdMastered: 80, // >= 80%
};

export interface SkillDiagnosticResult {
  code: BNCCSkill;
  title: string;
  attempted: number;
  correct: number;
  percentage: number | null; // null quando não avaliada
  percentageLabel: string;
  status: DiagnosticClassification;
  label: string;
  badgeClass: string;
  borderClass: string;
  textColor: string;
  advice: string;
  icon: string;
  hasData: boolean;
  questionsCountText: string;
}

export function calculateSkillDiagnostic(
  code: BNCCSkill,
  title: string,
  stat: { attempted: number; correct: number } | undefined,
  criteria: PedagogicalCriteria = DEFAULT_PEDAGOGICAL_CRITERIA
): SkillDiagnosticResult {
  const attempted = stat?.attempted ?? 0;
  const correct = stat?.correct ?? 0;

  // 1. Caso sem nenhuma resposta: AINDA NÃO AVALIADA (não é 0%)
  if (attempted === 0) {
    return {
      code,
      title,
      attempted: 0,
      correct: 0,
      percentage: null,
      percentageLabel: 'Sem dados',
      status: 'not_evaluated',
      label: 'Ainda não avaliada',
      badgeClass: 'bg-slate-100 text-slate-600 border border-slate-200',
      borderClass: 'border-slate-200',
      textColor: 'text-slate-500',
      advice: 'O aluno ainda não respondeu a questões desta missão. Inicie a atividade para registrar os primeiros dados.',
      icon: '⏳',
      hasData: false,
      questionsCountText: '0 questões respondidas',
    };
  }

  const accuracy = Math.round((correct / attempted) * 100);

  // 2. Caso com respostas abaixo do mínimo configurável: EM AVALIAÇÃO
  if (attempted < criteria.minQuestionsRequired) {
    return {
      code,
      title,
      attempted,
      correct,
      percentage: accuracy,
      percentageLabel: `${accuracy}% (Amostra inicial)`,
      status: 'evaluating',
      label: 'Em avaliação',
      badgeClass: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
      borderClass: 'border-indigo-200',
      textColor: 'text-indigo-700',
      advice: `Amostra em andamento (${attempted} de ${criteria.minQuestionsRequired} questões mínimas). Mais ${criteria.minQuestionsRequired - attempted} questão(ões) necessária(s) para diagnóstico consolidado.`,
      icon: '🔄',
      hasData: true,
      questionsCountText: `${attempted} de ${criteria.minQuestionsRequired} mínimas (${correct} acertos)`,
    };
  }

  // 3. Critérios consolidados com quantidade mínima atendida
  if (accuracy >= criteria.thresholdMastered) {
    return {
      code,
      title,
      attempted,
      correct,
      percentage: accuracy,
      percentageLabel: `${accuracy}%`,
      status: 'mastered',
      label: 'Objetivo atingido',
      badgeClass: 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold',
      borderClass: 'border-emerald-300',
      textColor: 'text-emerald-700',
      advice: 'Excelente domínio da habilidade! O estudante demonstra segurança pedagógica consistente na resolução das questões.',
      icon: '🌟',
      hasData: true,
      questionsCountText: `${correct} acertos em ${attempted} questões (${accuracy}%)`,
    };
  }

  if (accuracy >= criteria.thresholdReinforcement) {
    return {
      code,
      title,
      attempted,
      correct,
      percentage: accuracy,
      percentageLabel: `${accuracy}%`,
      status: 'developing',
      label: 'Em desenvolvimento',
      badgeClass: 'bg-amber-50 text-amber-900 border border-amber-300 font-semibold',
      borderClass: 'border-amber-300',
      textColor: 'text-amber-800',
      advice: 'Boa compreensão global com oscilações em itens mais complexos. Recomendado treino adicional com apoio progressivo de pistas.',
      icon: '📈',
      hasData: true,
      questionsCountText: `${correct} acertos em ${attempted} questões (${accuracy}%)`,
    };
  }

  return {
    code,
    title,
    attempted,
    correct,
    percentage: accuracy,
    percentageLabel: `${accuracy}%`,
    status: 'needs_reinforcement',
    label: 'Precisa de reforço',
    badgeClass: 'bg-rose-50 text-rose-800 border border-rose-300 font-bold',
    borderClass: 'border-rose-300',
    textColor: 'text-rose-700',
    advice: 'Intervenção recomendada: retornar ao texto para leitura guiada, analisar alternativas plausíveis e consultar a dica conceitual.',
    icon: '🎯',
    hasData: true,
    questionsCountText: `${correct} acertos em ${attempted} questões (${accuracy}%)`,
  };
}

export interface StudentOverallDiagnostic {
  evaluatedCount: number;
  totalSkillsCount: number;
  averageMastery: number | null;
  masteredCount: number;
  developingCount: number;
  reinforcementCount: number;
  notEvaluatedCount: number;
  evaluatingCount: number;
  generalStatus: string;
  generalAdvice: string;
}

export function calculateOverallDiagnostic(
  diagnostics: SkillDiagnosticResult[]
): StudentOverallDiagnostic {
  const evaluated = diagnostics.filter(d => d.status !== 'not_evaluated' && d.percentage !== null);
  const totalAttempted = diagnostics.reduce((acc, curr) => acc + curr.attempted, 0);
  const totalCorrect = diagnostics.reduce((acc, curr) => acc + curr.correct, 0);

  const averageMastery = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : null;

  const masteredCount = diagnostics.filter(d => d.status === 'mastered').length;
  const developingCount = diagnostics.filter(d => d.status === 'developing').length;
  const reinforcementCount = diagnostics.filter(d => d.status === 'needs_reinforcement').length;
  const evaluatingCount = diagnostics.filter(d => d.status === 'evaluating').length;
  const notEvaluatedCount = diagnostics.filter(d => d.status === 'not_evaluated').length;

  let generalStatus = 'Ainda não avaliado';
  let generalAdvice = 'Inicie uma das missões para construir seu diagnóstico de leitura.';

  if (evaluated.length === 0) {
    generalStatus = 'Ainda não avaliado';
    generalAdvice = 'Sua jornada está começando! Conclua ao menos uma missão para gerar seu primeiro relatório pedagógico.';
  } else if (evaluatingCount > 0 && masteredCount === 0 && reinforcementCount === 0 && developingCount === 0) {
    generalStatus = 'Em avaliação inicial';
    generalAdvice = 'Responda a mais algumas questões para consolidar seu perfil de leitura.';
  } else if (averageMastery !== null && averageMastery >= 80) {
    generalStatus = 'Objetivo geral atingido';
    generalAdvice = 'Parabéns! O estudante demonstra proficiência sólida nos descritores avaliados da BNCC.';
  } else if (averageMastery !== null && averageMastery >= 60) {
    generalStatus = 'Em desenvolvimento com bom potencial';
    generalAdvice = 'Evolução consistente. Focar nas habilidades identificadas para reforço.';
  } else {
    generalStatus = 'Requer acompanhamento e reforço';
    generalAdvice = 'Recomenda-se realizar as missões no Modo Aprender com apoio pedagógico das dicas.';
  }

  return {
    evaluatedCount: evaluated.length,
    totalSkillsCount: diagnostics.length,
    averageMastery,
    masteredCount,
    developingCount,
    reinforcementCount,
    notEvaluatedCount,
    evaluatingCount,
    generalStatus,
    generalAdvice,
  };
}
