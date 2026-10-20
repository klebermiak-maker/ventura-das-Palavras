import { shuffleArray, shuffleOptions } from '../utils/questionShuffle';

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

/**
 * Banco de questões velozes para o Sprint de 60 segundos.
 * Contém vocabulário exclusivo que não se repete com a Usina dos Acentos ou outras missões.
 */
export const SPRINT_QUESTIONS_BANK: SprintQuestion[] = [
  {
    id: 'sp-1',
    word: 'JACARÉ',
    prompt: 'A palavra JACARÉ tem a última sílaba "ré" mais forte. Ela é classificada como:',
    options: [
      { id: 'a', text: 'Oxítona', isCorrect: true },
      { id: 'b', text: 'Paroxítona', isCorrect: false },
      { id: 'c', text: 'Proparoxítona', isCorrect: false },
    ],
    explanation: 'Última sílaba tônica = Oxítona! Acentua-se por terminar em "e".',
    category: 'classificacao',
  },
  {
    id: 'sp-2',
    word: 'ÔNIBUS',
    prompt: 'Na palavra ÔNIBUS (ô-ni-bus), a antepenúltima sílaba é a mais forte. Ela é:',
    options: [
      { id: 'a', text: 'Proparoxítona', isCorrect: true },
      { id: 'b', text: 'Paroxítona', isCorrect: false },
      { id: 'c', text: 'Oxítona', isCorrect: false },
    ],
    explanation: 'Antepenúltima sílaba forte = Proparoxítona! E 100% delas levam acento gráfico.',
    category: 'classificacao',
  },
  {
    id: 'sp-3',
    word: 'AÇÚCAR',
    prompt: 'A palavra AÇÚCAR é paroxítona e recebe acento gráfico porque termina em:',
    options: [
      { id: 'a', text: 'Consoante R', isCorrect: true },
      { id: 'b', text: 'Vogal A', isCorrect: false },
      { id: 'c', text: 'Ditongo', isCorrect: false },
    ],
    explanation: 'Paroxítonas terminadas em R, L, X, N sempre recebem acento gráfico!',
    category: 'regra',
  },
  {
    id: 'sp-4',
    word: 'SABIÁ',
    prompt: 'Qual regra explica por que a palavra SABIÁ leva acento agudo?',
    options: [
      { id: 'a', text: 'É oxítona terminada na vogal A', isCorrect: true },
      { id: 'b', text: 'Toda palavra com três sílabas tem acento', isCorrect: false },
      { id: 'c', text: 'É uma proparoxítona terminada em vogal', isCorrect: false },
    ],
    explanation: 'Oxítonas terminadas em A, E, O (seguidas ou não de S) e EM/ENS levam acento!',
    category: 'regra',
  },
  {
    id: 'sp-5',
    word: 'ÓCULOS',
    prompt: 'Qual é a sílaba tônica (mais forte) da palavra ÓCULOS?',
    options: [
      { id: 'a', text: 'Ó (antepenúltima)', isCorrect: true },
      { id: 'b', text: 'CU (penúltima)', isCorrect: false },
      { id: 'c', text: 'LOS (última)', isCorrect: false },
    ],
    explanation: '"Ó" é a antepenúltima sílaba, o que torna a palavra uma proparoxítona.',
    category: 'tonica',
  },
  {
    id: 'sp-6',
    word: 'VÍRUS',
    prompt: 'A palavra VÍRUS recebe acento porque é paroxítona terminada em:',
    options: [
      { id: 'a', text: 'Terminação -US', isCorrect: true },
      { id: 'b', text: 'Terminação -S', isCorrect: false },
      { id: 'c', text: 'Consoante R', isCorrect: false },
    ],
    explanation: 'Paroxítonas terminadas em -i, -is, -us recebem acento (como vírus, bônus, lápis).',
    category: 'regra',
  },
  {
    id: 'sp-7',
    word: 'DOMINÓ',
    prompt: 'A palavra DOMINÓ é uma oxítona. Por que ela precisa de acento gráfico?',
    options: [
      { id: 'a', text: 'Porque termina na vogal O', isCorrect: true },
      { id: 'b', text: 'Porque começa com a letra D', isCorrect: false },
      { id: 'c', text: 'Porque tem três consoantes', isCorrect: false },
    ],
    explanation: 'Oxítonas terminadas em O sempre recebem acento (ex.: cipó, dominó, jiló).',
    category: 'regra',
  },
  {
    id: 'sp-8',
    word: 'CANETA',
    prompt: 'Na palavra CANETA (ca-ne-ta), a sílaba forte é "ne" (penúltima). Por que ela NÃO tem acento?',
    options: [
      { id: 'a', text: 'Porque paroxítonas terminadas em A não são acentuadas', isCorrect: true },
      { id: 'b', text: 'Porque é uma palavra com seis letras', isCorrect: false },
      { id: 'c', text: 'Porque é uma proparoxítona', isCorrect: false },
    ],
    explanation: 'A regra geral é: paroxítonas terminadas em A, E, O não levam acento.',
    category: 'regra',
  },
  {
    id: 'sp-9',
    word: 'PÊSSEGO',
    prompt: 'A palavra PÊSSEGO é classificada como:',
    options: [
      { id: 'a', text: 'Proparoxítona', isCorrect: true },
      { id: 'b', text: 'Paroxítona', isCorrect: false },
      { id: 'c', text: 'Oxítona', isCorrect: false },
    ],
    explanation: 'PÊS-se-go: a antepenúltima sílaba é a mais forte, logo é proparoxítona.',
    category: 'classificacao',
  },
  {
    id: 'sp-10',
    word: 'ABACAXI',
    prompt: 'Na palavra ABACAXI (a-ba-ca-xi), a sílaba tônica é "xi". Por que NÃO tem acento?',
    options: [
      { id: 'a', text: 'Oxítonas terminadas em I não levam acento', isCorrect: true },
      { id: 'b', text: 'Porque termina com vogal forte', isCorrect: false },
      { id: 'c', text: 'Porque é paroxítona', isCorrect: false },
    ],
    explanation: 'Oxítonas só são acentuadas em a, e, o, em/ens. As terminadas em I e U naturais não levam acento.',
    category: 'regra',
  },
  {
    id: 'sp-11',
    word: 'MÉDICO',
    prompt: 'Separando MÉDICO (mé-di-co), qual sílaba recebe a maior força vocal?',
    options: [
      { id: 'a', text: 'MÉ (antepenúltima)', isCorrect: true },
      { id: 'b', text: 'DI (penúltima)', isCorrect: false },
      { id: 'c', text: 'CO (última)', isCorrect: false },
    ],
    explanation: 'A sílaba "mé" é a antepenúltima tônica = proparoxítona!',
    category: 'tonica',
  },
  {
    id: 'sp-12',
    word: 'TROFÉU',
    prompt: 'A palavra TROFÉU tem a última sílaba tônica com som aberto "-éu". Ela é:',
    options: [
      { id: 'a', text: 'Oxítona com ditongo aberto acentuado', isCorrect: true },
      { id: 'b', text: 'Paroxítona terminada em U', isCorrect: false },
      { id: 'c', text: 'Proparoxítona', isCorrect: false },
    ],
    explanation: 'Ditongos abertos tônicos em palavras oxítonas (éi, éu, ói) são acentuados (chapéu, troféu, herói).',
    category: 'classificacao',
  },
  {
    id: 'sp-13',
    word: 'JÚRI',
    prompt: 'A palavra JÚRI é paroxítona e leva acento porque termina em:',
    options: [
      { id: 'a', text: 'Vogal I', isCorrect: true },
      { id: 'b', text: 'Consoante R', isCorrect: false },
      { id: 'c', text: 'Vogal U', isCorrect: false },
    ],
    explanation: 'Paroxítonas terminadas em I ou IS são sempre acentuadas (ex.: júri, lápis, táxi).',
    category: 'regra',
  },
  {
    id: 'sp-14',
    word: 'REVÓLVER',
    prompt: 'Qual regra justifica o acento agudo na palavra REVÓLVER?',
    options: [
      { id: 'a', text: 'Paroxítona terminada na consoante R', isCorrect: true },
      { id: 'b', text: 'Oxítona terminada em ER', isCorrect: false },
      { id: 'c', text: 'Proparoxítona obrigatória', isCorrect: false },
    ],
    explanation: 'Re-vól-ver tem a penúltima sílaba forte e termina em R = acentua-se!',
    category: 'regra',
  },
  {
    id: 'sp-15',
    word: 'FÓSFORO',
    prompt: 'Qual é a regra geral de ouro para a palavra FÓSFORO?',
    options: [
      { id: 'a', text: 'Todas as proparoxítonas são acentuadas sem exceção', isCorrect: true },
      { id: 'b', text: 'Apenas proparoxítonas terminadas em O são acentuadas', isCorrect: false },
      { id: 'c', text: 'Palavras de três sílabas terminadas em R levam acento', isCorrect: false },
    ],
    explanation: 'FÓS-fo-ro tem antepenúltima sílaba tônica. 100% das proparoxítonas levam acento.',
    category: 'regra',
  },
  {
    id: 'sp-16',
    word: 'BIQUÍNI',
    prompt: 'A palavra BIQUÍNI é paroxítona. Qual terminação exige o seu acento?',
    options: [
      { id: 'a', text: 'Terminação em I', isCorrect: true },
      { id: 'b', text: 'Terminação em NI', isCorrect: false },
      { id: 'c', text: 'Início com a letra B', isCorrect: false },
    ],
    explanation: 'Bi-quí-ni tem a penúltima sílaba forte e termina em "i", exigindo acento agudo.',
    category: 'regra',
  },
  {
    id: 'sp-17',
    word: 'PARABÉNS',
    prompt: 'Por que a palavra PARABÉNS recebe acento gráfico na última sílaba?',
    options: [
      { id: 'a', text: 'Porque é oxítona terminada em -ENS', isCorrect: true },
      { id: 'b', text: 'Porque é paroxítona terminada em -S', isCorrect: false },
      { id: 'c', text: 'Porque é proparoxítona', isCorrect: false },
    ],
    explanation: 'Oxítonas terminadas em -em e -ens sempre levam acento (armazém, também, parabéns).',
    category: 'regra',
  },
  {
    id: 'sp-18',
    word: 'CROCHÊ',
    prompt: 'A palavra CROCHÊ tem som fechado na última sílaba. Ela é classificada como:',
    options: [
      { id: 'a', text: 'Oxítona acentuada com circunflexo', isCorrect: true },
      { id: 'b', text: 'Paroxítona', isCorrect: false },
      { id: 'c', text: 'Proparoxítona', isCorrect: false },
    ],
    explanation: 'Cro-chê é oxítona terminada em "e". O acento circunflexo indica a vogal tônica fechada.',
    category: 'classificacao',
  },
];

/**
 * Retorna uma seleção aleatória de questões com ordem totalmente embaralhada
 * e alternativas embaralhadas para cada questão, garantindo que a resposta certa
 * não fique sempre na mesma posição.
 */
export function getRandomSprintQuestions(count: number = 10): SprintQuestion[] {
  const shuffledQuestions = shuffleArray(SPRINT_QUESTIONS_BANK);
  const selected = shuffledQuestions.slice(0, count);

  return selected.map(q => {
    const letters = ['a', 'b', 'c'];
    const shuffledOptions = shuffleArray(q.options).map((opt, idx) => ({
      ...opt,
      id: letters[idx] || opt.id,
    }));

    return {
      ...q,
      options: shuffledOptions,
    };
  });
}
