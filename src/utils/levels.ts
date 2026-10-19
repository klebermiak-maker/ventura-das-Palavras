/**
 * Level progression system based on cumulative points
 */

export interface PlayerLevel {
  level: number;
  title: string;
  minPoints: number;
  maxPoints: number; // for the current level bracket
  icon: string;
  perkDescription: string;
  color: string;
}

export const LEVEL_TIERS: PlayerLevel[] = [
  {
    level: 1,
    title: 'Iniciante das Letras',
    minPoints: 0,
    maxPoints: 200,
    icon: '🌱',
    perkDescription: 'Primeiros passos na expedição do conhecimento!',
    color: 'emerald',
  },
  {
    level: 2,
    title: 'Aprendiz Curioso',
    minPoints: 200,
    maxPoints: 500,
    icon: '🧭',
    perkDescription: 'Olhar atento para detalhes e regras do português.',
    color: 'sky',
  },
  {
    level: 3,
    title: 'Explorador do Saber',
    minPoints: 500,
    maxPoints: 900,
    icon: '🗺️',
    perkDescription: 'Domínio crescente das pistas e dos textos.',
    color: 'amber',
  },
  {
    level: 4,
    title: 'Detetive da Leitura',
    minPoints: 900,
    maxPoints: 1400,
    icon: '🔍',
    perkDescription: 'Capacidade de decifrar entrelinhas com facilidade.',
    color: 'indigo',
  },
  {
    level: 5,
    title: 'Mago dos Acentos',
    minPoints: 1400,
    maxPoints: 2000,
    icon: '⚡',
    perkDescription: 'Soberano das oxítonas, paroxítonas e proparoxítonas!',
    color: 'purple',
  },
  {
    level: 6,
    title: 'Mestre Supremo das Palavras',
    minPoints: 2000,
    maxPoints: 3000,
    icon: '🏆',
    perkDescription: 'Nível lendário! Campeão da Língua Portuguesa no 4º Ano.',
    color: 'amber',
  },
];

export function getPlayerLevelInfo(score: number) {
  let currentTier = LEVEL_TIERS[0];
  let nextTier: PlayerLevel | null = LEVEL_TIERS[1];

  for (let i = 0; i < LEVEL_TIERS.length; i++) {
    if (score >= LEVEL_TIERS[i].minPoints) {
      currentTier = LEVEL_TIERS[i];
      nextTier = i < LEVEL_TIERS.length - 1 ? LEVEL_TIERS[i + 1] : null;
    }
  }

  // Calculate bracket progress
  let pointsInCurrentLevel = 0;
  let pointsNeededForNext = 0;
  let progressPercentage = 100;

  if (nextTier) {
    const bracketRange = nextTier.minPoints - currentTier.minPoints;
    pointsInCurrentLevel = Math.max(0, score - currentTier.minPoints);
    pointsNeededForNext = nextTier.minPoints - score;
    progressPercentage = Math.min(100, Math.max(0, Math.round((pointsInCurrentLevel / bracketRange) * 100)));
  } else {
    // Max level achieved
    pointsInCurrentLevel = score - currentTier.minPoints;
    pointsNeededForNext = 0;
    progressPercentage = 100;
  }

  return {
    currentTier,
    nextTier,
    pointsInCurrentLevel,
    pointsNeededForNext,
    progressPercentage,
    isMaxLevel: !nextTier,
  };
}
