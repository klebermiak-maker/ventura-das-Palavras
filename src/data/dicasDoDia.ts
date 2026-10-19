export interface DicaDoDia {
  id: string;
  title: string;
  category: 'Acentuação' | 'Leitura Atenta' | 'Dedução' | 'Curiosidade';
  content: string;
  example?: string;
  motivationalQuote: string;
  icon: string;
  relatedSkill?: string;
}

export const DICAS_DO_DIA: DicaDoDia[] = [
  {
    id: 'dica-portao',
    title: 'O Truque do Portão para Achar a Sílaba Forte',
    category: 'Acentuação',
    content: 'Ficou em dúvida sobre qual sílaba é a mais forte? Finja que você está no portão chamando a palavra de longe! A sílaba que você esticar e falar por mais tempo é a tônica.',
    example: 'Exemplo: "Ôôô Ja-NEEEE-la!" (A sílaba "ne" é a mais forte, logo é paroxítona!)',
    motivationalQuote: 'Com esse truque divertido, você nunca mais erra a sílaba tônica!',
    icon: '🗣️',
    relatedSkill: 'EF05LP03',
  },
  {
    id: 'dica-proparoxitona',
    title: 'A Regra Mais Fácil da Língua Portuguesa',
    category: 'Acentuação',
    content: 'Guarde este segredo valioso: TODAS as palavras proparoxítonas recebem acento gráfico, sem nenhuma exceção!',
    example: 'Exemplos: MÁ-gi-co, ÁR-vo-re, PÁS-sa-ro, LÂM-pa-da.',
    motivationalQuote: 'Sempre que a antepenúltima sílaba for a mais forte, coloque o acento sem medo!',
    icon: '👑',
    relatedSkill: 'EF05LP03',
  },
  {
    id: 'dica-entrelinhas',
    title: 'O Segredo de Ler nas Entrelinhas',
    category: 'Dedução',
    content: 'Bons detetives reparam em pistas que não foram ditas. Se o texto diz que "a rua estava molhada e todos abriam capas", ninguém precisa escrever "choveu" para você saber!',
    example: 'Pista: Poças d\'água + capas = Estava chovendo.',
    motivationalQuote: 'Sua imaginação e raciocínio transformam pistas simples em grandes descobertas!',
    icon: '🕵️',
    relatedSkill: 'EF35LP04',
  },
  {
    id: 'dica-ideia-central',
    title: 'Bússola: Não Se Perca nos Detalhes!',
    category: 'Leitura Atenta',
    content: 'A ideia central é como o tronco de uma grande árvore, enquanto os pequenos detalhes são apenas as folhas. Ao resumir um texto, pergunte-se: "Do que essa história trata do começo ao fim?"',
    example: 'Não foque na cor do tênis do herói, foque na grande missão que ele realizou!',
    motivationalQuote: 'Enxergar o todo é a marca de quem lê com sabedoria.',
    icon: '🧭',
    relatedSkill: 'EF35LP03',
  },
  {
    id: 'dica-oxitonas-finais',
    title: 'O Ritmo das Oxítonas Acentuadas',
    category: 'Acentuação',
    content: 'Nem toda palavra com a última sílaba forte leva acento. Guarde a musiquinha: só acentuamos oxítonas que terminam em -A, -E, -O, -EM e -ENS!',
    example: 'Com acento: ca-FÉ, pa-ra-BÉNS, ci-PÓ. Sem acento: tam-BOR, ca-JU.',
    motivationalQuote: 'Treinar o ouvido para os acentos torna sua escrita brilhante!',
    icon: '⚡',
    relatedSkill: 'EF05LP03',
  },
  {
    id: 'dica-detetive-fatos',
    title: 'Onde, Quem e Quando: O Trio de Ouro',
    category: 'Leitura Atenta',
    content: 'Para achar respostas explícitas num piscar de olhos, procure pelas três perguntas mágicas: QUEM fez a ação, ONDE ela aconteceu e QUANDO ocorreu.',
    example: 'Sublinhe com os olhos essas palavras ao fazer a primeira leitura!',
    motivationalQuote: 'Atenção aos detalhes é o seu superpoder de leitor!',
    icon: '🔍',
    relatedSkill: 'EF15LP03',
  },
  {
    id: 'dica-palavras-curiosas',
    title: 'O Poder de Descobrir Palavras Novas',
    category: 'Curiosidade',
    content: 'Quando encontrar uma palavra desconhecida no texto, continue lendo até o final da frase. O próprio contexto costuma soprar o significado no seu ouvido!',
    example: '"O riacho límpido brilhava ao sol" -> se brilhava como água limpa, límpido só pode ser claro e transparente!',
    motivationalQuote: 'Cada palavra nova é um novo tesouro que você guarda na mente!',
    icon: '✨',
    relatedSkill: 'EF35LP04',
  },
];
