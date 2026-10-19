export interface DicaDeOuroItem {
  id: string;
  title: string;
  category: 'Ortografia' | 'Acentuação' | 'Gramática' | 'Curiosidade' | 'Pontuação';
  badgeLabel: string;
  curiosity: string;
  goldenRule: string;
  examples: {
    correct: string[];
    incorrect?: string[];
    tip?: string;
  };
  icon: string;
  skillCode: string;
  funFact?: string;
}

export const DICAS_DE_OURO: DicaDeOuroItem[] = [
  {
    id: 'dica-ouro-cedilha',
    title: 'O Mistério do "Ç": Ele Tem Medo de E e de I!',
    category: 'Ortografia',
    badgeLabel: 'Segredo Ortográfico',
    curiosity: 'Você sabia que o "Ç" (cê-cedilha) NUNCA é usado no começo de palavras e NUNCA aparece antes das letras E ou I? O C já tem som suave naturalmente antes de E e I (como em "cinema" e "cenoura"), então ele não precisa do rabinho da cedilha!',
    goldenRule: 'Ç só anda de mãos dadas com A, O e U! Com E e I, use apenas o C normal.',
    examples: {
      correct: ['Coração (com Ç antes de A/O)', 'Açúcar (com Ç antes de U)', 'Cinema (com C normal antes de I)', 'Cenoura (com C normal antes de E)'],
      incorrect: ['Cuidado: NUNCA escreva "çapato", "çidade" ou "doçe"!'],
      tip: 'Se a palavra começa com som de S, comece com S ou C, jamais com Ç!'
    },
    icon: '🐍',
    skillCode: 'EF35LP07',
    funFact: 'A cedilha nasceu na Espanha medieval! O pequeno rabinho era uma letra "z" minúscula que ficava embaixo do "c".'
  },
  {
    id: 'dica-ouro-mal-mau',
    title: 'Mal com L vs. Mau com U: O Teste do Bem e do Bom',
    category: 'Gramática',
    badgeLabel: 'Regra de Ouro',
    curiosity: 'Muitas pessoas adultas ainda confundem "mal" e "mau", mas para você será moleza! Basta usar o truque dos pares opostos: MAL é o oposto de BEM. MAU é o oposto de BOM.',
    goldenRule: 'Tocou por "BEM"? Escreva MAL com L. Trocou por "BOM"? Escreva MAU com U!',
    examples: {
      correct: [
        'Lobo MAU = Lobo BOM (com U)',
        'Ele se comportou MAL = Ele se comportou BEM (com L)',
        'Mau humor = Bom humor',
        'Dormiu mal = Dormiu bem'
      ],
      tip: 'Lembre-se da pontinha: O "U" é redondo como a letra "O" de BOM. O "L" tem perninha reta como a perninha do "M" de BEM!'
    },
    icon: '🐺',
    skillCode: 'EF35LP04',
    funFact: 'Na história do Chapeuzinho Vermelho, é o Lobo Mau (oposto de lobo bom).'
  },
  {
    id: 'dica-ouro-mas-mais',
    title: 'Mas vs. Mais: O Teste da Adição e do Porém',
    category: 'Ortografia',
    badgeLabel: 'Dica Infalível',
    curiosity: '"Mais" com I indica quantidade, adição, soma de coisas. "Mas" sem I indica oposição, contrariedade e pode ser substituído por "porém" ou "contudo".',
    goldenRule: 'Se puder trocar por "porém", use MAS. Se indicar quantidade ou o sinal matemático (+), use MAIS!',
    examples: {
      correct: [
        'Quero MAIS suco! (+ quantidade)',
        'Estudei muito, MAS ainda tenho dúvidas. (= porém)',
        'Ele é o mais rápido da turma (+ intensidade)'
      ],
      incorrect: ['Errado: "Eu queria ir, mais estava chovendo." (O certo é MAS!)'],
      tip: 'Pense no I de MAIS como o sinalzinho de "+".'
    },
    icon: '➕',
    skillCode: 'EF35LP07',
    funFact: 'A palavra "mais" vem do latim "magis", que significava maior quantidade!'
  },
  {
    id: 'dica-ouro-proparoxitona',
    title: 'A Regra Mais Amigável do Português: Proparoxítonas!',
    category: 'Acentuação',
    badgeLabel: 'Regra Absoluta',
    curiosity: 'Na língua portuguesa há muitas regras e exceções, mas aqui há uma regra perfeita e sem nenhuma pegadinha: TODAS as palavras proparoxítonas são acentuadas graficamente!',
    goldenRule: 'Contou de trás para frente e a antepenúltima sílaba é a mais forte? Coloque acento sem pestanejar!',
    examples: {
      correct: ['Ár-vo-re (antepenúltima)', 'MÁ-gi-ca (antepenúltima)', 'LÂM-pa-da (antepenúltima)', 'PÁS-sa-ro (antepenúltima)'],
      tip: 'Separe as sílabas mentalmente: última, penúltima, antepenúltima!'
    },
    icon: '👑',
    skillCode: 'EF05LP03',
    funFact: 'Até a própria palavra "pro-pa-ro-XÍ-to-na" é uma proparoxítona e leva acento!'
  },
  {
    id: 'dica-ouro-porques',
    title: 'Os 4 Porquês Desvendados sem Mistério',
    category: 'Gramática',
    badgeLabel: 'Segredo de Detetive',
    curiosity: 'O idioma português tem 4 formas de escrever "porque", cada uma com um papel especial na investigação do texto.',
    goldenRule: 'Por que (separado) = pergunta. Porque (junto) = resposta. Por quê (com chapéu) = fim de frase. Porquê (com artigo) = substantivo (o motivo).',
    examples: {
      correct: [
        'Por que você não veio ontem? (Pergunta no início)',
        'Não fui porque estava gripado. (Explicando / Resposta)',
        'Você não comeu nada... por quê? (No finalzinho da frase)',
        'Ainda não entendi o porquê de tudo isso. (O motivo / a razão)'
      ],
      tip: 'Se vier antes de ponto final ou exclamação, o "quê" ganha um chapéu!'
    },
    icon: '🔍',
    skillCode: 'EF35LP04',
    funFact: 'Em línguas como o inglês só há duas formas (Why e Because); o português é muito mais detalhista e expressivo!'
  },
  {
    id: 'dica-ouro-s-som-z',
    title: 'O Disfarce da Letra S: Quando Ela Tem Som de Z?',
    category: 'Ortografia',
    badgeLabel: 'Camuflagem Sonora',
    curiosity: 'A letra S é uma verdadeira camaleoa! Quando fica sozinha no meio de duas vogais (A, E, I, O, U), ela relaxa e ganha o som da letra Z!',
    goldenRule: 'Um S sozinho entre duas vogais soa como Z! Se quiser o som de serpente (s-s-s), precisa chamar o irmão gêmeo: SS!',
    examples: {
      correct: [
        'CaSa (o S está entre A e A -> som de Z)',
        'MúSiCa (o S está entre U e I -> som de Z)',
        'RoSa (entre O e A -> som de Z)',
        'PáSSaro (dois S para manter o som s-s-s entre duas vogais)'
      ],
      tip: 'Nenhuma palavra da língua portuguesa começa com "SS"!'
    },
    icon: '🦎',
    skillCode: 'EF35LP07',
    funFact: 'Letras vizinhas influenciam o som da voz para facilitar a pronúncia rápida.'
  },
  {
    id: 'dica-ouro-separacao-rr-ss',
    title: 'Irmãos Gêmeos "RR" e "SS" Sempre Ficam Separados!',
    category: 'Ortografia',
    badgeLabel: 'Divisão Silábica',
    curiosity: 'Os dígrafos RR e SS são como dois irmãos gêmeos muito agitados: na hora da separação silábica, eles nunca podem ficar no mesmo quarto!',
    goldenRule: 'Um R (ou S) fica na sílaba anterior e o outro vai para a sílaba seguinte.',
    examples: {
      correct: [
        'CAR-RO (um R em cada sílaba)',
        'PAS-SA-RO (um S em cada sílaba)',
        'TER-RA (um R na primeira, um na segunda)',
        'OS-SO (separados na divisão)'
      ],
      incorrect: ['Errado separar como: "ca-rro" ou "pa-ssaro"!'],
      tip: 'Diferente de CH, LH e NH, que nunca se separam, RR e SS sempre se dividem!'
    },
    icon: '✂️',
    skillCode: 'EF03LP01',
    funFact: 'Já CH, NH e LH são inseparáveis: "chu-va", "fo-lha", "ni-nho".'
  },
  {
    id: 'dica-ouro-oxitonas-finais',
    title: 'A Cantiga Mágica das Oxítonas Acentuadas',
    category: 'Acentuação',
    badgeLabel: 'Ritmo & Memória',
    curiosity: 'Nem toda palavra com a última sílaba forte leva acento gráfico! Como saber quais levam? Guarde esta melodia simples dos finais!',
    goldenRule: 'Oxítonas só levam acento se terminarem em: A(s), E(s), O(s), EM e ENS!',
    examples: {
      correct: [
        'Sofá, Guaraná (terminam em A)',
        'Café, Você (terminam em E)',
        'Cipó, Dominó (terminam em O)',
        'Também, Ninguém (terminam em EM)',
        'Parabéns, Armazéns (terminam em ENS)'
      ],
      incorrect: ['Caju, Abacaxi, Tambor não levam acento porque não terminam em A, E, O, EM ou ENS!'],
      tip: 'Se a última sílaba for forte mas terminar em I, U, L, R ou Z, geralmente não leva acento!'
    },
    icon: '🎵',
    skillCode: 'EF05LP03',
    funFact: 'As palavras "Piauí" e "baú" levam acento por uma regra diferente: a regra dos hiatos!'
  },
  {
    id: 'dica-ouro-chamando-no-portao',
    title: 'O Truque do Portão para Achar a Sílaba Tônica',
    category: 'Curiosidade',
    badgeLabel: 'Técnica Ninja',
    curiosity: 'Está em dúvida sobre qual é a sílaba tônica (mais forte) de uma palavra? Finja que você está na calçada chamando seu amigo no portão!',
    goldenRule: 'A sílaba que você naturalmente esticar e gritar por mais tempo é a sílaba mais forte (tônica)!',
    examples: {
      correct: [
        'Ôôô ca-CHORRR-ro! (CHOR é a mais forte -> Paroxítona)',
        'Ôôô ja-NEEE-la! (NE é a mais forte -> Paroxítona)',
        'Ôôô ma-ra-cu-JÁÁÁ! (JÁ é a mais forte -> Oxítona)',
        'Ôôô MÁÁÁ-gi-co! (MÁ é a mais forte -> Proparoxítona)'
      ],
      tip: 'Faça o teste com seu próprio nome e descubra qual sílaba você estica mais!'
    },
    icon: '🗣️',
    skillCode: 'EF05LP03',
    funFact: 'Todos os locutores de rádio e dubladores usam esse mesmo exercício de projeção de voz!'
  },
  {
    id: 'dica-ouro-h-mudo',
    title: 'A Letra H: O Silêncio que Transforma Tudo!',
    category: 'Ortografia',
    badgeLabel: 'Curiosidade Especial',
    curiosity: 'O "H" é a única letra do nosso alfabeto que não tem nenhum som próprio quando fica no comecinho das palavras. Mas quando se junta com C, L ou N, ganha superpoderes!',
    goldenRule: 'No início da palavra o H é silencioso (Hoje, Hora, História). Com C, L e N, forma os dígrafos CH, LH e NH!',
    examples: {
      correct: [
        'Hora (som da vogal O)',
        'Hélice (som da vogal E)',
        'Bico + H = Bicho! (ganha som de X)',
        'Mola + H = Molha!',
        'Sono + H = Sonho!'
      ],
      tip: 'Nunca coloque acento no H, pois ele não é vogal!'
    },
    icon: '🤫',
    skillCode: 'EF15LP03',
    funFact: 'No latim antigo, o H era pronunciado com um leve sopro vindo da garganta, parecido com o som da risada "hahaha".'
  },
  {
    id: 'dica-ouro-onde-aonde',
    title: 'Onde vs. Aonde: Quem Fica Parado e Quem Anda?',
    category: 'Gramática',
    badgeLabel: 'Regra de Movimento',
    curiosity: 'Muitos confundem "onde" e "aonde". A diferença é sobre movimento versus lugar fixo!',
    goldenRule: 'Quem está paradinho usa ONDE (lugar fixo). Quem está se deslocando em direção a algum lugar usa AONDE (com ideia de "ir a")!',
    examples: {
      correct: [
        'ONDE estão meus livros? (estão parados em algum lugar)',
        'ONDE você mora? (moradia é um ponto fixo)',
        'AONDE você vai com tanta pressa? (ideia de caminhar / movimento)',
        'Não sei AONDE essa estrada nos levará. (direção de viagem)'
      ],
      tip: 'Substitua mentalmente: se couber "Para onde?", use "Aonde"!'
    },
    icon: '🧭',
    skillCode: 'EF35LP04',
    funFact: 'A preposição "a" colou na palavra "onde" para indicar o destino de quem viaja!'
  },
  {
    id: 'dica-ouro-agudo-circunflexo',
    title: 'Vovô vs. Vovó: O Chapéu Fechado e o Grampo Aberto',
    category: 'Acentuação',
    badgeLabel: 'Diferença Sonora',
    curiosity: 'O acento agudo (´) e o acento circunflexo (^) mudam completamente o timbre e o sentido da palavra.',
    goldenRule: 'Acento agudo (´) abre a boca e faz o som aberto (Vovó, Picolé, Café). Circunflexo (^) fecha o som e soa pelo nariz ou garganta (Vovô, Robô, Lâmpada)!',
    examples: {
      correct: [
        'Vovó tem o grampinho de cabelo na cabeça (som aberto: Ó)',
        'Vovô usa o chapeuzinho na cabeça (som fechado: Ô)',
        'Mês (fechado) vs. Pé (aberto)',
        'Três (fechado) vs. Chá (aberto)'
      ],
      tip: 'Se sua boca abre bastante ao falar a vogal, use o agudo!'
    },
    icon: '🎩',
    skillCode: 'EF05LP03',
    funFact: 'O nome "circunflexo" vem do grego e significa "dobrado ao redor", por causa da curvinha do chapeuzinho.'
  },
  {
    id: 'dica-ouro-pontuacao-vida',
    title: 'Os Sinais de Pontuação São a Respiração e a Voz do Texto',
    category: 'Pontuação',
    badgeLabel: 'Expressão & Leitura',
    curiosity: 'Um texto sem pontuação seria como uma pessoa falando sem respirar e sem expressão no rosto! A pontuação avisa como entoar as palavras.',
    goldenRule: 'O ponto final (.) encerra o pensamento. O ponto de interrogação (?) faz perguntas curiosas. O ponto de exclamação (!) expressa susto, alegria ou ordem!',
    examples: {
      correct: [
        'Você vai à festa. (Afirmação calma)',
        'Você vai à festa? (Pergunta curiosa)',
        'Você vai à festa! (Alegria ou ordem entusiasmada)',
        'As reticências (...) deixam um mistério no ar...'
      ],
      tip: 'Ao ler em voz alta, faça uma pequena pausa a cada vírgula e uma pausa maior a cada ponto final.'
    },
    icon: '🎭',
    skillCode: 'EF15LP03',
    funFact: 'A vírgula salva vidas! Veja a diferença: "Vamos comer, crianças!" (convite gostoso) vs. "Vamos comer crianças!" (história de monstros assustadores!).'
  },
  {
    id: 'dica-ouro-tem-plural',
    title: 'Ele TEM vs. Eles TÊM: O Chapéu Mágico do Plural',
    category: 'Gramática',
    badgeLabel: 'Acento Diferencial',
    curiosity: 'Como distinguir se uma ou várias pessoas possuem algo quando o som do verbo é o mesmo? O acento circunflexo entra em ação!',
    goldenRule: 'No singular, TEM e VEM não levam acento. No plural, TÊM e VÊM ganham o acento circunflexo!',
    examples: {
      correct: [
        'O menino TEM uma bola de futebol. (1 pessoa -> sem acento)',
        'Os meninos TÊM muitas bolas de futebol. (várias pessoas -> com circunflexo)',
        'Ela VEM de longe. (singular -> sem acento)',
        'Elas VÊM de longe. (plural -> com circunflexo)'
      ],
      tip: 'Um sujeito só = sem chapéu. Dois ou mais sujeitos = o chapéu do plural aparece!'
    },
    icon: '⚽',
    skillCode: 'EF05LP03',
    funFact: 'Esse é um dos raros casos da Língua Portuguesa onde o acento existe apenas para diferenciar o singular do plural.'
  },
  {
    id: 'dica-ouro-maiusculas-proprios',
    title: 'Por Que Seu Nome Sempre Merece Letra Maiúscula?',
    category: 'Ortografia',
    badgeLabel: 'Respeito aos Nomes',
    curiosity: 'Substantivos comuns (gato, bola, cidade, rio) usam letras minúsculas. Mas substantivos próprios dão uma identidade única no mundo e exigem letra MAIÚSCULA!',
    goldenRule: 'Nomes de pessoas, cidades, países, escolas, rios e planetas sempre começam com letra MAIÚSCULA, assim como o início de qualquer frase!',
    examples: {
      correct: [
        'meu amigo Lucas mora no Brasil (Lucas e Brasil com maiúscula)',
        'Escola Municipal Monteiro Lobato',
        'O rio Amazonas é gigante (Amazonas com maiúscula)'
      ],
      tip: 'Depois de um ponto final, a próxima palavra sempre começa com letra maiúscula!'
    },
    icon: '✨',
    skillCode: 'EF35LP07',
    funFact: 'Na Idade Média, os livros eram escritos à mão e os monges desenhavam a primeira letra maiúscula com tintas douradas e desenhos de flores!'
  }
];
