import { BNCCSkillInfo, ReadingText, ExplicitQuestion, CentralIdeaQuestion, ImplicitQuestion, SyllableExercise } from '../types/game';

export const BNCC_SKILLS_INFO: Record<string, BNCCSkillInfo> = {
  EF15LP03: {
    code: 'EF15LP03',
    title: 'Detetive de Fatos',
    shortDesc: 'Localizar informações explícitas no texto.',
    badgeName: 'Detetive de Fatos',
    colorScheme: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      text: 'text-emerald-800',
      accent: 'emerald',
    },
  },
  EF35LP03: {
    code: 'EF35LP03',
    title: 'Bússola do Tema',
    shortDesc: 'Identificar a ideia central e compreensão global.',
    badgeName: 'Mestre da Ideia Central',
    colorScheme: {
      bg: 'bg-sky-50',
      border: 'border-sky-200',
      text: 'text-sky-800',
      accent: 'sky',
    },
  },
  EF35LP04: {
    code: 'EF35LP04',
    title: 'Mago das Entrelinhas',
    shortDesc: 'Deduza pistas ocultas, sentimentos e intenções em histórias e contos.',
    badgeName: 'Mago das Entrelinhas',
    colorScheme: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-800',
      accent: 'amber',
    },
  },
  EF05LP03: {
    code: 'EF05LP03',
    title: 'Usina dos Acentos',
    shortDesc: 'Acentuar oxítonas, paroxítonas e proparoxítonas.',
    badgeName: 'Campeão da Acentuação',
    colorScheme: {
      bg: 'bg-indigo-50',
      border: 'border-indigo-200',
      text: 'text-indigo-800',
      accent: 'indigo',
    },
  },
};

// =========================================================================
// 1. TEXTOS EXCLUSIVOS DA MISSÃO 1: DETETIVE DOS FATOS (EF15LP03)
// =========================================================================
export const EXPLICIT_TEXTS: ReadingText[] = [
  {
    id: 'tatu-bola',
    title: 'O Resgate do Pequeno Tatu-Bola',
    genre: 'Crônica',
    authorOrSource: 'Revista Ciência & Aventura para Crianças',
    themeIcon: '🐾',
    paragraphs: [
      {
        id: 1,
        text: 'Em uma manhã ensolarada de terça-feira no sertão da Caatinga, a bióloga Marina e o jovem aprendiz Tiago caminhavam pelas trilhas de terra avermelhada. Eles carregavam uma caderneta azul, uma bússola e duas garrafas de água fresca para registrar a fauna local.',
        highlightClue: 'terça-feira no sertão da Caatinga',
      },
      {
        id: 2,
        text: 'De repente, perto da raiz de um juazeiro centenário, Tiago avistou algo curioso: uma esfera perfeita de cor marrom-amarelada, do tamanho aproximado de uma bola de tênis. Ao se aproximarem com passos suaves, a bolinha desenrolou lentamente seu focinho pontudo e exibiu três faixas flexíveis em sua carapaça.',
        highlightClue: 'esfera perfeita de cor marrom-amarelada, do tamanho aproximado de uma bola de tênis',
      },
      {
        id: 3,
        text: '— É um tatu-bola-da-caatinga! — sussurrou Marina maravilhada. — Esta espécie tem a incrível habilidade de se fechar por completo para se defender dos predadores, como a onça e o gavião. Diferente de outros tatus, ele não cava tocas profundas.',
        highlightClue: 'habilidade de se fechar por completo para se defender dos predadores',
      },
      {
        id: 4,
        text: 'O bichinho parecia apenas desorientado pelo calor das dez horas. Marina colocou algumas gotas de água perto de uma folha larga e o pequeno animal bebeu com calma antes de sumir entre os arbustos protegidos do parque nacional.',
        highlightClue: 'Marina colocou algumas gotas de água perto de uma folha larga',
      },
    ],
  },
  {
    id: 'serra-capivara',
    title: 'A Expedição Arqueológica na Serra da Capivara',
    genre: 'Curiosidade Científica',
    authorOrSource: 'Boletim Museu do Homem Americano',
    themeIcon: '🏺',
    paragraphs: [
      {
        id: 1,
        text: 'No sul do estado do Piauí, a arqueóloga Dra. Helena liderou uma equipe de cinco pesquisadores até o Boqueirão da Pedra Furada. A expedição ocorreu em uma quinta-feira fria de julho, com ventos fortes que sopravam sobre os imensos paredões de arenito.',
        highlightClue: 'sul do estado do Piauí, a arqueóloga Dra. Helena liderou uma equipe de cinco pesquisadores',
      },
      {
        id: 2,
        text: 'Ao inspecionarem o terceiro abrigo rochoso, eles catalogaram dezenas de pinturas avermelhadas feitas com óxido de ferro há mais de doze mil anos, representando bandos de cervos e capivaras em movimento dinâmico.',
        highlightClue: 'feitas com óxido de ferro há mais de doze mil anos, representando bandos de cervos e capivaras',
      },
      {
        id: 3,
        text: 'Com pincéis macios e trenas digitais, os cientistas mediram cada detalhe das figuras rupestres. Eles registraram em seus cadernos eletrônicos que as figuras humanas tinham alturas entre dez e quinze centímetros.',
        highlightClue: 'as figuras humanas tinham alturas entre dez e quinze centímetros',
      },
    ],
  },
  {
    id: 'tartaruga-marinha',
    title: 'O Nascimento na Praia das Tartarugas',
    genre: 'Notícia Escolar',
    authorOrSource: 'Jornal Eco-Escola Fernando de Noronha',
    themeIcon: '🐢',
    paragraphs: [
      {
        id: 1,
        text: 'Na última lua cheia de setembro, alunos da Escola Arquipélago acompanharam o projeto Tamar na Praia do Leão. Sob a luz suave da lua, uma tartaruga-de-pente subiu a areia morna após vencer as ondas calmas da maré baixa.',
        highlightClue: 'uma tartaruga-de-pente subiu a areia morna',
      },
      {
        id: 2,
        text: 'Com suas nadadeiras traseiras, a fêmea escavou pacientemente um buraco de cinquenta centímetros de profundidade. Em seguida, depositou com cuidado cento e vinte e oito ovos redondos antes de cobrir o ninho com areia seca.',
        highlightClue: 'depositou com cuidado cento e vinte e oito ovos redondos',
      },
      {
        id: 3,
        text: 'Os monitores ambientais cercaram a área com estacas de madeira sustentável e fixaram a placa de número quarenta e dois para garantir que os filhotes nasçam em segurança daqui a cinquenta dias.',
        highlightClue: 'fixaram a placa de número quarenta e dois',
      },
    ],
  },
  {
    id: 'robo-sucatinha',
    title: 'O Robô Inventor da Feira de Ciências',
    genre: 'Notícia Escolar',
    authorOrSource: 'Mural Estudantil da Escola Municipal',
    themeIcon: '🤖',
    paragraphs: [
      {
        id: 1,
        text: 'Na tarde de quarta-feira, a turma do quarto ano B apresentou seu projeto mais aplaudido na Feira de Ciências e Sustentabilidade: o robô Sucatinha, construído inteiramente com materiais reaproveitados arrecadados na escola.',
        highlightClue: 'turma do quarto ano B apresentou seu projeto mais aplaudido',
      },
      {
        id: 2,
        text: 'A carcaça do robô foi montada com seis latinhas de refrigerante de alumínio, duas tampinhas de garrafa PET e rodas de carrinho quebrado. A estrutura recebeu pintura ecológica azul à base de água.',
        highlightClue: 'seis latinhas de refrigerante de alumínio, duas tampinhas de garrafa PET e rodas de carrinho quebrado',
      },
      {
        id: 3,
        text: 'Alimentado por uma única bateria recarregável de nove volts, o robozinho era capaz de varrer pequenas folhas secas caídas nos corredores da escola usando uma escova de cerdas de sisal.',
        highlightClue: 'alimentado por uma única bateria recarregável de nove volts',
      },
    ],
  },
  {
    id: 'festival-pipas',
    title: 'O Grande Festival de Pipas de Santo André',
    genre: 'Crônica',
    authorOrSource: 'Caderno Regional do ABC',
    themeIcon: '🪁',
    paragraphs: [
      {
        id: 1,
        text: 'O céu do Parque Central de Santo André ganhou cores vibrantes no último domingo ensolarado. Mais de duzentos e cinquenta participantes se reuniram no gramado aberto para a décima quinta edição do Festival de Pipas Ecológicas sem Cerol.',
        highlightClue: 'Mais de duzentos e cinquenta participantes se reuniram no gramado aberto',
      },
      {
        id: 2,
        text: 'O grande destaque da tarde foi a pipa confeccionada pelo aposentado Seu Manoel, de sessenta e oito anos. Ele levou três semanas inteiras para construir um dragão alado de seis metros de comprimento, utilizando varetas de taquara tratada e folhas de papel de seda amarelo e verde.',
        highlightClue: 'Seu Manoel, de sessenta e oito anos, construiu um dragão de seis metros de comprimento',
      },
      {
        id: 3,
        text: 'A comissão julgadora avaliou quesitos como beleza estética, estabilidade no voo e altura máxima atingida, premiando o dragão gigante com o troféu Estrela dos Ventos.',
        highlightClue: 'premiando o dragão gigante com o troféu Estrela dos Ventos',
      },
    ],
  },
];

// EF15LP03: Questões Explícitas com Alternativas Plausíveis e Apoio Progressivo
export const EXPLICIT_QUESTIONS: ExplicitQuestion[] = [
  {
    id: 'exp-1',
    textId: 'tatu-bola',
    paragraphRef: 1,
    question: 'Em que dia da semana e em qual bioma Marina e Tiago realizavam a expedição?',
    clueWord: 'terça-feira no sertão da Caatinga',
    progressiveHint: {
      level1Guidance: 'Releia o primeiro parágrafo buscando o dia em que eles caminhavam e o nome da vegetação típica.',
      level2Paragraph: 1,
      level3Excerpt: 'Em uma manhã ensolarada de terça-feira no sertão da Caatinga...',
    },
    options: [
      {
        id: 'opt-exp1-caatinga',
        text: 'Na terça-feira, no sertão da Caatinga.',
        isCorrect: true,
        explanation: 'Muito bem! No primeiro parágrafo está escrito com clareza: "Em uma manhã ensolarada de terça-feira no sertão da Caatinga".',
      },
      {
        id: 'opt-exp1-cerrado',
        text: 'Na quinta-feira, no planalto do Cerrado.',
        isCorrect: false,
        explanation: 'Atenção aos dados: o texto afirma que a caminhada ocorria numa terça-feira e no bioma da Caatinga.',
      },
      {
        id: 'opt-exp1-pantanal',
        text: 'Na quarta-feira, nas matas do Pantanal.',
        isCorrect: false,
        explanation: 'Releia o parágrafo inicial. O dia era terça-feira e o bioma percorrido era a Caatinga.',
      },
      {
        id: 'opt-exp1-mata',
        text: 'No sábado de manhã, na serra da Mata Atlântica.',
        isCorrect: false,
        explanation: 'Essa informação não consta no texto. O bioma visitado pelos pesquisadores era a Caatinga.',
      },
    ],
  },
  {
    id: 'exp-2',
    textId: 'serra-capivara',
    paragraphRef: 2,
    question: 'Há quanto tempo foram feitas as pinturas rupestres encontradas e quais animais elas representavam?',
    clueWord: 'há mais de doze mil anos, representando bandos de cervos e capivaras',
    progressiveHint: {
      level1Guidance: 'Verifique no texto a datação em milhares de anos e os dois animais típicos retratados.',
      level2Paragraph: 2,
      level3Excerpt: 'feitas com óxido de ferro há mais de doze mil anos, representando bandos de cervos e capivaras',
    },
    options: [
      {
        id: 'opt-exp2-cervos',
        text: 'Há mais de doze mil anos, representando bandos de cervos e capivaras.',
        isCorrect: true,
        explanation: 'Exato! O parágrafo 2 confirma explicitamente: "feitas com óxido de ferro há mais de doze mil anos, representando bandos de cervos e capivaras".',
      },
      {
        id: 'opt-exp2-aves',
        text: 'Há mais de doze mil anos, representando revoadas de araras e tatus.',
        isCorrect: false,
        explanation: 'Observe com atenção: os animais catalogados no abrigo foram cervos e capivaras, não aves.',
      },
      {
        id: 'opt-exp2-peixes',
        text: 'Há cerca de cinco mil anos, retratando cardumes de peixes e jacarés.',
        isCorrect: false,
        explanation: 'A datação arqueológica do texto indica mais de doze mil anos com cervos e capivaras.',
      },
      {
        id: 'opt-exp2-oncas',
        text: 'Há dois mil anos, ilustrando caçadas a bandos de onças e macacos.',
        isCorrect: false,
        explanation: 'Releia o segundo parágrafo: as figuras mostram cervos e capivaras com mais de doze mil anos.',
      },
    ],
  },
  {
    id: 'exp-3',
    textId: 'tartaruga-marinha',
    paragraphRef: 2,
    question: 'Quantos ovos a tartaruga-de-pente depositou no ninho na Praia do Leão?',
    clueWord: 'cento e vinte e oito ovos redondos',
    progressiveHint: {
      level1Guidance: 'Procure o número exato de ovos colocados no ninho escavado na areia.',
      level2Paragraph: 2,
      level3Excerpt: 'depositou com cuidado cento e vinte e oito ovos redondos...',
    },
    options: [
      {
        id: 'opt-exp3-cinquenta',
        text: 'Cinquenta ovos redondos na areia da praia.',
        isCorrect: false,
        explanation: 'Cinquenta centímetros era a profundidade do buraco escavado, não a quantidade de ovos!',
      },
      {
        id: 'opt-exp3-correto',
        text: 'Cento e vinte e oito ovos redondos.',
        isCorrect: true,
        explanation: 'Correto! No parágrafo 2 está escrito de forma explícita: "depositou com cuidado cento e vinte e oito ovos redondos".',
      },
      {
        id: 'opt-exp3-quarenta',
        text: 'Quarenta e dois ovos catalogados pela equipe.',
        isCorrect: false,
        explanation: 'Quarenta e dois é o número da placa de monitoramento colocada na cerca pelos biólogos.',
      },
      {
        id: 'opt-exp3-cem',
        text: 'Cem ovos distribuídos em duas covas.',
        isCorrect: false,
        explanation: 'O número exato registrado pelos monitores ambientais foi cento e vinte e oito ovos.',
      },
    ],
  },
  {
    id: 'exp-4',
    textId: 'robo-sucatinha',
    paragraphRef: 2,
    question: 'Quais materiais da reciclagem escolar formavam o corpo do robô Sucatinha?',
    clueWord: 'seis latinhas de refrigerante de alumínio, duas tampinhas de garrafa PET e rodas de carrinho',
    progressiveHint: {
      level1Guidance: 'Consulte a lista dos itens de sucata reaproveitados pelos alunos para a carcaça.',
      level2Paragraph: 2,
      level3Excerpt: 'seis latinhas de refrigerante de alumínio, duas tampinhas de garrafa PET e rodas de carrinho quebrado...',
    },
    options: [
      {
        id: 'opt-exp4-correto',
        text: 'Seis latinhas de alumínio, duas tampinhas PET e rodas de carrinho.',
        isCorrect: true,
        explanation: 'Perfeito! No parágrafo 2 temos todos esses detalhes descritos passo a passo.',
      },
      {
        id: 'opt-exp4-papelao',
        text: 'Três caixas de papelão grosso, copos descartáveis e rolhas de cortiça.',
        isCorrect: false,
        explanation: 'A carcaça foi feita com latinhas de alumínio, tampinhas PET e rodinhas de carrinho.',
      },
      {
        id: 'opt-exp4-potes',
        text: 'Quatro potes de iogurte plástico, canudos de papel e arames finos.',
        isCorrect: false,
        explanation: 'Releia o parágrafo 2: o texto cita latinhas de refrigerante, tampinhas de garrafa e rodinhas.',
      },
      {
        id: 'opt-exp4-madeira',
        text: 'Blocos de madeira compensada, pregos pequenos e tubos de metal.',
        isCorrect: false,
        explanation: 'Os alunos reaproveitaram materiais recicláveis leves: latinhas de alumínio e tampinhas.',
      },
    ],
  },
  {
    id: 'exp-5',
    textId: 'festival-pipas',
    paragraphRef: 2,
    question: 'Quantos anos tem Seu Manoel e qual o tamanho da pipa dragão que ele construiu?',
    clueWord: 'sessenta e oito anos, construiu um dragão de seis metros de comprimento',
    progressiveHint: {
      level1Guidance: 'Localize a idade do construtor e a medida em metros da pipa premiada no festival.',
      level2Paragraph: 2,
      level3Excerpt: 'Seu Manoel, de sessenta e oito anos... dragão alado de seis metros de comprimento...',
    },
    options: [
      {
        id: 'opt-exp5-correto',
        text: 'Sessenta e oito anos de idade e seis metros de comprimento.',
        isCorrect: true,
        explanation: 'Excelente! No parágrafo 2 está escrito: "Seu Manoel, de sessenta e oito anos... dragão alado de seis metros de comprimento".',
      },
      {
        id: 'opt-exp5-trinta',
        text: 'Sessenta e oito anos de idade e três metros de envergadura.',
        isCorrect: false,
        explanation: 'Três semanas foi o tempo que ele levou para montar a pipa; o comprimento era de seis metros.',
      },
      {
        id: 'opt-exp5-setenta',
        text: 'Setenta e cinco anos de idade e dez metros de cauda colorida.',
        isCorrect: false,
        explanation: 'A idade correta no parágrafo 2 é sessenta e oito anos e o dragão media seis metros.',
      },
      {
        id: 'opt-exp5-quinze',
        text: 'Cinquenta anos de idade e quinze metros de linha especial.',
        isCorrect: false,
        explanation: 'O número quinze refere-se à décima quinta edição do festival, não à medida da pipa.',
      },
    ],
  },
];

// =========================================================================
// 2. TEXTOS EXCLUSIVOS DA MISSÃO 2: A BÚSSOLA DO TEMA (EF35LP03)
// =========================================================================
export const CENTRAL_IDEA_TEXTS: ReadingText[] = [
  {
    id: 'telescopio-marina',
    title: 'A Primeira Noite Sob o Céu Estrelado',
    genre: 'Crônica',
    authorOrSource: 'Jornal Infantojuvenil Cosmos',
    themeIcon: '🔭',
    paragraphs: [
      {
        id: 1,
        text: 'Na quadra esportiva da escola, cinquenta crianças aguardavam ansiosas enquanto o professor Marcelo ajustava o tripé de um telescópio refletor. Vestidas com casacos quentes e segurando lanternas de luz vermelha, elas conversavam baixinho sobre planetas e constelações distantes.',
      },
      {
        id: 2,
        text: 'Quando a primeira aluna olhou pela ocular, um suspiro coletivo tomou conta do pátio: os anéis dourados de Saturno brilhavam com uma nitidez fascinante no céu límpido. Uma a uma, as crianças compartilharam a sensação de descobrir a imensidão do cosmos.',
      },
      {
        id: 3,
        text: 'Ao término do encontro, o professor reuniu a turma e lembrou que observar o céu não é apenas aprender fórmulas, mas aprender a valorizar a nossa própria Terra, o único lar compartilhado por todos os seres vivos no universo.',
      },
    ],
  },
  {
    id: 'colibri-valente',
    title: 'O Pequeno Colibri e a Grande Floresta',
    genre: 'Fábula',
    authorOrSource: 'Contos Tradicionais Recontados',
    themeIcon: '🦜',
    paragraphs: [
      {
        id: 1,
        text: 'Um grande incêndio começou na floresta amazônica e os animais apavorados fugiram em disparada para a outra margem do rio largo. Onças, antas e macacos corriam sem olhar para trás, temendo que o fogo consumisse tudo.',
      },
      {
        id: 2,
        text: 'No entanto, um pequenino colibri voava sem parar do rio até as chamas, carregando em seu bico apenas uma gota de água por viagem. Os animais maiores começaram a rir de seu esforço, dizendo que aquela atitude não apagaria nada.',
      },
      {
        id: 3,
        text: 'O pássaro parou no ar por um segundo e respondeu com firmeza: "Eu sei que não vou apagar o fogo sozinho, mas estou fazendo a minha parte". Comovidos com o exemplo de bravura, os outros animais começaram a trazer água em conchas e folhas, contendo as chamas juntos.',
      },
    ],
  },
  {
    id: 'ponte-reconciliacao',
    title: 'A Velha Ponte de Cedro',
    genre: 'Crônica',
    authorOrSource: 'Histórias do Vale Verde',
    themeIcon: '🌉',
    paragraphs: [
      {
        id: 1,
        text: 'Durante décadas, os moradores da Vila das Flores e da Vila das Pedras não conversavam entre si por causa de uma antiga discussão sobre limites de terra. Entre as duas vilas, havia apenas um riacho raso e uma ponte de cedro abandonada.',
      },
      {
        id: 2,
        text: 'Após uma forte tempestade arrancar metade das tábuas da ponte, os jovens estudantes de ambas as margens decidiram que já era hora de colocar um ponto final naquela divisão sem sentido.',
      },
      {
        id: 3,
        text: 'Sem avisar os adultos, eles trouxeram ferramentas e tábuas novas. Ao final da tarde, a ponte estava firme e enfeitada com flores. Quando os pais chegaram, encontraram todos convivendo em harmonia, provando que a união constrói caminhos onde o orgulho só cria barreiras.',
      },
    ],
  },
  {
    id: 'guardiao-sementes',
    title: 'O Guardião das Sementes Crioulas',
    genre: 'Curiosidade Científica',
    authorOrSource: 'Boletim Agroecologia & Vida',
    themeIcon: '🌽',
    paragraphs: [
      {
        id: 1,
        text: 'No alto da Serra da Mantiqueira vive Seu Benedito, um agricultor que guarda em potes de barro mais de cinquenta variedades de sementes tradicionais de milho roxo, abóbora e feijão cultivadas por várias gerações.',
      },
      {
        id: 2,
        text: 'Enquanto muitas fazendas modernas utilizam apenas sementes padronizadas dependentes de defensivos, Seu Benedito troca sementes nativas com escolas e vizinhos para manter vivas as plantas tradicionais.',
      },
      {
        id: 3,
        text: 'Para ele, preservar essas sementes antigas é proteger a história cultural dos povos, garantir alimentos mais nutritivos e assegurar a biodiversidade para as gerações que ainda vão nascer.',
      },
    ],
  },
  {
    id: 'menino-cores',
    title: 'O Menino que Coloria o Vento',
    genre: 'Crônica',
    authorOrSource: 'Revista Letras Infantis',
    themeIcon: '🎨',
    paragraphs: [
      {
        id: 1,
        text: 'O bairro de Vila Cinzenta recebia esse nome porque quase todos os muros eram de cimento sem pintura e os moradores andavam de cabeça baixa, apressados para seus afazeres, sem trocar cumprimentos.',
      },
      {
        id: 2,
        text: 'Num sábado ensolarado, o garoto Gael reuniu sobras de tintas descartadas e pintou na parede do ponto de ônibus um grande girassol acompanhado da frase: "Você já olhou para o céu hoje?".',
      },
      {
        id: 3,
        text: 'Aquele desenho inspirou a comunidade: vizinhos começaram a sorrir, conversar e trazer seus próprios pincéis. Em poucas semanas, o cinza deu lugar à arte comunitária, mostrando como pequenas atitudes generosas renovam a convivência humana.',
      },
    ],
  },
];

// EF35LP03: Questões de Ideia Central com Alternativas Plausíveis e Equilibradas
export const CENTRAL_IDEA_QUESTIONS: CentralIdeaQuestion[] = [
  {
    id: 'central-1',
    textId: 'telescopio-marina',
    question: 'Qual mensagem principal o autor deseja transmitir com a crônica da noite astronômica?',
    bestHeadlineQuestion: 'Qual opção expressa o sentido global de toda a reportagem escolar?',
    learningTip: 'Dica da Bússola: Observe a conclusão do professor Marcelo sobre o objetivo de olhar para o céu.',
    progressiveHint: {
      level1Guidance: 'A ideia central resume todo o texto: não se prenda a detalhes como casacos ou tripés.',
      level2Paragraph: 3,
      level3Excerpt: 'Ao término do encontro, o professor reuniu a turma e lembrou que observar o céu não é apenas aprender fórmulas, mas aprender a valorizar a nossa própria Terra...',
    },
    options: [
      {
        id: 'opt-c1-correto',
        text: 'A astronomia estimula o encanto pela ciência e a consciência de preservação do nosso planeta.',
        isCorrect: true,
        explanation: 'Sensacional! O texto mostra como a noite de observação serviu para conectar as crianças com o universo e despertar o cuidado com a Terra.',
      },
      {
        id: 'opt-c1-roupas',
        text: 'A necessidade de usar casacos reforçados e lanternas vermelhas em noites frias de estudo.',
        isCorrect: false,
        explanation: 'As roupas e lanternas são detalhes secundários do cenário, não a mensagem central do texto.',
      },
      {
        id: 'opt-c1-pecas',
        text: 'O passo a passo técnico para montar o tripé de um telescópio refletor no pátio escolar.',
        isCorrect: false,
        explanation: 'O texto não é um manual de montagem; o foco é o aprendizado humano e científico da experiência.',
      },
      {
        id: 'opt-c1-horario',
        text: 'A importância de fechar os portões da escola antes das dez horas em atividades noturnas.',
        isCorrect: false,
        explanation: 'O horário é um detalhe de rotina que não resume o propósito inspirador do evento.',
      },
    ],
  },
  {
    id: 'central-2',
    textId: 'colibri-valente',
    question: 'Qual é o ensinamento (moral) central presente na fábula do colibri na Amazônia?',
    bestHeadlineQuestion: 'Se você fosse dar um subtítulo para a fábula do colibri, qual seria o mais adequado?',
    learningTip: 'Dica da Bússola: Pense na lição que a resposta do colibri ensinou a todos os animais da floresta.',
    progressiveHint: {
      level1Guidance: 'Identifique o ensinamento ético da fábula, percebendo como a atitude do pequeno pássaro inspirou os outros.',
      level2Paragraph: 3,
      level3Excerpt: 'Eu sei que não vou apagar o fogo sozinho, mas estou fazendo a minha parte... Comovidos com o exemplo de bravura, os outros animais começaram a trazer água...',
    },
    options: [
      {
        id: 'opt-c2-correto',
        text: 'Cada um deve fazer sua parte com dedicação, pois ações exemplares inspiram a união coletiva.',
        isCorrect: true,
        explanation: 'Excelente! A atitude do pequeno colibri demonstra responsabilidade individual que mobilizou todo o grupo.',
      },
      {
        id: 'opt-c2-fuga',
        text: 'Animais menores devem se afastar rapidamente quando os animais maiores começarem a correr.',
        isCorrect: false,
        explanation: 'A moral da fábula valoriza a coragem e a iniciativa, e não a fuga individual.',
      },
      {
        id: 'opt-c2-rio',
        text: 'A água do rio é o recurso natural mais importante para a segurança dos pássaros amazônicos.',
        isCorrect: false,
        explanation: 'O rio é apenas parte do cenário; a ideia central é a solidariedade e o esforço conjunto.',
      },
      {
        id: 'opt-c2-velocidade',
        text: 'A velocidade do bater de asas determina o sucesso de uma missão contra as forças da natureza.',
        isCorrect: false,
        explanation: 'O valor da história está na determinação moral e na cooperação, não na rapidez física.',
      },
    ],
  },
  {
    id: 'central-3',
    textId: 'ponte-reconciliacao',
    question: 'Qual é a ideia central defendida pela história das duas vilas vizinhas?',
    bestHeadlineQuestion: 'Qual manchete melhor sintetiza os acontecimentos desta crônica comunitária?',
    learningTip: 'Dica da Bússola: Pense no contraste entre o orgulho dos adultos e a iniciativa dos jovens.',
    progressiveHint: {
      level1Guidance: 'Busque a mensagem sobre convivência e diálogo que a reforma da ponte trouxe aos dois lados.',
      level2Paragraph: 3,
      level3Excerpt: 'provando que a união constrói caminhos onde o orgulho só cria barreiras.',
    },
    options: [
      {
        id: 'opt-c3-correto',
        text: 'O diálogo e a colaboração constroem laços e superam divergências históricas entre as pessoas.',
        isCorrect: true,
        explanation: 'Perfeito! A reconstrução da ponte é uma metáfora para a reaproximação pacífica entre as comunidades.',
      },
      {
        id: 'opt-c3-madeira',
        text: 'A madeira de cedro é a mais indicada para resistir a tempestades fortes de verão no campo.',
        isCorrect: false,
        explanation: 'O tipo de madeira é um elemento descritivo, não o tema central sobre amizade e reconciliação.',
      },
      {
        id: 'opt-c3-tempestade',
        text: 'Os temporais de verão causam prejuízos frequentes aos riachos das cidades do interior.',
        isCorrect: false,
        explanation: 'A tempestade foi apenas o acontecimento que motivou os jovens a agirem; a ideia central é a harmonia comunitária.',
      },
      {
        id: 'opt-c3-plantacoes',
        text: 'A demarcação exata dos limites agrícolas deve ser feita com cercas altas de arame farpado.',
        isCorrect: false,
        explanation: 'O texto critica as divisões sem sentido e elogia a união dos jovens que derrubaram essas barreiras.',
      },
    ],
  },
  {
    id: 'central-4',
    textId: 'guardiao-sementes',
    question: 'Por que o trabalho de Seu Benedito é considerado fundamental para o futuro do meio ambiente?',
    bestHeadlineQuestion: 'Qual frase resume com clareza o objetivo da atividade de Seu Benedito?',
    learningTip: 'Dica da Bússola: Foque no motivo que leva o agricultor a trocar sementes sem cobrar nada.',
    progressiveHint: {
      level1Guidance: 'Observe a importância de proteger as sementes tradicionais para a alimentação saudável e a biodiversidade.',
      level2Paragraph: 3,
      level3Excerpt: 'Para ele, preservar essas sementes antigas é proteger a história cultural dos povos, garantir alimentos mais nutritivos e assegurar a biodiversidade...',
    },
    options: [
      {
        id: 'opt-c4-correto',
        text: 'A preservação de sementes tradicionais garante biodiversidade, saúde e patrimônio cultural.',
        isCorrect: true,
        explanation: 'Exato! O texto destaca a importância ecológica e humana de manter vivas as variedades agrícolas nativas.',
      },
      {
        id: 'opt-c4-barro',
        text: 'Os potes de barro artesanais são os recipientes mais duráveis para guardar grãos na serra.',
        isCorrect: false,
        explanation: 'Os potes de barro são apenas o meio de armazenar, não o propósito ecológico central.',
      },
      {
        id: 'opt-c4-idade',
        text: 'Pessoas com mais de setenta anos têm mais facilidade para lidar com agricultura familiar.',
        isCorrect: false,
        explanation: 'A idade de Seu Benedito é um dado biográfico; o tema central é a conservação da biodiversidade.',
      },
      {
        id: 'opt-c4-venda',
        text: 'A comercialização em feiras livres é a maneira mais vantajosa de enriquecer no campo.',
        isCorrect: false,
        explanation: 'O texto diz exatamente o contrário: ele doa e troca sementes sem cobrar nenhum centavo.',
      },
    ],
  },
  {
    id: 'central-5',
    textId: 'menino-cores',
    question: 'Qual é o tema principal abordado no conto sobre a transformação de Vila Cinzenta?',
    bestHeadlineQuestion: 'Qual título expressa com precisão o sentido global desta história?',
    learningTip: 'Dica da Bússola: Pense no efeito transformador que uma simples pintura de girassol provocou no bairro.',
    progressiveHint: {
      level1Guidance: 'Relacione a iniciativa artística de Gael com a mudança nas relações entre os moradores.',
      level2Paragraph: 3,
      level3Excerpt: 'Em poucas semanas, o cinza deu lugar à arte comunitária, mostrando como pequenas atitudes generosas renovam a convivência humana.',
    },
    options: [
      {
        id: 'opt-c5-correto',
        text: 'Gestos simples de sensibilidade e arte têm o poder de transformar a convivência comunitária.',
        isCorrect: true,
        explanation: 'Perfeito! A pintura do girassol desencadeou uma reação de carinho, diálogo e colaboração entre todos os vizinhos.',
      },
      {
        id: 'opt-c5-tintas',
        text: 'O descarte correto de sobras de tinta látex pelas empresas de construção civil nos bairros.',
        isCorrect: false,
        explanation: 'O aproveitamento da tinta é um detalhe prático; o foco da história é a mudança humana nas relações sociais.',
      },
      {
        id: 'opt-c5-onibus',
        text: 'A manutenção regular das paredes dos pontos de parada de transporte público municipal.',
        isCorrect: false,
        explanation: 'O ponto de ônibus foi apenas o local escolhido por Gael para pintar seu primeiro girassol.',
      },
      {
        id: 'opt-c5-girassol',
        text: 'O girassol como a flor mais resistente para o plantio em áreas urbanas de concreto.',
        isCorrect: false,
        explanation: 'O girassol foi um desenho simbólico feito com pincel para convidar as pessoas a sorrirem e olharem o céu.',
      },
    ],
  },
];

// =========================================================================
// 3. TEXTOS EXCLUSIVOS DA MISSÃO 3: MAGO DAS ENTRELINHAS (EF35LP04)
// =========================================================================
export const IMPLICIT_TEXTS: ReadingText[] = [
  {
    id: 'sabedoria-formiga',
    title: 'A Estratégia da Pequena Saúva',
    genre: 'Fábula',
    authorOrSource: 'Contos da Mata Viva',
    themeIcon: '🐜',
    paragraphs: [
      {
        id: 1,
        text: 'A formiga Zoca precisava atravessar um riacho de águas rápidas para levar uma semente nutritiva até a colônia. Um besouro que passava zombou dela, dizendo que sem asas largas como as dele seria impossível cruzar para a outra margem.',
      },
      {
        id: 2,
        text: 'Zoca não respondeu à zombaria. Ela puxou pacientemente uma folha seca de embaúba para a beira da água, subiu no centro dela e usou um graveto leve como remo improvisado, deslizando calmamente sobre a correnteza.',
      },
      {
        id: 3,
        text: 'Minutos depois, um vento forte soprou contra o besouro, desequilibrando seu voo pesado e obrigando-o a pousar às pressas na lama, enquanto Zoca já descarregava a semente em solo firme com a ajuda de suas companheiras.',
      },
    ],
  },
  {
    id: 'mala-sotao',
    title: 'A Mala Antiga do Sótão',
    genre: 'Crônica',
    authorOrSource: 'Memórias da Casa Amarela',
    themeIcon: '📦',
    paragraphs: [
      {
        id: 1,
        text: 'Numa tarde chuvosa, Lucas subiu as escadas de madeira rangente até o sótão da casa de sua avó Clara. Entre caixas empoeiradas e jornais antigos, ele encontrou uma mala de couro marrom com fecho de metal enferrujado.',
      },
      {
        id: 2,
        text: 'Dentro da mala com cheiro de alfazema, havia fotografias em preto e branco de moças sorridentes na borda de uma piscina olímpica, uma touca azul desbotada e uma medalha dourada com o ano de 1954 gravado no verso.',
      },
      {
        id: 3,
        text: 'A jovem que segurava o troféu no degrau mais alto do pódio tinha o mesmo sorriso caloroso e o brilho característico no olhar que Lucas conhecia tão bem ao olhar para sua avó.',
      },
    ],
  },
  {
    id: 'horta-comunitaria',
    title: 'A Transformação do Terreno Baldio',
    genre: 'Crônica',
    authorOrSource: 'Caderno Cidadania & Meio Ambiente',
    themeIcon: '🥬',
    paragraphs: [
      {
        id: 1,
        text: 'Em um terreno baldio que antes acumulava restos de tijolos quebrados e pneus descartados no bairro Vila Esperança, dona Marta reuniu os vizinhos no primeiro sábado da primavera.',
      },
      {
        id: 2,
        text: 'Eles removeram a sujeira, afofaram a terra seca e criaram canteiros em curva. Seis meses depois, o espaço contava com fileiras viçosas de alface, cenoura e manjericão, além de duas torneiras com captação de água de chuva.',
      },
      {
        id: 3,
        text: 'As crianças da rua agora passavam as tardes regando as mudas em vez de desviarem os olhos do local, e famílias inteiras colhiam verduras frescas para suas refeições de domingo.',
      },
    ],
  },
  {
    id: 'violino-meianoite',
    title: 'O Relojoeiro e o Violino Misterioso',
    genre: 'Crônica',
    authorOrSource: 'Contos Urbanos Noturnos',
    themeIcon: '🎻',
    paragraphs: [
      {
        id: 1,
        text: 'Seu Augusto vivia sozinho em sua oficina no térreo de um sobrado antigo. Passava os dias consertando engrenagens de relógios de corda, cercado pelo tique-taque incessante que ecoava pelas paredes de madeira.',
      },
      {
        id: 2,
        text: 'Nos últimos meses, desde que perdera sua companheira de vida, Seu Augusto raramente abria as cortinas azuis da sala. Porém, toda noite, pontualmente às oito horas, notas suaves e calorosas de violino começavam a flutuar da janela do segundo andar.',
      },
      {
        id: 3,
        text: 'O relojoeiro pousava suas pinças no balcão, fechava os olhos e respirava fundo com uma expressão de paz. Ele nunca vira o músico da janela vizinha, mas sentia que aquela melodia era um abraço sonoro feito para aquecer sua alma.',
      },
    ],
  },
  {
    id: 'pegadas-farinha',
    title: 'O Enigma do Bolo Desaparecido',
    genre: 'Crônica',
    authorOrSource: 'Histórias Divertidas do Cotidiano',
    themeIcon: '🥧',
    paragraphs: [
      {
        id: 1,
        text: 'Dona Carmen acabara de tirar do forno um bolo fumegante de fubá com recheio de goiabada cascão. Ela cobriu o prato com um pano de prato rendado e foi até a varanda recolher as roupas do varal antes da chuva.',
      },
      {
        id: 2,
        text: 'Ao retornar para a cozinha, encontrou o pano tombado para o lado e uma fatia generosa faltando do bolo. Nenhuma porta ou janela havia batido, e o silêncio da casa era absoluto.',
      },
      {
        id: 3,
        text: 'No piso encerado da cozinha, pequenos vestígios brancos de farinha de trigo formavam uma trilha que serpenteava até a cesta de vime ao lado da lareira. Lá dentro, o gatinho Mingau fingia dormir profundamente, mas uma gotinha avermelhada de goiabada brilhava em seus bigodes brancos.',
      },
    ],
  },
];

// EF35LP04: Questões de Inferência com Alternativas Plausíveis e Equilibradas
export const IMPLICIT_QUESTIONS: ImplicitQuestion[] = [
  {
    id: 'imp-1',
    textId: 'sabedoria-formiga',
    question: 'Por que o besouro duvidou da capacidade da formiga Zoca ao vê-la perto do riacho?',
    excerptToAnalyze: 'Um besouro que passava por ali zombou da formiga, dizendo que ela jamais conseguiria superar um obstáculo tão largo sem asas como as dele...',
    implicitClue: 'dizendo que ela jamais conseguiria superar um obstáculo tão largo sem asas como as dele',
    pedagogicalReasoning: 'O besouro julgou que apenas atributos físicos visíveis como asas permitiriam cruzar a água, ignorando a inteligência e o planejamento da formiga.',
    progressiveHint: {
      level1Guidance: 'Analise a atitude do besouro: que característica ele julgava indispensável para vencer obstáculos?',
      level2Paragraph: 1,
      level3Excerpt: 'dizendo que ela jamais conseguiria superar um obstáculo tão largo sem asas como as dele...',
    },
    options: [
      {
        id: 'opt-imp1-correto',
        text: 'Porque ele julgava que apenas a força física e as asas permitiriam vencer grandes desafios.',
        isCorrect: true,
        explanation: 'Exatamente! O besouro presumiu que a formiga falharia por ser pequena e desprovida de asas, desconsiderando a criatividade.',
      },
      {
        id: 'opt-imp1-peso',
        text: 'Porque ele acreditava que a semente carregada por Zoca era pesada demais para boiar.',
        isCorrect: false,
        explanation: 'O texto não foca no peso da semente, mas no fato de o besouro zombar por Zoca não possuir asas.',
      },
      {
        id: 'opt-imp1-profundidade',
        text: 'Porque ele sabia que a correnteza naquele trecho era profunda demais para qualquer inseto.',
        isCorrect: false,
        explanation: 'A zombaria do besouro foi motivada pela comparação física com suas próprias asas largas.',
      },
      {
        id: 'opt-imp1-vento',
        text: 'Porque ele havia previsto que uma rajada de vento forte atingiria a margem do riacho.',
        isCorrect: false,
        explanation: 'O besouro não previu o vento; ele próprio acabou sendo pego de surpresa pela tempestade.',
      },
    ],
  },
  {
    id: 'imp-2',
    textId: 'mala-sotao',
    question: 'O que podemos deduzir sobre o passado da avó Clara a partir dos objetos encontrados na mala?',
    excerptToAnalyze: 'A jovem que segurava o troféu no degrau mais alto do pódio tinha o mesmo sorriso caloroso e o mesmo brilho no olhar...',
    implicitClue: 'fotografias de jovens na borda de piscina olímpica e medalha dourada de 1954',
    pedagogicalReasoning: 'O conjunto de pistas (fotos na piscina, medalha olímpica de 1954 e o mesmo sorriso no pódio) permite concluir com segurança que a avó foi atleta vitoriosa de natação.',
    progressiveHint: {
      level1Guidance: 'Junte as pistas: medalha com data, fotografias de piscina e a semelhança da jovem no pódio com a avó.',
      level2Paragraph: 2,
      level3Excerpt: 'fotografias em preto e branco de moças sorridentes na borda de uma piscina olímpica... e uma medalha dourada com o ano de 1954 gravado no verso.',
    },
    options: [
      {
        id: 'opt-imp2-correto',
        text: 'A avó Clara foi uma atleta de natação vitoriosa e guardava com carinho suas conquistas esportivas.',
        isCorrect: true,
        explanation: 'Brilhante dedução! A medalha de 1954, as fotos na piscina e a fisionomia idêntica no pódio comprovam a trajetória esportiva da avó.',
      },
      {
        id: 'opt-imp2-turista',
        text: 'A avó Clara gostava de colecionar objetos antigos comprados em viagens turísticas pelo litoral.',
        isCorrect: false,
        explanation: 'A foto no lugar mais alto do pódio retrata a própria avó quando jovem, indicando que ela mesma conquistou a medalha.',
      },
      {
        id: 'opt-imp2-amiga',
        text: 'A mala pertencia a uma colega de escola que esqueceu seus pertences no sótão durante as férias.',
        isCorrect: false,
        explanation: 'O sorriso característico e o brilho no olhar eram traços marcantes reconhecidos pelo neto na jovem campeã.',
      },
      {
        id: 'opt-imp2-juiza',
        text: 'A avó Clara trabalhou como juíza de competições aquáticas em eventos esportivos da capital.',
        isCorrect: false,
        explanation: 'A imagem a mostrava no pódio como atleta vencedora com troféu, e não como juíza.',
      },
    ],
  },
  {
    id: 'imp-3',
    textId: 'horta-comunitaria',
    question: 'Podemos inferir que, antes da criação da horta comunitária, o terreno causava qual impacto para a vizinhança?',
    excerptToAnalyze: 'Em um terreno baldio que antes acumulava restos de tijolos quebrados e pneus descartados no bairro Vila Esperança...',
    implicitClue: 'acumulava restos de tijolos quebrados e pneus descartados',
    pedagogicalReasoning: 'Pneus e entulhos acumulados em terrenos baldios retêm água da chuva, atraem mosquitos e transmitem sensação de abandono e insegurança.',
    progressiveHint: {
      level1Guidance: 'Considere o que pneus e entulho descartados a céu aberto provocam na saúde e na segurança de um bairro.',
      level2Paragraph: 1,
      level3Excerpt: 'Em um terreno baldio que antes acumulava restos de tijolos quebrados e pneus descartados...',
    },
    options: [
      {
        id: 'opt-imp3-correto',
        text: 'Representava riscos à saúde coletiva por reter sujeira e criadouros de insetos.',
        isCorrect: true,
        explanation: 'Excelente raciocínio! Entulho e pneus descartados representam perigo sanitário (como dengue) e desvalorizam o ambiente comunitário.',
      },
      {
        id: 'opt-imp3-estacionamento',
        text: 'Funcionava como um estacionamento seguro e bem iluminado para os carros dos moradores.',
        isCorrect: false,
        explanation: 'O terreno era baldio e acumulava entulhos e pneus velhos, sem nenhuma estrutura de estacionamento.',
      },
      {
        id: 'opt-imp3-parque',
        text: 'Era utilizado como área de piqueniques tranquilos pelas famílias durante os fins de semana.',
        isCorrect: false,
        explanation: 'Ninguém fazia piqueniques no local antes da limpeza; o texto diz que as pessoas evitavam olhar para lá.',
      },
      {
        id: 'opt-imp3-comercio',
        text: 'Abrigava pequenas lojas de artesanato e ferramentas construídas com materiais rústicos.',
        isCorrect: false,
        explanation: 'O texto deixa claro que o terreno estava abandonado e cheio de entulho antes da mobilização.',
      },
    ],
  },
  {
    id: 'imp-4',
    textId: 'violino-meianoite',
    question: 'O que podemos inferir sobre a intenção do vizinho que tocava violino todas as noites às oito horas?',
    excerptToAnalyze: 'Ele nunca vira o músico da janela vizinha, mas sentia que aquela melodia era um abraço sonoro feito para aquecer sua alma...',
    implicitClue: 'desde que perdera sua companheira, raramente abria as cortinas... pontualmente notas suaves começavam a flutuar',
    pedagogicalReasoning: 'A música suave e pontual oferecida a uma pessoa enlutada revela um gesto deliberado de solidariedade silenciosa e empatia.',
    progressiveHint: {
      level1Guidance: 'Observe a relação entre o luto de Seu Augusto e a expressão "abraço sonoro" usada para descrever a melodia.',
      level2Paragraph: 3,
      level3Excerpt: 'Ele nunca vira o músico da janela vizinha, mas sentia que aquela melodia era um abraço sonoro feito para aquecer sua alma.',
    },
    options: [
      {
        id: 'opt-imp4-correto',
        text: 'O vizinho percebeu a tristeza de Seu Augusto e tocava com empatia para oferecer consolo e afeto.',
        isCorrect: true,
        explanation: 'Profunda e bela leitura! A expressão "abraço sonoro" revela que o músico tocava deliberadamente para confortar o relojoeiro.',
      },
      {
        id: 'opt-imp4-estudo',
        text: 'O músico estava apenas cumprindo sua escala diária obrigatória de estudos para um conservatório.',
        isCorrect: false,
        explanation: 'O texto sugere uma ligação afetiva e sensível com a dor do vizinho, ultrapassando um mero exercício escolar.',
      },
      {
        id: 'opt-imp4-relogios',
        text: 'O violinista tocava para disfarçar o som dos relógios que ecoavam durante o silêncio da noite.',
        isCorrect: false,
        explanation: 'O tique-taque era de dia na oficina; a música noturna pontual tinha função de conforto emocional.',
      },
      {
        id: 'opt-imp4-aluguel',
        text: 'O morador do segundo andar tocava para anunciar a chegada de encomendas trazidas pelo correio.',
        isCorrect: false,
        explanation: 'Não há relação com encomendas comerciais; a narrativa aborda o acolhimento humano através da música.',
      },
    ],
  },
  {
    id: 'imp-5',
    textId: 'pegadas-farinha',
    question: 'Que pistas deixadas na cozinha nos permitem deduzir quem comeu a fatia do bolo de fubá?',
    excerptToAnalyze: 'pequenos vestígios brancos de farinha de trigo formavam uma trilha que serpenteava até a cesta de vime... uma gotinha avermelhada de goiabada brilhava em seus bigodes...',
    implicitClue: 'trilha de farinha até a cesta onde Mingau finge dormir + gotinha de goiabada no bigode',
    pedagogicalReasoning: 'A trilha física de farinha no piso ligando o prato ao cesto e o resíduo de goiabada no focinho do gato formam provas circunstanciais incontestáveis.',
    progressiveHint: {
      level1Guidance: 'Relacione as pegadas no chão com a substância doce encontrada no rosto do animalzinho.',
      level2Paragraph: 3,
      level3Excerpt: 'pequenos vestígios brancos de farinha de trigo formavam uma trilha que serpenteava até a cesta de vime... Mingau fingia dormir... gotinha de goiabada brilhava em seus bigodes.',
    },
    options: [
      {
        id: 'opt-imp5-correto',
        text: 'A trilha de farinha até o cesto de vime e a goiabada no bigode do gato Mingau revelam a autoria.',
        isCorrect: true,
        explanation: 'Elementar, detetive! As pistas físicas deixadas pelo gatinho denunciaram sua travessura apesar do sono fingido.',
      },
      {
        id: 'opt-imp5-vento',
        text: 'O pano de prato tombado na mesa indica que o vento forte da chuva empurrou a fatia para o lixo.',
        isCorrect: false,
        explanation: 'O vento não deixaria pegadas de farinha serpenteando até a cesta de Mingau nem goiabada em seus bigodes.',
      },
      {
        id: 'opt-imp5-passaro',
        text: 'A porta aberta da varanda sugere que uma ave entrou na cozinha e levou a fatia pela janela.',
        isCorrect: false,
        explanation: 'As pegadas terrestres e a goiabada no gato mostram claramente que o animal de estimação comeu o bolo.',
      },
      {
        id: 'opt-imp5-carmen',
        text: 'A própria Dona Carmen cortou a fatia apressadamente antes de recolher as roupas do varal.',
        isCorrect: false,
        explanation: 'Dona Carmen encontrou o bolo cortado com surpresa ao retornar da varanda.',
      },
    ],
  },
];

// Combinação de todos os textos para compatibilidade com outros módulos (Dicionário, etc.)
export const READING_TEXTS: ReadingText[] = [
  ...EXPLICIT_TEXTS,
  ...CENTRAL_IDEA_TEXTS,
  ...IMPLICIT_TEXTS,
];

// =========================================================================
// 4. BANCO DE PALAVRAS SILÁBICAS (EF05LP03)
// =========================================================================
export const SYLLABLE_EXERCISES: SyllableExercise[] = [
  {
    id: 'syl-1',
    word: 'lâmpada',
    syllables: ['lâm', 'pa', 'da'],
    tonicIndex: 0,
    classification: 'proparoxitona',
    needsAccent: true,
    accentRuleExplanation: 'Regra de Ouro: TODAS as palavras proparoxítonas recebem acento gráfico! A antepenúltima sílaba "lâm" é a mais forte.',
    wordWithoutAccent: 'lampada',
  },
  {
    id: 'syl-2',
    word: 'árvore',
    syllables: ['ár', 'vo', 're'],
    tonicIndex: 0,
    classification: 'proparoxitona',
    needsAccent: true,
    accentRuleExplanation: 'É proparoxítona porque a antepenúltima sílaba "ár" é a mais forte. Como toda proparoxítona, ela OBRIGATORIAMENTE tem acento!',
    wordWithoutAccent: 'arvore',
  },
  {
    id: 'syl-3',
    word: 'música',
    syllables: ['mú', 'si', 'ca'],
    tonicIndex: 0,
    classification: 'proparoxitona',
    needsAccent: true,
    accentRuleExplanation: 'A antepenúltima sílaba "mú" é a tônica (mais forte). Regra: 100% das palavras proparoxítonas levam acento gráfico!',
    wordWithoutAccent: 'musica',
  },
  {
    id: 'syl-4',
    word: 'café',
    syllables: ['ca', 'fé'],
    tonicIndex: 1,
    classification: 'oxitona',
    needsAccent: true,
    accentRuleExplanation: 'É oxítona porque a última sílaba "fé" é a mais forte. Acentua-se porque termina na vogal "e"!',
    wordWithoutAccent: 'cafe',
  },
  {
    id: 'syl-5',
    word: 'cipó',
    syllables: ['ci', 'pó'],
    tonicIndex: 1,
    classification: 'oxitona',
    needsAccent: true,
    accentRuleExplanation: 'Oxítona terminada em "o". As oxítonas que terminam em a, e, o, em/ens sempre levam acento!',
    wordWithoutAccent: 'cipo',
  },
  {
    id: 'syl-6',
    word: 'tambor',
    syllables: ['tam', 'bor'],
    tonicIndex: 1,
    classification: 'oxitona',
    needsAccent: false,
    accentRuleExplanation: 'A última sílaba "bor" é a mais forte, portanto é OXÍTONA. Mas NÃO leva acento porque termina em "r".',
    wordWithoutAccent: 'tambor',
  },
  {
    id: 'syl-7',
    word: 'fácil',
    syllables: ['fá', 'cil'],
    tonicIndex: 0,
    classification: 'paroxitona',
    needsAccent: true,
    accentRuleExplanation: 'É paroxítona (sílaba forte é a penúltima "fá"). Recebe acento porque termina na consoante "L"!',
    wordWithoutAccent: 'facil',
  },
  {
    id: 'syl-8',
    word: 'caderno',
    syllables: ['ca', 'der', 'no'],
    tonicIndex: 1,
    classification: 'paroxitona',
    needsAccent: false,
    accentRuleExplanation: 'A sílaba mais forte é a penúltima ("der"). É paroxítona, mas sem acento pois termina em "o".',
    wordWithoutAccent: 'caderno',
  },
  {
    id: 'syl-9',
    word: 'tórax',
    syllables: ['tó', 'rax'],
    tonicIndex: 0,
    classification: 'paroxitona',
    needsAccent: true,
    accentRuleExplanation: 'Paroxítona terminada na consoante "x"! As paroxítonas terminadas em r, x, n, l recebem acento gráfico.',
    wordWithoutAccent: 'torax',
  },
];
