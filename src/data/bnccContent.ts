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
    shortDesc: 'Inferir informações implícitas com base em pistas.',
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
        highlightClue: 'terça-feira no sertão da Caatinga, a bióloga Marina e o jovem aprendiz Tiago caminhavam pelas trilhas de terra avermelhada',
      },
      {
        id: 2,
        text: 'De repente, perto da raiz de um juazeiro centenário, Tiago avistou algo curioso: uma esfera perfeita de cor marrom-amarelada, do tamanho aproximado de uma bola de tênis. Ao se aproximarem com passos suaves, a bolinha desenrolou lentamente seu focinho pontudo e exibiu três faixas flexíveis em sua carapaça.',
        highlightClue: 'juazeiro centenário, Tiago avistou algo curioso: uma esfera perfeita de cor marrom-amarelada, do tamanho aproximado de uma bola de tênis',
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
        text: 'Utilizando lanternas de LED potente e pincéis de cerdas ultramacias, a equipe limpou com delicadeza uma rocha protegida da chuva. Lá surgiram pinturas rupestres vermelhas feitas com óxido de ferro há mais de doze mil anos, representando bandos de cervos e capivaras em movimento.',
        highlightClue: 'pinturas rupestres vermelhas feitas com óxido de ferro há mais de doze mil anos',
      },
      {
        id: 3,
        text: 'Para catalogar o sítio sem danificar o patrimônio histórico, os arqueólogos usaram um scanner a laser tridimensional importado de Portugal, registrando cada traço com precisão milimétrica.',
        highlightClue: 'scanner a laser tridimensional importado de Portugal',
      },
    ],
  },
  {
    id: 'tartaruga-marinha',
    title: 'O Ninho da Tartaruga-de-Pente em Noronha',
    genre: 'Notícia Escolar',
    authorOrSource: 'Informativo Mar & Preservação',
    themeIcon: '🐢',
    paragraphs: [
      {
        id: 1,
        text: 'Na madrugada de domingo, exatamente às três horas e quinze minutos, o biólogo André avistou uma tartaruga-de-pente fêmea subindo as areias douradas da Praia do Leão, no arquipélago de Fernando de Noronha.',
        highlightClue: 'madrugada de domingo, exatamente às três horas e quinze minutos, na Praia do Leão',
      },
      {
        id: 2,
        text: 'Com paciência e em silêncio absoluto para não assustar o réptil, André registrou a desova: a tartaruga depositou com cuidado cento e vinte e oito ovos redondos em um buraco de cinquenta centímetros de profundidade cavado com suas nadadeiras traseiras.',
        highlightClue: 'depositou com cuidado cento e vinte e oito ovos redondos em um buraco de cinquenta centímetros',
      },
      {
        id: 3,
        text: 'Antes do nascer do sol, a equipe do Projeto Tamar cercou a área com estacas de madeira sustentável e uma placa amarela indicando o número de monitoramento quarenta e dois.',
        highlightClue: 'placa amarela indicando o número de monitoramento quarenta e dois',
      },
    ],
  },
  {
    id: 'robo-sucatinha',
    title: 'A Feira de Robótica da Escola Santos Dumont',
    genre: 'Notícia Escolar',
    authorOrSource: 'Gazeta Estudantil de Curitiba',
    themeIcon: '🤖',
    paragraphs: [
      {
        id: 1,
        text: 'Na última quarta-feira, a aluna Beatriz, de dez anos de idade, conquistou a medalha de ouro na décima edição da Feira de Robótica Sustentável de Curitiba com seu projeto batizado de "Sucatinha".',
        highlightClue: 'aluna Beatriz, de dez anos de idade, conquistou a medalha de ouro',
      },
      {
        id: 2,
        text: 'O robô foi totalmente construído a partir de materiais recolhidos na reciclagem da escola: o corpo era composto por seis latinhas de refrigerante de alumínio, duas tampinhas de garrafa PET faziam os olhos giratórios e as rodas vieram de um carrinho de plástico quebrado.',
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

// EF15LP03: Questões Explícitas Exclusivas
export const EXPLICIT_QUESTIONS: ExplicitQuestion[] = [
  {
    id: 'exp-1',
    textId: 'tatu-bola',
    paragraphRef: 1,
    question: 'Em que dia da semana e em qual bioma Marina e Tiago realizavam a expedição?',
    clueWord: 'terça-feira no sertão da Caatinga',
    options: [
      {
        id: 'a',
        text: 'Na terça-feira, no sertão da Caatinga.',
        isCorrect: true,
        explanation: 'Muito bem! No primeiro parágrafo está escrito com clareza: "Em uma manhã ensolarada de terça-feira no sertão da Caatinga".',
      },
      {
        id: 'b',
        text: 'No domingo de manhã, na Floresta Amazônica.',
        isCorrect: false,
        explanation: 'Atenção ao primeiro parágrafo: eles estavam no sertão da Caatinga em uma terça-feira!',
      },
      {
        id: 'c',
        text: 'Na quarta-feira à tarde, no Pantanal mato-grossense.',
        isCorrect: false,
        explanation: 'Releia o primeiro parágrafo. O dia era terça-feira e o bioma era a Caatinga.',
      },
      {
        id: 'd',
        text: 'Na sexta-feira de madrugada, no litoral da Mata Atlântica.',
        isCorrect: false,
        explanation: 'Essa informação não consta no texto. O texto cita terça-feira na Caatinga.',
      },
    ],
  },
  {
    id: 'exp-2',
    textId: 'serra-capivara',
    paragraphRef: 2,
    question: 'Há quanto tempo foram feitas as pinturas rupestres encontradas e quais animais elas representavam?',
    clueWord: 'há mais de doze mil anos, representando bandos de cervos e capivaras',
    options: [
      {
        id: 'a',
        text: 'Há mais de doze mil anos, representando cervos e capivaras.',
        isCorrect: true,
        explanation: 'Exato! O parágrafo 2 confirma explicitamente: "feitas com óxido de ferro há mais de doze mil anos, representando bandos de cervos e capivaras".',
      },
      {
        id: 'b',
        text: 'Há apenas cem anos, representando leões e zebras africanas.',
        isCorrect: false,
        explanation: 'O texto diz claramente: há mais de doze mil anos, e os animais são cervos e capivaras.',
      },
      {
        id: 'c',
        text: 'Há quinhentos anos, com figuras de navios portugueses.',
        isCorrect: false,
        explanation: 'O sítio é pré-histórico, com mais de doze mil anos de idade.',
      },
      {
        id: 'd',
        text: 'Há dois mil anos, representando apenas pássaros e peixes.',
        isCorrect: false,
        explanation: 'Releia o segundo parágrafo: as figuras são bandos de cervos e capivaras.',
      },
    ],
  },
  {
    id: 'exp-3',
    textId: 'tartaruga-marinha',
    paragraphRef: 2,
    question: 'Quantos ovos a tartaruga-de-pente depositou no ninho na Praia do Leão?',
    clueWord: 'cento e vinte e oito ovos redondos',
    options: [
      {
        id: 'a',
        text: 'Exatamente cinquenta ovos.',
        isCorrect: false,
        explanation: 'Cinquenta centímetros era a profundidade do buraco, não a quantidade de ovos!',
      },
      {
        id: 'b',
        text: 'Cento e vinte e oito ovos redondos.',
        isCorrect: true,
        explanation: 'Correto! No parágrafo 2 está escrito de forma explícita: "depositou com cuidado cento e vinte e oito ovos redondos".',
      },
      {
        id: 'c',
        text: 'Apenas quarenta e dois ovos.',
        isCorrect: false,
        explanation: 'Quarenta e dois é o número da placa de monitoramento colocada pelos biólogos.',
      },
      {
        id: 'd',
        text: 'Mais de trezentos ovos gigantes.',
        isCorrect: false,
        explanation: 'O número exato registrado pelo biólogo foi cento e vinte e oito.',
      },
    ],
  },
  {
    id: 'exp-4',
    textId: 'robo-sucatinha',
    paragraphRef: 2,
    question: 'Quais materiais da reciclagem escolar formavam o corpo do robô Sucatinha?',
    clueWord: 'seis latinhas de refrigerante de alumínio, duas tampinhas de garrafa PET e rodas de carrinho',
    options: [
      {
        id: 'a',
        text: 'Seis latinhas de alumínio, duas tampinhas de garrafa PET e rodas de carrinho de plástico.',
        isCorrect: true,
        explanation: 'Perfeito! No parágrafo 2 temos todos esses detalhes descritos passo a passo.',
      },
      {
        id: 'b',
        text: 'Tubos de ferro pesado, placas de computador novo e vidro blindado.',
        isCorrect: false,
        explanation: 'O robô foi feito de materiais reciclados simples da escola.',
      },
      {
        id: 'c',
        text: 'Garrafas térmicas quebradas e correias de bicicleta velha.',
        isCorrect: false,
        explanation: 'Esses materiais não aparecem na descrição do projeto Sucatinha.',
      },
      {
        id: 'd',
        text: 'Apenas caixas de papelão e fita crepe.',
        isCorrect: false,
        explanation: 'O texto especifica latinhas de alumínio, tampinhas PET e rodinhas de plástico.',
      },
    ],
  },
  {
    id: 'exp-5',
    textId: 'festival-pipas',
    paragraphRef: 2,
    question: 'Qual era o comprimento do dragão alado construído por Seu Manoel e qual material ele usou?',
    clueWord: 'seis metros de comprimento, utilizando varetas de taquara tratada e folhas de papel de seda',
    options: [
      {
        id: 'a',
        text: 'Seis metros de comprimento, feito com varetas de taquara e papel de seda.',
        isCorrect: true,
        explanation: 'Sensacional! O parágrafo 2 cita textualmente: "um dragão alado de seis metros de comprimento, utilizando varetas de taquara tratada e folhas de papel de seda".',
      },
      {
        id: 'b',
        text: 'Quinze metros de comprimento, feito com sacos plásticos de supermercado.',
        isCorrect: false,
        explanation: 'A décima quinta era a edição do festival; o dragão tinha seis metros.',
      },
      {
        id: 'c',
        text: 'Dois metros de comprimento, feito de tecido grosso de algodão cru.',
        isCorrect: false,
        explanation: 'O texto indica taquara e papel de seda amarelo e verde.',
      },
      {
        id: 'd',
        text: 'Cinquenta metros de comprimento, sustentado por fios de metal.',
        isCorrect: false,
        explanation: 'O dragão media seis metros de comprimento.',
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
    title: 'A Janela para o Universo',
    genre: 'Notícia Escolar',
    authorOrSource: 'Jornal Mural da Escola Primavera',
    themeIcon: '🔭',
    paragraphs: [
      {
        id: 1,
        text: 'Na última sexta-feira à noite, o pátio da Escola Municipal Primavera transformou-se em um verdadeiro observatório astronômico. O professor Marcelo instalou um telescópio refletor no gramado central para a observação da Lua e dos planetas.',
      },
      {
        id: 2,
        text: 'Mais de quarenta alunos compareceram agasalhados. Quando olharam pela lente pela primeira vez, seus olhos se encheram de maravilhamento: puderam ver as crateras da Lua e quatro luas brilhantes orbitando Júpiter.',
      },
      {
        id: 3,
        text: 'O objetivo da atividade não era apenas olhar as estrelas, mas inspirar as crianças a compreenderem que a ciência nasce da curiosidade diária e do amor pelo cuidado com o nosso planeta Terra.',
      },
    ],
  },
  {
    id: 'colibri-valente',
    title: 'A Fábula do Colibri e o Grande Incêndio',
    genre: 'Fábula',
    authorOrSource: 'Conto Popular da Amazônia',
    themeIcon: '🦜',
    paragraphs: [
      {
        id: 1,
        text: 'Um incêndio feroz começou a queimar as copas das castanheiras antigas na mata. Desesperados com a fumaça cinzenta, o jacaré, a onça-pintada e a anta correram em disparada rumo ao rio, certos de que nada mais poderia salvar a floresta.',
      },
      {
        id: 2,
        text: 'No entanto, um minúsculo colibri de peito verde voava sem parar do rio até as chamas. Ele enchia seu biquinho com três gotinhas de água cristalina e as derramava com bravura sobre o fogo crepitante.',
      },
      {
        id: 3,
        text: 'A onça gritou: "Você está louco, passarinho? Acha mesmo que vai apagar esse incêndio sozinho?". E o colibri respondeu sereno: "Eu sei que sou pequeno, mas estou cumprindo a minha parte". Inspirados por ele, centenas de pássaros uniram-se à tarefa e ajudaram a resfriar a mata.',
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
        text: 'Durante décadas, os moradores da Vila das Flores e da Vila das Pedras não conversavam entre si por causa de uma discussão sobre o limite das plantações. Entre as duas vilas, havia apenas um riacho raso e uma ponte de cedro abandonada.',
      },
      {
        id: 2,
        text: 'Após uma forte tempestade de verão arrancar metade das tábuas da ponte, os jovens estudantes de ambas as margens decidiram que já era hora de colocar um ponto final naquela divisão sem sentido.',
      },
      {
        id: 3,
        text: 'Sem avisar os adultos, eles trouxeram martelos, pregos e tábuas novas. Ao final da tarde, a ponte estava firme e enfeitada com flores coloridas. Quando os pais chegaram para procurá-los, encontraram todos rindo e compartilhando bolo de milho, provando que o diálogo constrói caminhos onde o orgulho só ergue barreiras.',
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
        text: 'No alto da Serra da Mantiqueira vive Seu Benedito, um agricultor de setenta e dois anos que guarda em pequenos potes de barro mais de cinquenta variedades de sementes tradicionais de milho roxo, abóbora e feijão.',
      },
      {
        id: 2,
        text: 'Enquanto muitas fazendas modernas plantam apenas um tipo de semente industrializada e dependem de venenos químicos, Seu Benedito troca sementes nativas com escolas e vizinhos sem cobrar um único centavo.',
      },
      {
        id: 3,
        text: 'Para ele, preservar essas sementes antigas é proteger a história de nossos antepassados, garantir comida saudável e salvar a biodiversidade para as próximas gerações que ainda vão nascer.',
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
        text: 'O bairro de Vila Cinzenta recebia esse nome porque todos os muros eram de concreto apagado e os moradores andavam de cabeça baixa, apressados para seus compromissos, sem trocar um "bom dia".',
      },
      {
        id: 2,
        text: 'Num sábado ensolarado, o menino Gael pegou sobras de tintas descartadas e pintou na parede do ponto de ônibus um enorme girassol sorridente acompanhado da frase: "Você já olhou pro céu hoje?".',
      },
      {
        id: 3,
        text: 'Aquele simples desenho mudou tudo: os vizinhos começaram a parar, sorrir e trazer seus próprios pincéis. Em poucas semanas, o cinza deu lugar a um festival de arte comunitária, mostrando como pequenos gestos de afeto têm o poder de transformar a convivência humana.',
      },
    ],
  },
];

// EF35LP03: Questões de Ideia Central Exclusivas
export const CENTRAL_IDEA_QUESTIONS: CentralIdeaQuestion[] = [
  {
    id: 'central-1',
    textId: 'telescopio-marina',
    question: 'Qual mensagem principal o autor deseja transmitir com a crônica da noite astronômica?',
    bestHeadlineQuestion: 'Qual opção expressa o sentido global de toda a reportagem escolar?',
    learningTip: 'Dica da Bússola: Observe o objetivo final declarado pelo professor Marcelo para todos os estudantes.',
    options: [
      {
        id: 'a',
        text: 'A observação científica desperta o maravilhamento, o gosto pela ciência e a consciência de cuidar da Terra.',
        isCorrect: true,
        explanation: 'Sensacional! O texto mostra como a noite de observação serviu para conectar as crianças com o universo e despertar o gosto pela ciência.',
      },
      {
        id: 'b',
        text: 'A importância de usar toucas de lã grossas quando a temperatura cai à noite.',
        isCorrect: false,
        explanation: 'As roupas de frio foram apenas uma descrição de como estavam vestidos, não a mensagem central.',
      },
      {
        id: 'c',
        text: 'A lista exata de peças necessárias para fabricar um telescópio de setenta milímetros.',
        isCorrect: false,
        explanation: 'O texto não é um manual de fabricação técnica de telescópio.',
      },
      {
        id: 'd',
        text: 'O horário em que o portão da escola deve ser trancado às sextas-feiras.',
        isCorrect: false,
        explanation: 'Isso sequer é discutido como propósito central do evento.',
      },
    ],
  },
  {
    id: 'central-2',
    textId: 'colibri-valente',
    question: 'Qual é o ensinamento (moral) central presente na fábula do colibri na Amazônia?',
    bestHeadlineQuestion: 'Se você fosse dar um subtítulo para a fábula do colibri, qual seria o mais adequado?',
    learningTip: 'Dica da Bússola: Pense na lição que a resposta do colibri ensinou a todos os animais da floresta.',
    options: [
      {
        id: 'a',
        text: 'Cada um deve fazer a sua parte com coragem, pois pequenas ações exemplares inspiram transformações coletivas.',
        isCorrect: true,
        explanation: 'Excelente! A atitude do pequeno colibri não era de orgulho, mas de responsabilidade, inspirando os outros a agirem juntos.',
      },
      {
        id: 'b',
        text: 'Os animais pequenos devem sempre fugir antes que os animais grandes comecem a correr.',
        isCorrect: false,
        explanation: 'A moral da história ensina o oposto: coragem e atitude mesmo diante de um obstáculo imenso.',
      },
      {
        id: 'c',
        text: 'O fogo na floresta é um fenômeno divertido para os pássaros observarem do alto.',
        isCorrect: false,
        explanation: 'O incêndio era uma tragédia ambiental que exigia união para ser combatida.',
      },
      {
        id: 'd',
        text: 'Apenas os jacarés e as antas têm força para tomar decisões na selva.',
        isCorrect: false,
        explanation: 'Quem liderou a ação que inspirou a todos foi o menor de todos os pássaros.',
      },
    ],
  },
  {
    id: 'central-3',
    textId: 'ponte-reconciliacao',
    question: 'Qual é a ideia central da história sobre a reconstrução da velha ponte de cedro?',
    bestHeadlineQuestion: 'Qual manchete resumiria com precisão o desfecho da crônica entre as duas vilas?',
    learningTip: 'Dica da Bússola: Foque na mudança de comportamento entre as duas comunidades vizinhas.',
    options: [
      {
        id: 'a',
        text: 'A cooperação e o diálogo entre os jovens foram capazes de superar desavenças antigas e unir a comunidade.',
        isCorrect: true,
        explanation: 'Corretíssimo! A reconstrução física da ponte simbolizou a reconciliação e a amizade entre as duas vilas.',
      },
      {
        id: 'b',
        text: 'A madeira de cedro é o melhor material para suportar chuvas fortes de verão.',
        isCorrect: false,
        explanation: 'A qualidade da madeira é um detalhe secundário; o tema é a união das pessoas.',
      },
      {
        id: 'c',
        text: 'O bolo de milho deve ser servido somente quando houver festas com martelos e pregos.',
        isCorrect: false,
        explanation: 'O lanche compartilhado foi apenas uma consequência da celebração da amizade.',
      },
      {
        id: 'd',
        text: 'Os adultos devem sempre proibir as crianças de realizar trabalhos manuais.',
        isCorrect: false,
        explanation: 'Pelo contrário, foram os jovens que ensinaram aos adultos uma lição de convivência pacífica.',
      },
    ],
  },
  {
    id: 'central-4',
    textId: 'guardiao-sementes',
    question: 'De forma global, qual é o tema principal da reportagem sobre Seu Benedito?',
    bestHeadlineQuestion: 'Qual título resume melhor o propósito de vida do agricultor da Mantiqueira?',
    learningTip: 'Dica da Bússola: Veja o motivo pelo qual Seu Benedito guarda e compartilha sementes crioulas.',
    options: [
      {
        id: 'a',
        text: 'A preservação das sementes nativas é essencial para proteger a biodiversidade, a saúde e a herança cultural.',
        isCorrect: true,
        explanation: 'Perfeito! O texto demonstra como o trabalho tradicional de preservação de sementes protege a natureza e o futuro alimentar.',
      },
      {
        id: 'b',
        text: 'Como fabricar potes de barro artesanais para vender em feiras turísticas.',
        isCorrect: false,
        explanation: 'Os potes de barro eram apenas os recipientes onde as sementes eram guardadas.',
      },
      {
        id: 'c',
        text: 'As desvantagens de morar na Serra da Mantiqueira durante as manhãs frias.',
        isCorrect: false,
        explanation: 'A localização geográfica é apenas o cenário onde a história acontece.',
      },
      {
        id: 'd',
        text: 'O preço das abóboras e do milho nos grandes supermercados da capital.',
        isCorrect: false,
        explanation: 'Seu Benedito sequer cobrava dinheiro pelas sementes; seu objetivo era a conservação.',
      },
    ],
  },
  {
    id: 'central-5',
    textId: 'menino-cores',
    question: 'O que o texto demonstra sobre o impacto da iniciativa artística de Gael no bairro?',
    bestHeadlineQuestion: 'Qual lição sobre convivência humana resume o conto de Vila Cinzenta?',
    learningTip: 'Dica da Bússola: Observe o que aconteceu com o humor e as atitudes dos moradores após o mural.',
    options: [
      {
        id: 'a',
        text: 'Pequenos atos de sensibilidade e arte têm a força de romper o isolamento e promover a empatia e união entre vizinhos.',
        isCorrect: true,
        explanation: 'Maravilhoso! A pintura do girassol desencadeou uma corrente positiva de convivência e alegria em toda a comunidade.',
      },
      {
        id: 'b',
        text: 'O concreto apagado é a cor mais recomendada para pintar pontos de ônibus.',
        isCorrect: false,
        explanation: 'O texto critica o cinza monótono e valoriza a explosão de cores e vida.',
      },
      {
        id: 'c',
        text: 'Pessoas com compromissos urgentes nunca devem olhar para o céu durante o dia.',
        isCorrect: false,
        explanation: 'A frase de Gael convidava justamente as pessoas a desacelerarem e apreciarem a vida.',
      },
      {
        id: 'd',
        text: 'As tintas descartadas perdem a cor em menos de duas horas sob a luz solar.',
        isCorrect: false,
        explanation: 'O mural permaneceu e inspirou todo o bairro a pintar novas obras comunitárias.',
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
    title: 'A Lição do Riacho das Pedras',
    genre: 'Fábula',
    authorOrSource: 'Adaptação do Folclore Brasileiro',
    themeIcon: '🐜',
    paragraphs: [
      {
        id: 1,
        text: 'Uma formiguinha sapeca chamada Zoca queria atravessar o riacho cristalino para alcançar uma macieira carregada de frutos suculentos. O riacho corria com muita pressa e as águas pareciam gigantescas para alguém do tamanho dela.',
      },
      {
        id: 2,
        text: 'Um besouro que passava por ali zombou da formiga, dizendo que ela jamais conseguiria superar um obstáculo tão largo sem asas como as dele. Mas Zoca não se irritou; em vez de desistir, procurou por perto e encontrou uma folha seca e leve de embaúba.',
      },
      {
        id: 3,
        text: 'Com a ajuda de suas irmãs do formigueiro, ela empurrou a folha até a margem e usou um graveto fino como leme. Navegou com segurança até o outro lado, provando que a inteligência e a cooperação realizam o que a força bruta não consegue.',
      },
    ],
  },
  {
    id: 'mala-sotao',
    title: 'O Mistério da Mala do Sótão',
    genre: 'Crônica',
    authorOrSource: 'Coleção Segredos de Família',
    themeIcon: '🗝️',
    paragraphs: [
      {
        id: 1,
        text: 'Durante uma tarde chuvosa na casa de campo, Lucas subiu as escadas de madeira rangente até o sótão empoeirado. Entre caixas de papelão e cortinas antigas, encontrou uma mala de couro marrom fechada com um pequeno cadeado de latão.',
      },
      {
        id: 2,
        text: 'Ao abrir a mala com a chave que repousava no fundo de uma xícara de porcelana, um suave cheiro de alfazema invadiu o ar. Dentro havia cadernos com caligrafia caprichada, fotografias em preto e branco de jovens sorridentes à beira de uma piscina olímpica e uma medalha dourada com a data de 1954.',
      },
      {
        id: 3,
        text: 'Lucas acariciou a fita de cetim desgastada da medalha e observou a foto: a jovem campeã no pódio tinha o mesmo sorriso travesso e o mesmo brilho no olhar de sua avó Clara, hoje com oitenta e cinco anos.',
      },
    ],
  },
  {
    id: 'horta-comunitaria',
    title: 'Mãos Verdes na Vila Esperança',
    genre: 'Notícia Escolar',
    authorOrSource: 'Boletim Sustentabilidade na Prática',
    themeIcon: '🌱',
    paragraphs: [
      {
        id: 1,
        text: 'Em um terreno que antes acumulava apenas entulho e pneus velhos no bairro Vila Esperança, os moradores se uniram para criar uma horta comunitária agroecológica. Em apenas seis meses de trabalho coletivo nos finais de semana, o espaço ganhou canteiros suspensos de verduras frescas.',
      },
      {
        id: 2,
        text: 'As crianças da comunidade foram as responsáveis por plantar mudas de girassol e alecrim ao redor dos canteiros, pois essas flores atraem abelhas nativas sem ferrão, fundamentais para a polinização de todas as plantas.',
      },
      {
        id: 3,
        text: 'Além de fornecer alimentos frescos e sem veneno para mais de oitenta famílias vizinhas, a horta transformou a convivência do bairro, tornando as tardes de domingo mais alegres e unidas.',
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
        text: 'O relojoeiro pousava suas pinças no balcão, fechava os olhos e respirava fundo com uma expressão de paz. Ele nunca vira o músico misterioso da janela vizinha, mas sabia que aquela melodia era um abraço sonoro feito para aquecer sua alma.',
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

// EF35LP04: Questões Implícitas Exclusivas
export const IMPLICIT_QUESTIONS: ImplicitQuestion[] = [
  {
    id: 'imp-1',
    textId: 'sabedoria-formiga',
    question: 'Por que o besouro zombou da formiga quando a viu perto do riacho?',
    excerptToAnalyze: 'Um besouro que passava por ali zombou da formiga, dizendo que ela jamais conseguiria superar um obstáculo tão largo sem asas como as dele...',
    implicitClue: 'dizendo que ela jamais conseguiria superar um obstáculo tão largo sem asas como as dele',
    pedagogicalReasoning: 'O besouro se achava superior por ter asas e duvidou da capacidade de quem não tinha os mesmos recursos físicos que ele.',
    options: [
      {
        id: 'a',
        text: 'Porque ele era arrogante e acreditava que só com asas e força física seria possível vencer obstáculos.',
        isCorrect: true,
        explanation: 'Exatamente! O besouro julgou a formiga pelo tamanho e pela falta de asas, subestimando o poder da inteligência e cooperação.',
      },
      {
        id: 'b',
        text: 'Porque ele queria ser o melhor amigo de Zoca e convidá-la para um piquenique.',
        isCorrect: false,
        explanation: 'Zombar de alguém demonstra arrogância e desdém, não amizade.',
      },
      {
        id: 'c',
        text: 'Porque ele sabia com certeza que a folha de embaúba iria afundar na água.',
        isCorrect: false,
        explanation: 'A folha não afundou, e ele nem sabia que ela usaria essa estratégia.',
      },
      {
        id: 'd',
        text: 'Porque as formigas tinham pego a comida favorita dele no formigueiro.',
        isCorrect: false,
        explanation: 'Não há menção de conflito de comida entre eles no texto.',
      },
    ],
  },
  {
    id: 'imp-2',
    textId: 'mala-sotao',
    question: 'O que podemos deduzir sobre o passado da avó Clara a partir dos objetos encontrados por Lucas na mala?',
    excerptToAnalyze: 'A jovem campeã no pódio tinha o mesmo sorriso travesso e o mesmo brilho no olhar de sua avó Clara...',
    implicitClue: 'fotografias de jovens à beira de piscina olímpica e uma medalha dourada de 1954',
    pedagogicalReasoning: 'O texto não diz abertamente "a vovó foi atleta profissional", mas as pistas da medalha, piscina e semelhança no pódio nos permitem deduzir isso com segurança.',
    options: [
      {
        id: 'a',
        text: 'A avó Clara foi uma atleta talentosa e campeã de natação na juventude, guardando suas conquistas com afeto.',
        isCorrect: true,
        explanation: 'Brilhante dedução! A medalha olímpica de 1954, as fotos na piscina e o sorriso idêntico no pódio revelam a carreira esportiva da avó.',
      },
      {
        id: 'b',
        text: 'A avó Clara comprou aquela mala velha em um brechó apenas para guardar alfazema.',
        isCorrect: false,
        explanation: 'Os objetos contam uma história pessoal íntima de vitórias e lembranças de sua juventude.',
      },
      {
        id: 'c',
        text: 'A família de Lucas tinha fobia de esportes aquáticos e nunca frequentava piscinas.',
        isCorrect: false,
        explanation: 'Pelo contrário, as fotos mostram conquistas de natação.',
      },
      {
        id: 'd',
        text: 'A medalha foi perdida por um vizinho que esqueceu a mala no sótão.',
        isCorrect: false,
        explanation: 'A foto no pódio mostrava a própria avó quando jovem.',
      },
    ],
  },
  {
    id: 'imp-3',
    textId: 'horta-comunitaria',
    question: 'Podemos inferir que, antes da criação da horta comunitária, o terreno causava qual impacto para a vizinhança?',
    excerptToAnalyze: 'Em um terreno que antes acumulava apenas entulho e pneus velhos no bairro Vila Esperança...',
    implicitClue: 'acumulava apenas entulho e pneus velhos',
    pedagogicalReasoning: 'Entulho e pneus velhos acumulam água de chuva, atraem mosquitos (como da dengue) e desvalorizam o ambiente, gerando risco à saúde e aspecto de abandono.',
    options: [
      {
        id: 'a',
        text: 'Causava preocupações com sujeira, proliferação de mosquitos e desvalorização da vizinhança.',
        isCorrect: true,
        explanation: 'Excelente raciocínio! Pneus velhos e entulhos são conhecidos por reter água parada e atrair pragas, tornando o local perigoso e abandonado.',
      },
      {
        id: 'b',
        text: 'Era considerado o parque mais seguro e florido de toda a cidade.',
        isCorrect: false,
        explanation: 'Um terreno com pneus velhos e entulho não era um parque seguro.',
      },
      {
        id: 'c',
        text: 'Servia como uma pista oficial para competições velozes de skate e bicicleta.',
        isCorrect: false,
        explanation: 'Não havia pista nenhuma, apenas lixo e entulho abandonados.',
      },
      {
        id: 'd',
        text: 'Era uma reserva ecológica protegida pelo governo municipal.',
        isCorrect: false,
        explanation: 'O texto diz claramente que era um terreno com entulho descartado.',
      },
    ],
  },
  {
    id: 'imp-4',
    textId: 'violino-meianoite',
    question: 'O que podemos inferir sobre a intenção do vizinho que tocava violino toda noite às oito horas?',
    excerptToAnalyze: 'Ele nunca vira o músico misterioso da janela vizinha, mas sabia que aquela melodia era um abraço sonoro...',
    implicitClue: 'desde que perdera sua companheira de vida, Seu Augusto raramente abria as cortinas... pontualmente às oito horas, notas suaves começavam a flutuar',
    pedagogicalReasoning: 'A pontualidade e o tom suave da música logo após a perda sugerem que o vizinho percebeu a dor de Seu Augusto e usou a música como consolo silencioso.',
    options: [
      {
        id: 'a',
        text: 'O vizinho percebeu a tristeza de Seu Augusto e tocava com empatia para oferecer consolo e companhia através da música.',
        isCorrect: true,
        explanation: 'Profunda e bela leitura! A expressão "abraço sonoro" revela que o músico tocava deliberadamente para confortar o relojoeiro em seu luto.',
      },
      {
        id: 'b',
        text: 'O vizinho tocava o mais alto possível para irritar Seu Augusto e fazer barulho.',
        isCorrect: false,
        explanation: 'A música trazia paz e serenidade, não irritação.',
      },
      {
        id: 'c',
        text: 'O músico estava testando se as cordas do violino estavam quebradas antes de jogá-lo fora.',
        isCorrect: false,
        explanation: 'Ele tocava todas as noites com dedicação e harmonia.',
      },
      {
        id: 'd',
        text: 'O vizinho queria vender ingressos para um concerto particular na oficina de relógios.',
        isCorrect: false,
        explanation: 'Não havia interesse comercial, tratava-se de sensibilidade humana e solidariedade.',
      },
    ],
  },
  {
    id: 'imp-5',
    textId: 'pegadas-farinha',
    question: 'Que pistas deixadas na cozinha nos permitem deduzir quem comeu a fatia do bolo de fubá?',
    excerptToAnalyze: 'uma trilha que serpenteava até a cesta de vime... Mingau fingia dormir profundamente, mas uma gotinha avermelhada de goiabada brilhava em seus bigodes...',
    implicitClue: 'trilha de farinha até a cesta onde Mingau finge dormir + gotinha de goiabada no bigode',
    pedagogicalReasoning: 'A pista física (farinha no chão ligando a mesa ao cesto do gato) somada ao vestígio no bigode do animal prova que ele foi o autor da travessura.',
    options: [
      {
        id: 'a',
        text: 'As patinhas de farinha no chão levando ao cesto e a gotinha de goiabada presa nos bigodes de Mingau comprovam que o gato comeu a fatia.',
        isCorrect: true,
        explanation: 'Elementar, meu caro detetive! As pistas físicas deixadas pelo gatinho traíram seu disfarce de "sono profundo".',
      },
      {
        id: 'b',
        text: 'Dona Carmen esqueceu de assar o bolo e a fatia evaporou por causa do vento da janela.',
        isCorrect: false,
        explanation: 'Fatias de bolo não evaporam; houve uma ação direta do bichinho de estimação.',
      },
      {
        id: 'c',
        text: 'Um vizinho entrou invisível e limpou os sapatos na farinha de trigo.',
        isCorrect: false,
        explanation: 'A trilha foi deixada por patas pequenas e terminou na cesta do gato.',
      },
      {
        id: 'd',
        text: 'O gatinho Mingau estava tentando proteger o bolo contra ataques de formigas.',
        isCorrect: false,
        explanation: 'A goiabada em seu bigode e o fingimento mostram que ele mesmo se deliciou com o bolo.',
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
