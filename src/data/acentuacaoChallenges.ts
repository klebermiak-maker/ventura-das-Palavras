/**
 * EF05LP03 Progressive Acentuação Challenges & Grammatical Rules
 * Covers Oxítonas, Paroxítonas, Proparoxítonas & Monossílabos Tônicos
 */

export type AcentuacaoChallengeType = 'classificar' | 'escolher_grafia' | 'identificar_inadequada';

export interface BaseChallenge {
  id: string;
  type: AcentuacaoChallengeType;
  title: string;
  level: 1 | 2 | 3 | 4;
  levelTitle: string;
  word: string;
  ruleExplanation: string;
  pedagogicalTip: string;
}

export interface ClassifyChallenge extends BaseChallenge {
  type: 'classificar';
  syllables: string[];
  tonicIndex: number; // 0-indexed position
  tonicPositionName: 'última' | 'penúltima' | 'antepenúltima';
  correctClassification: 'oxitona' | 'paroxitona' | 'proparoxitona';
  needsAccent: boolean;
  accentType?: 'agudo' | 'circunflexo' | 'nenhum';
}

export interface ChooseAccentChallenge extends BaseChallenge {
  type: 'escolher_grafia';
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
  category: 'oxitona' | 'paroxitona' | 'proparoxitona' | 'monossilabo';
}

export interface FindIncorrectChallenge extends BaseChallenge {
  type: 'identificar_inadequada';
  prompt: string;
  words: {
    id: string;
    wordDisplay: string;
    isIncorrect: boolean; // TRUE if this word has inadequate/wrong accentuation
    correctCorrection: string;
    whyIncorrect: string;
    classification: 'oxitona' | 'paroxitona' | 'proparoxitona';
  }[];
}

export type AnyAcentuacaoChallenge = ClassifyChallenge | ChooseAccentChallenge | FindIncorrectChallenge;

// ==========================================
// 1. DESAFIOS DE CLASSIFICAÇÃO SILÁBICA
// ==========================================
export const CLASSIFY_CHALLENGES: ClassifyChallenge[] = [
  {
    id: 'clf-1',
    type: 'classificar',
    level: 1,
    levelTitle: 'Fase 1: Classificação das Palavras',
    title: 'Classifique a palavra "LÂMPADA"',
    word: 'lâmpada',
    syllables: ['lâm', 'pa', 'da'],
    tonicIndex: 0,
    tonicPositionName: 'antepenúltima',
    correctClassification: 'proparoxitona',
    needsAccent: true,
    accentType: 'circunflexo',
    ruleExplanation: 'REGRA DE OURO: 100% das palavras proparoxítonas recebem acento gráfico! A antepenúltima sílaba "lâm" é a mais forte.',
    pedagogicalTip: 'Conte as sílabas de trás para frente: da (última), pa (penúltima), lâm (antepenúltima). Antepenúltima mais forte = Proparoxítona!',
  },
  {
    id: 'clf-2',
    type: 'classificar',
    level: 1,
    levelTitle: 'Fase 1: Classificação das Palavras',
    title: 'Classifique a palavra "CAFÉ"',
    word: 'café',
    syllables: ['ca', 'fé'],
    tonicIndex: 1,
    tonicPositionName: 'última',
    correctClassification: 'oxitona',
    needsAccent: true,
    accentType: 'agudo',
    ruleExplanation: 'A última sílaba "fé" é a mais forte, logo é OXÍTONA. Oxítonas terminadas nas vogais A, E, O (seguidas ou não de S) e EM/ENS sempre levam acento!',
    pedagogicalTip: 'Se a força máxima está na última sílaba, chame-a de Oxítona!',
  },
  {
    id: 'clf-3',
    type: 'classificar',
    level: 1,
    levelTitle: 'Fase 1: Classificação das Palavras',
    title: 'Classifique a palavra "FÁCIL"',
    word: 'fácil',
    syllables: ['fá', 'cil'],
    tonicIndex: 0,
    tonicPositionName: 'penúltima',
    correctClassification: 'paroxitona',
    needsAccent: true,
    accentType: 'agudo',
    ruleExplanation: 'A penúltima sílaba "fá" é a mais forte = PAROXÍTONA. Recebe acento porque termina na consoante "L".',
    pedagogicalTip: 'Lembre-se da regra: paroxítonas terminadas em R, X, N, L recebem acento gráfico!',
  },
  {
    id: 'clf-4',
    type: 'classificar',
    level: 1,
    levelTitle: 'Fase 1: Classificação das Palavras',
    title: 'Classifique a palavra "CADERNO"',
    word: 'caderno',
    syllables: ['ca', 'der', 'no'],
    tonicIndex: 1,
    tonicPositionName: 'penúltima',
    correctClassification: 'paroxitona',
    needsAccent: false,
    accentType: 'nenhum',
    ruleExplanation: 'A sílaba tônica é a penúltima ("der"), portanto é PAROXÍTONA. Porém NÃO leva acento porque paroxítonas terminadas em "O" não são acentuadas.',
    pedagogicalTip: 'A grande maioria das palavras da língua portuguesa é paroxítona sem acento (escola, menino, caderno, janela).',
  },
  {
    id: 'clf-5',
    type: 'classificar',
    level: 1,
    levelTitle: 'Fase 1: Classificação das Palavras',
    title: 'Classifique a palavra "ÁRVORE"',
    word: 'árvore',
    syllables: ['ár', 'vo', 're'],
    tonicIndex: 0,
    tonicPositionName: 'antepenúltima',
    correctClassification: 'proparoxitona',
    needsAccent: true,
    accentType: 'agudo',
    ruleExplanation: 'A antepenúltima sílaba "ár" é a mais forte. Como toda proparoxítona da língua portuguesa, o acento é obrigatório!',
    pedagogicalTip: 'Ouça o som: "ÁR-vo-re". Toda proparoxítona é acentuada sem exceção.',
  },
  {
    id: 'clf-6',
    type: 'classificar',
    level: 1,
    levelTitle: 'Fase 1: Classificação das Palavras',
    title: 'Classifique a palavra "TAMBOR"',
    word: 'tambor',
    syllables: ['tam', 'bor'],
    tonicIndex: 1,
    tonicPositionName: 'última',
    correctClassification: 'oxitona',
    needsAccent: false,
    accentType: 'nenhum',
    ruleExplanation: 'A última sílaba "bor" é a mais forte, logo é OXÍTONA. Mas NÃO leva acento porque termina em "R" (oxítonas só levam acento em a, e, o, em/ens).',
    pedagogicalTip: 'Terminou em R, L ou Z e é oxítona? Geralmente não leva acento (tambor, papel, nariz).',
  },
];

// ==========================================
// 2. DESAFIOS DE ESCOLHA DA ACENTUAÇÃO CORRETA
// ==========================================
export const CHOOSE_ACCENT_CHALLENGES: ChooseAccentChallenge[] = [
  {
    id: 'ch-1',
    type: 'escolher_grafia',
    level: 2,
    levelTitle: 'Fase 2: Escolha a Grafia Acentuada Correta',
    title: 'Qual é a grafia correta para o meio de transporte?',
    word: 'táxi',
    category: 'paroxitona',
    options: [
      {
        id: 'opt-1',
        text: 'táxi',
        isCorrect: true,
        explanation: 'Correto! "Táxi" é paroxítona terminada em "I". Pela regra da BNCC, paroxítonas terminadas em -i ou -is levam acento agudo.',
      },
      {
        id: 'opt-2',
        text: 'taxi',
        isCorrect: false,
        explanation: 'Incorreto. Sem acento pareceria que a sílaba forte é "xi". Por terminar em "i", a paroxítona exige acento agudo no "a".',
      },
      {
        id: 'opt-3',
        text: 'taxí',
        isCorrect: false,
        explanation: 'Incorreto. A pronúncia não é "ta-XÍ", e sim "TÁ-xi" (penúltima sílaba tônica).',
      },
    ],
    ruleExplanation: 'Paroxítonas terminadas em "-i" ou "-is" recebem acento agudo (ex.: táxi, lápis, júri, biquíni).',
    pedagogicalTip: 'Pronuncie com calma: a sílaba forte é a primeira ("tá"), e a terminação em "i" exige acento.',
  },
  {
    id: 'ch-2',
    type: 'escolher_grafia',
    level: 2,
    levelTitle: 'Fase 2: Escolha a Grafia Acentuada Correta',
    title: 'Qual é a grafia correta para o objeto luminoso?',
    word: 'lâmpada',
    category: 'proparoxitona',
    options: [
      {
        id: 'opt-1',
        text: 'lampada',
        isCorrect: false,
        explanation: 'Incorreto. "Lâmpada" é proparoxítona e TODAS as proparoxítonas são obrigatoriamente acentuadas.',
      },
      {
        id: 'opt-2',
        text: 'lâmpada',
        isCorrect: true,
        explanation: 'Perfeito! É proparoxítona (lâm-pa-da) com som nasal fechado na letra A, por isso leva acento circunflexo (^).',
      },
      {
        id: 'opt-3',
        text: 'lámpada',
        isCorrect: false,
        explanation: 'Incorreto. Antes de "m" e "n", o som da vogal é nasal e fechado (ân/âm), exigindo acento circunflexo (^) e não agudo.',
      },
    ],
    ruleExplanation: 'Proparoxítonas: 100% acentuadas. Quando a vogal tem som fechado e nasal (lâm-), usa-se acento circunflexo.',
    pedagogicalTip: 'Som aberto = acento agudo (árvore). Som fechado ou nasal = circunflexo (lâmpada, relâmpago, pêndulo).',
  },
  {
    id: 'ch-3',
    type: 'escolher_grafia',
    level: 2,
    levelTitle: 'Fase 2: Escolha a Grafia Acentuada Correta',
    title: 'Qual é a grafia correta da sobremesa gelada de frutas?',
    word: 'picolé',
    category: 'oxitona',
    options: [
      {
        id: 'opt-1',
        text: 'picolé',
        isCorrect: true,
        explanation: 'Muito bem! "Picolé" é oxítona terminada em "e", logo recebe acento agudo obrigatório.',
      },
      {
        id: 'opt-2',
        text: 'picole',
        isCorrect: false,
        explanation: 'Incorreto. Oxítonas terminadas na vogal "e" exigem acento gráfico.',
      },
      {
        id: 'opt-3',
        text: 'pícole',
        isCorrect: false,
        explanation: 'Incorreto. A pronúncia não é "PÍ-co-le", a sílaba mais forte é a última: "pi-co-LÉ".',
      },
    ],
    ruleExplanation: 'Oxítonas terminadas em A, E, O (seguidas ou não de s) recebem acento agudo para som aberto e circunflexo para som fechado (café, picolé, você).',
    pedagogicalTip: 'Chame a palavra: "Olha o picolééé!". O "lé" é o mais forte!',
  },
  {
    id: 'ch-4',
    type: 'escolher_grafia',
    level: 2,
    levelTitle: 'Fase 2: Escolha a Grafia Acentuada Correta',
    title: 'Qual é a grafia correta para o livro de fotos ou figurinhas?',
    word: 'álbum',
    category: 'paroxitona',
    options: [
      {
        id: 'opt-1',
        text: 'album',
        isCorrect: false,
        explanation: 'Incorreto. Paroxítonas terminadas em "-um" ou "-uns" exigem acento gráfico na penúltima sílaba.',
      },
      {
        id: 'opt-2',
        text: 'álbum',
        isCorrect: true,
        explanation: 'Excelente! "Álbum" é paroxítona terminada em "-um". Pela regra ortográfica, leva acento agudo no "á".',
      },
      {
        id: 'opt-3',
        text: 'albúm',
        isCorrect: false,
        explanation: 'Incorreto. A sílaba mais forte é a penúltima ("ál"), não a última.',
      },
    ],
    ruleExplanation: 'Paroxítonas terminadas em "-um" ou "-uns" são acentuadas (ex.: álbum, álbuns, fórum, médium).',
    pedagogicalTip: 'Terminou em "-um" e é paroxítona? Pode colocar o acento na sílaba forte!',
  },
  {
    id: 'ch-5',
    type: 'escolher_grafia',
    level: 2,
    levelTitle: 'Fase 2: Escolha a Grafia Acentuada Correta',
    title: 'Qual é a grafia correta da fruta tropical?',
    word: 'caju',
    category: 'oxitona',
    options: [
      {
        id: 'opt-1',
        text: 'cajù',
        isCorrect: false,
        explanation: 'Incorreto. A crase (à) só é usada antes de palavras femininas e nunca como acento tônico isolado.',
      },
      {
        id: 'opt-2',
        text: 'cajú',
        isCorrect: false,
        explanation: 'Incorreto! Este é um dos erros mais comuns: oxítonas terminadas em "u" NÃO levam acento (caju, urubu, angu, tatu).',
      },
      {
        id: 'opt-3',
        text: 'caju',
        isCorrect: true,
        explanation: 'Sensacional! Oxítonas terminadas em "U" e em "I" NÃO recebem acento gráfico (caju, tatu, urubu, saci, abacaxi).',
      },
    ],
    ruleExplanation: 'Atenção redobrada: Oxítonas terminadas em "U" e em "I" NÃO recebem acento (caju, urubu, tatu, saci, javali). Só acentuamos as terminadas em A, E, O, EM, ENS.',
    pedagogicalTip: 'Pegadinha clássica: caju e urubu são oxítonas naturais sem acento nenhum!',
  },
];

// ==========================================
// 3. DESAFIOS DE IDENTIFICAR ACENTUAÇÃO INADEQUADA (CAÇADOR DE ERROS)
// ==========================================
export const FIND_INCORRECT_CHALLENGES: FindIncorrectChallenge[] = [
  {
    id: 'err-1',
    type: 'identificar_inadequada',
    level: 3,
    levelTitle: 'Fase 3: Caçador de Acentuações Inadequadas',
    title: 'Encontre a palavra com acentuação INCORRETA',
    word: 'Caçada de Erros 1',
    prompt: 'Qual destas 4 palavras foi escrita com a acentuação inadequada (com erro de acento)?',
    words: [
      {
        id: 'w-1',
        wordDisplay: 'café',
        isIncorrect: false,
        correctCorrection: 'café',
        whyIncorrect: 'Está correta! Oxítona terminada em "e" recebe acento agudo.',
        classification: 'oxitona',
      },
      {
        id: 'w-2',
        wordDisplay: 'arvore',
        isIncorrect: true, // ERROR: Missing accent!
        correctCorrection: 'árvore',
        whyIncorrect: 'ERRO ENCONTRADO! "Árvore" é proparoxítona (ár-vo-re) e TODAS as proparoxítonas devem receber acento gráfico obrigatoriamente!',
        classification: 'proparoxitona',
      },
      {
        id: 'w-3',
        wordDisplay: 'sofá',
        isIncorrect: false,
        correctCorrection: 'sofá',
        whyIncorrect: 'Está correta! Oxítona terminada em "a" recebe acento agudo.',
        classification: 'oxitona',
      },
      {
        id: 'w-4',
        wordDisplay: 'fácil',
        isIncorrect: false,
        correctCorrection: 'fácil',
        whyIncorrect: 'Está correta! Paroxítona terminada em "l" recebe acento agudo.',
        classification: 'paroxitona',
      },
    ],
    ruleExplanation: 'A palavra "arvore" estava sem acento! Como é proparoxítona, NUNCA pode ser escrita sem acento.',
    pedagogicalTip: 'Procure proparoxítonas esquecidas: se a antepenúltima é a mais forte, o acento é 100% obrigatório.',
  },
  {
    id: 'err-2',
    type: 'identificar_inadequada',
    level: 3,
    levelTitle: 'Fase 3: Caçador de Acentuações Inadequadas',
    title: 'Encontre a palavra que recebeu acento INDEVIDO',
    word: 'Caçada de Erros 2',
    prompt: 'Qual destas palavras NÃO deveria ter recebido acento gráfico?',
    words: [
      {
        id: 'w-1',
        wordDisplay: 'urubú',
        isIncorrect: true, // ERROR: Unnecessary accent on oxytone ending in -u!
        correctCorrection: 'urubu',
        whyIncorrect: 'ERRO ENCONTRADO! "Urubu" é oxítona terminada em "u", e oxítonas terminadas em "u" NÃO levam acento gráfico (como caju, tatu, angu).',
        classification: 'oxitona',
      },
      {
        id: 'w-2',
        wordDisplay: 'cipó',
        isIncorrect: false,
        correctCorrection: 'cipó',
        whyIncorrect: 'Está correta! Oxítona terminada em "o" recebe acento agudo.',
        classification: 'oxitona',
      },
      {
        id: 'w-3',
        wordDisplay: 'mágico',
        isIncorrect: false,
        correctCorrection: 'mágico',
        whyIncorrect: 'Está correta! Proparoxítona sempre tem acento no "má".',
        classification: 'proparoxitona',
      },
      {
        id: 'w-4',
        wordDisplay: 'tórax',
        isIncorrect: false,
        correctCorrection: 'tórax',
        whyIncorrect: 'Está correta! Paroxítona terminada em "x" recebe acento agudo.',
        classification: 'paroxitona',
      },
    ],
    ruleExplanation: 'Oxítonas terminadas em U e I (urubu, caju, saci) NÃO levam acento! O acento em "urubú" é inadequado.',
    pedagogicalTip: 'Cuidado com a vontade de acentuar toda palavra forte: oxítona em "u" é sem acento.',
  },
  {
    id: 'err-3',
    type: 'identificar_inadequada',
    level: 3,
    levelTitle: 'Fase 3: Caçador de Acentuações Inadequadas',
    title: 'Qual palavra nesta lista está escrita de forma errada?',
    word: 'Caçada de Erros 3',
    prompt: 'Analise o grupo e aponte qual palavra está com acentuação incorreta:',
    words: [
      {
        id: 'w-1',
        wordDisplay: 'parabéns',
        isIncorrect: false,
        correctCorrection: 'parabéns',
        whyIncorrect: 'Correta: oxítona terminada em "ens" leva acento.',
        classification: 'oxitona',
      },
      {
        id: 'w-2',
        wordDisplay: 'musica',
        isIncorrect: true, // ERROR: Missing accent!
        correctCorrection: 'música',
        whyIncorrect: 'ERRO ENCONTRADO! "Música" é proparoxítona (mú-si-ca) e deve obrigatoriamente ter acento agudo no "u"!',
        classification: 'proparoxitona',
      },
      {
        id: 'w-3',
        wordDisplay: 'lápis',
        isIncorrect: false,
        correctCorrection: 'lápis',
        whyIncorrect: 'Correta: paroxítona terminada em "is" leva acento agudo.',
        classification: 'paroxitona',
      },
      {
        id: 'w-4',
        wordDisplay: 'você',
        isIncorrect: false,
        correctCorrection: 'você',
        whyIncorrect: 'Correta: oxítona terminada em "e" com som fechado leva circunflexo.',
        classification: 'oxitona',
      },
    ],
    ruleExplanation: '"Musica" sem acento está errada! Sendo proparoxítona, o acento no "mú" é mandatório.',
    pedagogicalTip: 'As proparoxítonas são as mais fáceis: viu antepenúltima tônica? Tem acento sempre!',
  },
  {
    id: 'err-4',
    type: 'identificar_inadequada',
    level: 3,
    levelTitle: 'Fase 3: Caçador de Acentuações Inadequadas',
    title: 'Encontre o erro na lista de palavras paroxítonas',
    word: 'Caçada de Erros 4',
    prompt: 'Qual destas paroxítonas recebeu acento que NÃO existe na norma culta?',
    words: [
      {
        id: 'w-1',
        wordDisplay: 'repórter',
        isIncorrect: false,
        correctCorrection: 'repórter',
        whyIncorrect: 'Correta: paroxítona terminada em "r" leva acento.',
        classification: 'paroxitona',
      },
      {
        id: 'w-2',
        wordDisplay: 'cadérno',
        isIncorrect: true, // ERROR: caderno does NOT have accent
        correctCorrection: 'caderno',
        whyIncorrect: 'ERRO ENCONTRADO! Paroxítonas normais terminadas em "o" (caderno, menino, sapato) NÃO levam acento gráfico!',
        classification: 'paroxitona',
      },
      {
        id: 'w-3',
        wordDisplay: 'vírus',
        isIncorrect: false,
        correctCorrection: 'vírus',
        whyIncorrect: 'Correta: paroxítona terminada em "us" leva acento agudo.',
        classification: 'paroxitona',
      },
      {
        id: 'w-4',
        wordDisplay: 'hífen',
        isIncorrect: false,
        correctCorrection: 'hífen',
        whyIncorrect: 'Correta: paroxítona terminada em "n" leva acento agudo.',
        classification: 'paroxitona',
      },
    ],
    ruleExplanation: 'Paroxítonas terminadas em A, E, O não levam acento (caderno, janela, mesa, livro).',
    pedagogicalTip: 'Lembre-se da regra invertida: se as oxítonas em A, E, O têm acento, as paroxítonas em A, E, O NÃO têm!',
  },
];

// ==========================================
// 4. GUIA DIDÁTICO DE REGRAS BNCC (EF05LP03)
// ==========================================
export interface GrammaticalRuleItem {
  id: string;
  name: string;
  badge: string;
  color: string;
  ruleTitle: string;
  whenToAccent: string[];
  whenNotToAccent: string[];
  mnemonicTip: string;
  examplesWithAccent: string[];
  examplesWithoutAccent: string[];
}

export const ACENTUACAO_RULES_GUIDE: GrammaticalRuleItem[] = [
  {
    id: 'proparoxitonas',
    name: 'Proparoxítonas',
    badge: 'Regra de Ouro',
    color: 'emerald',
    ruleTitle: 'Antepenúltima sílaba mais forte (tônica)',
    whenToAccent: [
      '100% de todas as palavras proparoxítonas recebem acento gráfico!',
      'Não existe nenhuma exceção na língua portuguesa.',
      'Usa-se acento agudo (´) para som aberto (ár-vo-re, má-gi-co).',
      'Usa-se acento circunflexo (^) para som fechado ou nasal (lâm-pa-da, relâm-pa-go).',
    ],
    whenNotToAccent: [
      'Nunca! Nenhuma proparoxítona pode ficar sem acento.',
    ],
    mnemonicTip: 'Regra Absoluta: Antepenúltima tônica = Acento obrigatório sempre!',
    examplesWithAccent: ['árvore', 'lâmpada', 'música', 'pássaro', 'matemática', 'sábado', 'relâmpago', 'xícara'],
    examplesWithoutAccent: [],
  },
  {
    id: 'oxitonas',
    name: 'Oxítonas',
    badge: 'Última Sílaba Forte',
    color: 'sky',
    ruleTitle: 'Última sílaba mais forte (tônica)',
    whenToAccent: [
      'Terminadas em A ou AS (sofá, Paraná, carajás).',
      'Terminadas em E ou ES (café, você, picolé, jacarés).',
      'Terminadas em O ou OS (cipó, avô, avó, robô, jiló).',
      'Terminadas em EM ou ENS (armazém, parabéns, também).',
    ],
    whenNotToAccent: [
      'Terminadas em U ou US (caju, urubu, tatu, angu).',
      'Terminadas em I ou IS (saci, abacaxi, javali, guri).',
      'Terminadas em R, L, Z (tambor, papel, feliz, mulher).',
    ],
    mnemonicTip: 'Acentuamos oxítonas terminadas em: A, E, O, EM, ENS!',
    examplesWithAccent: ['café', 'sofá', 'cipó', 'armazém', 'parabéns', 'você', 'jacaré', 'sabiá'],
    examplesWithoutAccent: ['caju', 'urubu', 'saci', 'tambor', 'papel', 'nariz', 'abacaxi', 'tatu'],
  },
  {
    id: 'paroxitonas',
    name: 'Paroxítonas',
    badge: 'Penúltima Sílaba Forte',
    color: 'amber',
    ruleTitle: 'Penúltima sílaba mais forte (tônica)',
    whenToAccent: [
      'Terminadas no "ROUXINOL": R, X, N, L (repórter, tórax, hífen, fácil, túnel, revólver).',
      'Terminadas em I ou IS (táxi, lápis, júri, biquíni).',
      'Terminadas em UM ou UNS (álbum, álbuns, fórum).',
      'Terminadas em US (vírus, bônus, Vênus).',
      'Terminadas em ÃO, ÃOS, Ã, ÃS (órfão, bênção, ímã).',
      'Terminadas em Ditongo Oral (história, relógio, carruagem [não acentua], colégio).',
    ],
    whenNotToAccent: [
      'A grande maioria das paroxítonas termina em A, E, O, EM/ENS e NÃO leva acento (livro, janela, menino, caderno, escola, homem, nuvem).',
    ],
    mnemonicTip: 'Dica do Rouxinol: Paroxítonas acentuadas terminam nas consoantes de R-O-U-X-I-N-O-L!',
    examplesWithAccent: ['fácil', 'táxi', 'lápis', 'álbum', 'tórax', 'hífen', 'vírus', 'repórter', 'órfão'],
    examplesWithoutAccent: ['janela', 'caderno', 'livro', 'escola', 'menino', 'amigo', 'sapato', 'cadeira'],
  },
  {
    id: 'monossilabos',
    name: 'Monossílabos Tônicos',
    badge: '1 Sílaba Forte',
    color: 'purple',
    ruleTitle: 'Palavras de uma só sílaba pronunciadas com força',
    whenToAccent: [
      'Terminados em A(S): pá, lá, má, já, pás.',
      'Terminados em E(S): pé, fé, mês, três.',
      'Terminados em O(S): pó, dó, nós, sós.',
    ],
    whenNotToAccent: [
      'Terminados em I, U: ti, tu, cru, nu, vi.',
    ],
    mnemonicTip: 'Monossílabos fortes terminados em A, E, O recebem acento!',
    examplesWithAccent: ['pá', 'pé', 'pó', 'mês', 'três', 'dó', 'nós', 'já'],
    examplesWithoutAccent: ['tu', 'ti', 'cru', 'de', 'do', 'em'],
  },
];
