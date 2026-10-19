export interface SprintQuestion {
  id: string;
  word: string;
  prompt: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
  explanation: string;
  category: 'classificacao' | 'regra' | 'tonica' | 'identificacao';
}

export const SPRINT_QUESTIONS_BANK: SprintQuestion[] = [
  {
    id: 'sp-1',
    word: 'LÂMPADA',
    prompt: 'A palavra LÂMPADA tem a antepenúltima sílaba mais forte. Ela é:',
    options: [
      { id: 'a', text: 'Proparoxítona', isCorrect: true },
      { id: 'b', text: 'Paroxítona', isCorrect: false },
      { id: 'c', text: 'Oxítona', isCorrect: false },
    ],
    explanation: 'Antepenúltima sílaba forte = Proparoxítona! E todas são acentuadas.',
    category: 'classificacao',
  },
  {
    id: 'sp-2',
    word: 'CAFÉ',
    prompt: 'A palavra CAFÉ tem a última sílaba forte. Ela é classificada como:',
    options: [
      { id: 'a', text: 'Oxítona', isCorrect: true },
      { id: 'b', text: 'Paroxítona', isCorrect: false },
      { id: 'c', text: 'Proparoxítona', isCorrect: false },
    ],
    explanation: 'Última sílaba forte = Oxítona! Leva acento porque termina em "e".',
    category: 'classificacao',
  },
  {
    id: 'sp-3',
    word: 'CADERNO',
    prompt: 'Na palavra CADERNO (ca-der-no), a sílaba mais forte é "der" (penúltima). Ela é:',
    options: [
      { id: 'a', text: 'Paroxítona', isCorrect: true },
      { id: 'b', text: 'Oxítona', isCorrect: false },
      { id: 'c', text: 'Proparoxítona', isCorrect: false },
    ],
    explanation: 'Penúltima sílaba forte = Paroxítona.',
    category: 'classificacao',
  },
  {
    id: 'sp-4',
    word: 'ÁRVORE',
    prompt: 'Qual regra explica por que a palavra ÁRVORE tem acento gráfico?',
    options: [
      { id: 'a', text: 'Todas as proparoxítonas são acentuadas', isCorrect: true },
      { id: 'b', text: 'Termina com a letra "e"', isCorrect: false },
      { id: 'c', text: 'É uma oxítona terminada em vogal', isCorrect: false },
    ],
    explanation: 'ÁR-vo-re é proparoxítona, e 100% das proparoxítonas levam acento!',
    category: 'regra',
  },
  {
    id: 'sp-5',
    word: 'TAMBOR',
    prompt: 'A palavra TAMBOR precisa de acento gráfico?',
    options: [
      { id: 'a', text: 'Não, oxítonas terminadas em R não têm acento', isCorrect: true },
      { id: 'b', text: 'Sim, na letra O', isCorrect: false },
      { id: 'c', text: 'Sim, na letra A', isCorrect: false },
    ],
    explanation: 'Oxítonas só levam acento se terminarem em a, e, o, em, ens.',
    category: 'regra',
  },
  {
    id: 'sp-6',
    word: 'FÁCIL',
    prompt: 'A palavra FÁCIL é paroxítona e recebe acento agudo porque termina em:',
    options: [
      { id: 'a', text: 'Consoante L', isCorrect: true },
      { id: 'b', text: 'Vogal I', isCorrect: false },
      { id: 'c', text: 'Ditongo', isCorrect: false },
    ],
    explanation: 'Paroxítonas terminadas em L, R, X, N sempre recebem acento gráfico!',
    category: 'regra',
  },
  {
    id: 'sp-7',
    word: 'PÁSSARO',
    prompt: 'Qual é a sílaba tônica (mais forte) da palavra PÁSSARO?',
    options: [
      { id: 'a', text: 'PÁS (antepenúltima)', isCorrect: true },
      { id: 'b', text: 'SA (penúltima)', isCorrect: false },
      { id: 'c', text: 'RO (última)', isCorrect: false },
    ],
    explanation: 'PÁS é a antepenúltima sílaba, por isso a palavra é proparoxítona.',
    category: 'tonica',
  },
  {
    id: 'sp-8',
    word: 'SOFÁ',
    prompt: 'Qual destas palavras também é uma OXÍTONA como a palavra SOFÁ?',
    options: [
      { id: 'a', text: 'Cipó', isCorrect: true },
      { id: 'b', text: 'Mesa', isCorrect: false },
      { id: 'c', text: 'Médico', isCorrect: false },
    ],
    explanation: 'Ci-pó tem a última sílaba forte, assim como so-fá.',
    category: 'identificacao',
  },
  {
    id: 'sp-9',
    word: 'MÉDICO',
    prompt: 'Qual destas três palavras é uma PROPAROXÍTONA?',
    options: [
      { id: 'a', text: 'MÉDICO', isCorrect: true },
      { id: 'b', text: 'CANETA', isCorrect: false },
      { id: 'c', text: 'JACARÉ', isCorrect: false },
    ],
    explanation: 'MÉ-di-co tem a antepenúltima sílaba mais forte.',
    category: 'identificacao',
  },
  {
    id: 'sp-10',
    word: 'PARABÉNS',
    prompt: 'A palavra PARABÉNS recebe acento gráfico porque é uma oxítona terminada em:',
    options: [
      { id: 'a', text: '-ENS', isCorrect: true },
      { id: 'b', text: '-S', isCorrect: false },
      { id: 'c', text: '-N', isCorrect: false },
    ],
    explanation: 'Oxítonas terminadas em -em ou -ens levam acento (armazém, parabéns).',
    category: 'regra',
  },
  {
    id: 'sp-11',
    word: 'CAJU',
    prompt: 'A palavra CAJU (ca-JU) é oxítona. Ela leva acento gráfico?',
    options: [
      { id: 'a', text: 'Não leva acento (oxítonas em U não têm acento)', isCorrect: true },
      { id: 'b', text: 'Sim, leva acento agudo no U', isCorrect: false },
      { id: 'c', text: 'Sim, leva acento circunflexo', isCorrect: false },
    ],
    explanation: 'Oxítonas terminadas em "u" como caju, urubu e tatu não são acentuadas!',
    category: 'regra',
  },
  {
    id: 'sp-12',
    word: 'TÓRAX',
    prompt: 'A palavra TÓRAX é paroxítona e tem acento porque termina na consoante:',
    options: [
      { id: 'a', text: 'X', isCorrect: true },
      { id: 'b', text: 'R', isCorrect: false },
      { id: 'c', text: 'S', isCorrect: false },
    ],
    explanation: 'Paroxítonas terminadas em X recebem acento agudo.',
    category: 'regra',
  },
  {
    id: 'sp-13',
    word: 'MÚSICA',
    prompt: 'Separando as sílabas de MÚSICA (mú-si-ca), a sílaba "mú" ocupa qual posição?',
    options: [
      { id: 'a', text: 'Antepenúltima', isCorrect: true },
      { id: 'b', text: 'Penúltima', isCorrect: false },
      { id: 'c', text: 'Última', isCorrect: false },
    ],
    explanation: 'Contando de trás para frente: ca (última), si (penúltima), mú (antepenúltima).',
    category: 'tonica',
  },
  {
    id: 'sp-14',
    word: 'ÁLBUM',
    prompt: 'Qual destas palavras também é uma PAROXÍTONA com acento como ÁLBUM?',
    options: [
      { id: 'a', text: 'Fórum', isCorrect: true },
      { id: 'b', text: 'Vovô', isCorrect: false },
      { id: 'c', text: 'Vatapá', isCorrect: false },
    ],
    explanation: 'Fó-rum e ál-bum são paroxítonas terminadas em -um!',
    category: 'identificacao',
  },
  {
    id: 'sp-15',
    word: 'RELÂMPAGO',
    prompt: 'Quantas proparoxítonas na língua portuguesa NÃO levam acento?',
    options: [
      { id: 'a', text: 'Nenhuma! Todas são acentuadas!', isCorrect: true },
      { id: 'b', text: 'Apenas dez palavras', isCorrect: false },
      { id: 'c', text: 'Metade das palavras', isCorrect: false },
    ],
    explanation: 'A regra suprema do português: 100% das proparoxítonas levam acento!',
    category: 'regra',
  },
];

export function getRandomSprintQuestions(count: number = 10): SprintQuestion[] {
  const shuffled = [...SPRINT_QUESTIONS_BANK].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
