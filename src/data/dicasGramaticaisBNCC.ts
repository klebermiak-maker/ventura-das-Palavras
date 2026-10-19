import { BNCCSkill } from '../types/game';

export interface TemaGramaticalBNCC {
  id: string;
  skillCode: BNCCSkill;
  skillName: string;
  missionId: 'explicitas' | 'central' | 'implicitas' | 'acentuacao' | 'sprint';
  missionLabel: string;
  title: string;
  grammarTopic: string;
  shortTag: string;
  icon: string;
  badgeColor: {
    bg: string;
    text: string;
    border: string;
    glow: string;
  };
  preparationTip: string;
  goldenRule: string;
  practicalExample: {
    phrase: string;
    analysis: string;
  };
  gameApplication: string; // Como cai nos desafios do jogo
}

export const TEMAS_GRAMATICAIS_BNCC: TemaGramaticalBNCC[] = [
  {
    id: 'tema-proparoxitona',
    skillCode: 'EF05LP03',
    skillName: 'Acentuação Gráfica',
    missionId: 'acentuacao',
    missionLabel: 'Usina dos Acentos',
    title: 'A Regra Soberana: Toda Proparoxítona Leva Acento!',
    grammarTopic: 'Proparoxítonas & Sílaba Tônica',
    shortTag: 'Acentuação',
    icon: '👑',
    badgeColor: {
      bg: 'bg-purple-100',
      text: 'text-purple-900',
      border: 'border-purple-300',
      glow: 'from-purple-500/10 to-indigo-500/10',
    },
    preparationTip: 'Antes de responder nos jogos, separe mentalmente as sílabas de trás para frente: última, penúltima e antepenúltima.',
    goldenRule: 'Se a antepenúltima sílaba for a mais forte (tônica), ela NUNCA escapa: SEMPRE recebe acento agudo (´) ou circunflexo (^)!',
    practicalExample: {
      phrase: 'O té-les-có-pi-o e a lâmpada mágica.',
      analysis: 'Telescópio (an-te-pe-núl-ti-ma tônica = proparoxítona acentuada).',
    },
    gameApplication: 'Na Usina dos Acentos e no Sprint, você ganha 20 XP extras ao identificar proparoxítonas de primeira!',
  },
  {
    id: 'tema-oxitonas-terminacoes',
    skillCode: 'EF05LP03',
    skillName: 'Acentuação Gráfica',
    missionId: 'acentuacao',
    missionLabel: 'Usina dos Acentos',
    title: 'Oxítonas com Acento: O Segredo das Terminações A, E, O, EM',
    grammarTopic: 'Oxítonas Acentuadas',
    shortTag: 'Regras de Oxítona',
    icon: '⚡',
    badgeColor: {
      bg: 'bg-indigo-100',
      text: 'text-indigo-900',
      border: 'border-indigo-300',
      glow: 'from-indigo-500/10 to-sky-500/10',
    },
    preparationTip: 'Oxítona é a palavra cuja ÚLTIMA sílaba é pronunciada com mais energia.',
    goldenRule: 'Acentuamos oxítonas terminadas em -A(s), -E(s), -O(s), -EM e -ENS. Palavras terminadas em I ou U (como "caju", "saci") NÃO levam acento!',
    practicalExample: {
      phrase: 'Sofá, café, cipó e também.',
      analysis: 'Todas terminam em A, E, O ou EM e a última sílaba é a mais forte.',
    },
    gameApplication: 'Cuidado com pegadinhas como "urubu" e "abacaxi": são oxítonas, mas não terminam nas 4 letrinhas de ouro!',
  },
  {
    id: 'tema-paroxitonas-especiais',
    skillCode: 'EF05LP03',
    skillName: 'Acentuação Gráfica',
    missionId: 'acentuacao',
    missionLabel: 'Usina dos Acentos',
    title: 'Paroxítonas: As Raras que Levam Acento (Regra do R-O-U-X-I-N-O-L)',
    grammarTopic: 'Paroxítonas Terminadas em R, X, N, L',
    shortTag: 'Paroxítonas',
    icon: '🧪',
    badgeColor: {
      bg: 'bg-blue-100',
      text: 'text-blue-900',
      border: 'border-blue-300',
      glow: 'from-blue-500/10 to-teal-500/10',
    },
    preparationTip: 'A grande maioria das palavras em português são paroxítonas e NÃO levam acento (como "mesa", "livro").',
    goldenRule: 'Só acentuamos paroxítonas com terminações especiais: terminadas em R, X, N, L, I(s), US, PS ou ditongo!',
    practicalExample: {
      phrase: 'O réptil fóssil tinha caráter amável.',
      analysis: 'Réptil (termina em L), caráter (termina em R) e fóssil (termina em L) são paroxítonas acentuadas.',
    },
    gameApplication: 'Na Usina dos Acentos, use o botão de regras para consultar o manual com todas as terminações.',
  },
  {
    id: 'tema-fatos-explicitos',
    skillCode: 'EF15LP03',
    skillName: 'Localização de Fatos',
    missionId: 'explicitas',
    missionLabel: 'Detetive dos Fatos',
    title: 'Detetive Textual: A Resposta Já Está Escrita no Texto!',
    grammarTopic: 'Localização Explícita de Informações',
    shortTag: 'Fatos Explícitos',
    icon: '🔍',
    badgeColor: {
      bg: 'bg-emerald-100',
      text: 'text-emerald-900',
      border: 'border-emerald-300',
      glow: 'from-emerald-500/10 to-green-500/10',
    },
    preparationTip: 'Para acertar perguntas de fatos explícitos, você não precisa deduzir nada: basta encontrar o parágrafo exato.',
    goldenRule: 'Procure palavras-chave da pergunta (nomes próprios, números, datas, lugares) no corpo do texto para achar a pista literal.',
    practicalExample: {
      phrase: 'Pergunta: "Onde o tatu-bola se escondeu?" Texto: "O animal abrigou-se sob a sombra do juazeiro."',
      analysis: 'A resposta literal está expressa no texto: "sob a sombra do juazeiro".',
    },
    gameApplication: 'No jogo Detetive dos Fatos, use o botão "Destacar Pistas" para colorir a resposta no parágrafo!',
  },
  {
    id: 'tema-ideia-central',
    skillCode: 'EF35LP03',
    skillName: 'Compreensão Global',
    missionId: 'central',
    missionLabel: 'A Bússola do Tema',
    title: 'A Bússola do Tema: Diferencie o Tema Central de um Mero Exemplo',
    grammarTopic: 'Identificação da Ideia Central',
    shortTag: 'Tema Global',
    icon: '🧭',
    badgeColor: {
      bg: 'bg-sky-100',
      text: 'text-sky-900',
      border: 'border-sky-300',
      glow: 'from-sky-500/10 to-indigo-500/10',
    },
    preparationTip: 'A ideia central é o guarda-chuva que cobre todo o texto do início ao fim.',
    goldenRule: 'Pergunte-se: "Se eu tivesse que dar uma única manchete para esse texto no jornal da escola, qual seria?" Evite opções que só falam de um detalhe isolado.',
    practicalExample: {
      phrase: 'Um texto fala sobre a extinção de várias espécies na Caatinga e cita o tatu-bola em apenas uma linha.',
      analysis: 'A ideia central é a preservação da Caatinga, NÃO apenas a vida do tatu-bola.',
    },
    gameApplication: 'Na Bússola do Tema, leia o título da manchete ideal para confirmar se ela resume o texto inteiro.',
  },
  {
    id: 'tema-inferencia-entrelinhas',
    skillCode: 'EF35LP04',
    skillName: 'Inferência Textual',
    missionId: 'implicitas',
    missionLabel: 'Mago das Entrelinhas',
    title: 'Mago das Entrelinhas: Como Deduzir o que o Autor Não Disse com Todas as Letras',
    grammarTopic: 'Inferências & Pistas Implícitas',
    shortTag: 'Entrelinhas',
    icon: '🕵️',
    badgeColor: {
      bg: 'bg-amber-100',
      text: 'text-amber-900',
      border: 'border-amber-300',
      glow: 'from-amber-500/10 to-orange-500/10',
    },
    preparationTip: 'Inferir é juntar uma pista deixada pelo autor com o seu conhecimento de mundo.',
    goldenRule: 'Se o texto diz "Mariana pegou a capa de chuva e as galochas antes de abrir o portão", você infere que está chovendo lá fora, mesmo sem a palavra "chuva" dita expressamente!',
    practicalExample: {
      phrase: '"Ele apertou os olhos e olhou para o céu estrelado através da lente metálica."',
      analysis: 'Inferência: a personagem está usando um telescópio para observar os astros.',
    },
    gameApplication: 'No jogo Mago das Entrelinhas, clique nas pistas implícitas para iluminar o raciocínio dedutivo!',
  },
  {
    id: 'tema-monossilabos-tonicos',
    skillCode: 'EF05LP03',
    skillName: 'Acentuação Gráfica',
    missionId: 'acentuacao',
    missionLabel: 'Usina dos Acentos',
    title: 'Monossílabos Tônicos: Palavras de 1 Sílaba Fortes vs. Fracas',
    grammarTopic: 'Monossílabos Tônicos Acentuados',
    shortTag: 'Monossílabos',
    icon: '🎯',
    badgeColor: {
      bg: 'bg-rose-100',
      text: 'text-rose-900',
      border: 'border-rose-300',
      glow: 'from-rose-500/10 to-amber-500/10',
    },
    preparationTip: 'Palavras de uma só sílaba só levam acento se forem pronunciadas com força (tônicas).',
    goldenRule: 'Acentuamos os monossílabos tônicos terminados em -A(s), -E(s) e -O(s): pá, pé, pó, más, três, sós. Palavras como "de", "do", "ti" e "tu" não levam acento!',
    practicalExample: {
      phrase: 'Ele tem fé (acentuado) em dias melhores, mas não me dê (acentuado) ordens.',
      analysis: 'Fé e Dê são monossílabos tônicos terminados em E.',
    },
    gameApplication: 'Perfeito para o Sprint Relâmpago das Palavras, onde respostas rápidas garantem combo de pontuação!',
  },
  {
    id: 'tema-hiatos-i-u',
    skillCode: 'EF05LP03',
    skillName: 'Acentuação Gráfica',
    missionId: 'acentuacao',
    missionLabel: 'Usina dos Acentos',
    title: 'Hiatos com I e U: Quando as Vogais Ficam Solitárias na Sílaba',
    grammarTopic: 'Regra dos Hiatos Tônicos',
    shortTag: 'Hiatos',
    icon: '✨',
    badgeColor: {
      bg: 'bg-teal-100',
      text: 'text-teal-900',
      border: 'border-teal-300',
      glow: 'from-teal-500/10 to-emerald-500/10',
    },
    preparationTip: 'Hiato acontece quando duas vogais estão juntas na palavra, mas em sílabas diferentes quando separamos.',
    goldenRule: 'Acentuam-se o "I" e o "U" tônicos dos hiatos quando formam sílaba sozinhos (ou com S) e não são seguidos de NH: sa-Ú-de, ba-Ú, pa-ÍS.',
    practicalExample: {
      phrase: 'Ra-í-zes e ba-ú levam acento. Já ra-i-nha não leva por causa do NH!',
      analysis: 'O "i" de raízes está sozinho na sílaba tônica formando hiato com o "a".',
    },
    gameApplication: 'Essa regra aparece com frequência nos desafios da Usina e no Dicionário Visual!',
  },
];
