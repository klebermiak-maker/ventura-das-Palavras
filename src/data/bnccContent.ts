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

export const READING_TEXTS: ReadingText[] = [
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
      },
    ],
  },
  {
    id: 'telescopio-marina',
    title: 'A Janela para o Universo',
    genre: 'Notícia Escolar',
    authorOrSource: 'Jornal Mural da Escola Primavera',
    themeIcon: '🔭',
    paragraphs: [
      {
        id: 1,
        text: 'Na última sexta-feira à noite, o pátio da Escola Municipal Primavera transformou-se em um verdadeiro observatório astronômico. O professor Marcelo instalou um telescópio refletor de setenta milímetros no gramado central para a observação da Lua e dos planetas.',
        highlightClue: 'última sexta-feira à noite, o pátio da Escola Municipal Primavera transformou-se em um verdadeiro observatório astronômico',
      },
      {
        id: 2,
        text: 'Mais de quarenta alunos do quarto ano compareceram agasalhados com casacos e toucas de lã. Quando a aluna Sofia olhou pela lente pela primeira vez, seus olhos brilharam: ela pôde ver nitidamente as crateras cinzentas da Lua e quatro luas brilhantes orbitando Júpiter.',
        highlightClue: 'Mais de quarenta alunos do quarto ano compareceram',
      },
      {
        id: 3,
        text: 'O objetivo da atividade não era apenas olhar as estrelas, mas inspirar as crianças a compreenderem que a ciência nasce da curiosidade diária e do cuidado com o nosso planeta Terra.',
        highlightClue: 'inspirar as crianças a compreenderem que a ciência nasce da curiosidade diária',
      },
    ],
  },
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
        highlightClue: 'alcançar uma macieira carregada de frutos suculentos',
      },
      {
        id: 2,
        text: 'Um besouro que passava por ali zombou da formiga, dizendo que ela jamais conseguiria superar um obstáculo tão largo sem asas como as dele. Mas Zoca não se irritou; em vez de desistir, procurou por perto e encontrou uma folha seca e leve de embaúba.',
        highlightClue: 'encontrou uma folha seca e leve de embaúba',
      },
      {
        id: 3,
        text: 'Com a ajuda de suas irmãs do formigueiro, ela empurrou a folha até a margem e usou um graveto fino como leme. Navegou com segurança até o outro lado, provando que a inteligência e a cooperação realizam o que a força bruta não consegue.',
        highlightClue: 'inteligência e a cooperação realizam o que a força bruta não consegue',
      },
    ],
  },
  {
    id: 'horta-comunitaria',
    title: 'Mãos Verdes na Cidade',
    genre: 'Curiosidade Científica',
    authorOrSource: 'Boletim Sustentabilidade na Prática',
    themeIcon: '🌱',
    paragraphs: [
      {
        id: 1,
        text: 'Em um terreno que antes acumulava apenas entulho e pneus velhos no bairro Vila Esperança, os moradores se uniram para criar uma horta comunitária agroecológica. Em apenas seis meses de trabalho coletivo nos finais de semana, o espaço ganhou canteiros suspensos de cenoura, alface crespa e morango.',
        highlightClue: 'seis meses de trabalho coletivo nos finais de semana',
      },
      {
        id: 2,
        text: 'As crianças da comunidade foram as responsáveis por plantar mudas de girassol e alecrim ao redor dos canteiros, pois essas flores atraem abelhas nativas sem ferrão, fundamentais para a polinização de todas as verduras.',
        highlightClue: 'essas flores atraem abelhas nativas sem ferrão, fundamentais para a polinização',
      },
      {
        id: 3,
        text: 'Além de fornecer alimentos frescos e sem veneno para mais de oitenta famílias vizinhas, a horta transformou a convivência do bairro, tornando as tardes de domingo mais alegres e unidas.',
      },
    ],
  },
];

// EF15LP03: Informações Explícitas (Localizar no texto)
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
        explanation: 'Muito bem! No primeiro parágrafo está escrito de forma clara: "Em uma manhã ensolarada de terça-feira no sertão da Caatinga".',
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
    textId: 'tatu-bola',
    paragraphRef: 2,
    question: 'Qual era a cor e o tamanho aproximado da esfera curiosa encontrada por Tiago?',
    clueWord: 'cor marrom-amarelada, do tamanho aproximado de uma bola de tênis',
    options: [
      {
        id: 'a',
        text: 'Era de cor verde-oliva e do tamanho de uma melancia.',
        isCorrect: false,
        explanation: 'No segundo parágrafo, o texto informa que a cor era marrom-amarelada e tinha o tamanho de uma bola de tênis.',
      },
      {
        id: 'b',
        text: 'Era de cor marrom-amarelada e do tamanho aproximado de uma bola de tênis.',
        isCorrect: true,
        explanation: 'Excelente! O parágrafo 2 diz exatamente: "uma esfera perfeita de cor marrom-amarelada, do tamanho aproximado de uma bola de tênis".',
      },
      {
        id: 'c',
        text: 'Era cinza-escura e do tamanho de uma moeda antiga.',
        isCorrect: false,
        explanation: 'Verifique o parágrafo 2: o texto especifica a cor marrom-amarelada e o tamanho de uma bola de tênis.',
      },
      {
        id: 'd',
        text: 'Era branca com listras pretas e do tamanho de uma bola de futebol.',
        isCorrect: false,
        explanation: 'O texto descreve o tatu-bola fechado: marrom-amarelado e do tamanho de uma bola de tênis.',
      },
    ],
  },
  {
    id: 'exp-3',
    textId: 'telescopio-marina',
    paragraphRef: 2,
    question: 'Quantos alunos do quarto ano compareceram à noite de observação astronômica?',
    clueWord: 'Mais de quarenta alunos do quarto ano compareceram',
    options: [
      {
        id: 'a',
        text: 'Exatamente dez alunos.',
        isCorrect: false,
        explanation: 'O número citado no início do parágrafo 2 é bem maior: mais de quarenta alunos.',
      },
      {
        id: 'b',
        text: 'Cerca de cem professores da cidade.',
        isCorrect: false,
        explanation: 'Quem compareceu foram os alunos do quarto ano, não cem professores.',
      },
      {
        id: 'c',
        text: 'Mais de quarenta alunos do quarto ano.',
        isCorrect: true,
        explanation: 'Correto! A informação explícita está no início do parágrafo 2: "Mais de quarenta alunos do quarto ano compareceram".',
      },
      {
        id: 'd',
        text: 'Apenas a aluna Sofia e o professor Marcelo.',
        isCorrect: false,
        explanation: 'O parágrafo 2 cita que mais de quarenta alunos estavam presentes no gramado.',
      },
    ],
  },
  {
    id: 'exp-4',
    textId: 'sabedoria-formiga',
    paragraphRef: 2,
    question: 'O que a formiguinha Zoca usou como embarcação para conseguir cruzar o riacho?',
    clueWord: 'folha seca e leve de embaúba',
    options: [
      {
        id: 'a',
        text: 'Uma casca de noz amarrada com cipó.',
        isCorrect: false,
        explanation: 'No texto não há menção a casca de noz. O parágrafo 2 cita uma folha de embaúba.',
      },
      {
        id: 'b',
        text: 'As asas do besouro que passava pelo local.',
        isCorrect: false,
        explanation: 'O besouro zombou dela e não a ajudou a voar.',
      },
      {
        id: 'c',
        text: 'Uma folha seca e leve de embaúba.',
        isCorrect: true,
        explanation: 'Perfeito! No parágrafo 2 está escrito com todas as letras: "encontrou uma folha seca e leve de embaúba".',
      },
      {
        id: 'd',
        text: 'Uma ponte de pedras empilhadas pelas formigas.',
        isCorrect: false,
        explanation: 'Ela navegou em uma folha seca e leve de embaúba.',
      },
    ],
  },
  {
    id: 'exp-5',
    textId: 'horta-comunitaria',
    paragraphRef: 2,
    question: 'Por qual motivo as crianças plantaram mudas de girassol e alecrim ao redor dos canteiros?',
    clueWord: 'essas flores atraem abelhas nativas sem ferrão, fundamentais para a polinização',
    options: [
      {
        id: 'a',
        text: 'Para espantar pássaros que comiam as verduras.',
        isCorrect: false,
        explanation: 'O texto explica que elas plantaram para atrair abelhas, não para espantar pássaros.',
      },
      {
        id: 'b',
        text: 'Porque essas flores atraem abelhas nativas, essenciais para a polinização.',
        isCorrect: true,
        explanation: 'Corretíssimo! O parágrafo 2 declara: "essas flores atraem abelhas nativas sem ferrão, fundamentais para a polinização de todas as verduras".',
      },
      {
        id: 'c',
        text: 'Apenas para enfeitar a entrada da escola.',
        isCorrect: false,
        explanation: 'O motivo ecológico foi atrair abelhas para a polinização dos canteiros.',
      },
      {
        id: 'd',
        text: 'Para fazer chá para os finais de semana.',
        isCorrect: false,
        explanation: 'A função explícita descrita é a polinização feita pelas abelhas.',
      },
    ],
  },
];

// EF35LP03: Ideia Central do Texto (Compreensão Global)
export const CENTRAL_IDEA_QUESTIONS: CentralIdeaQuestion[] = [
  {
    id: 'central-1',
    textId: 'tatu-bola',
    question: 'Qual é a ideia central (tema principal) do texto sobre o tatu-bola?',
    bestHeadlineQuestion: 'Se você fosse o editor de um jornal, qual seria a melhor manchete para este texto?',
    learningTip: 'Dica da Bússola: A ideia central resume o assunto inteiro da história, e não apenas um detalhe como a cor da garrafa ou o juazeiro!',
    options: [
      {
        id: 'a',
        text: 'As características curiosas do tatu-bola e como ele se protege na Caatinga.',
        isCorrect: true,
        explanation: 'Isso aí! Todo o texto é construído para nos apresentar a espécie do tatu-bola, suas defesas naturais e seu habitat.',
      },
      {
        id: 'b',
        text: 'A importância de levar garrafas de água fresca para caminhadas no sertão.',
        isCorrect: false,
        explanation: 'Isso é apenas um detalhe passageiro do primeiro parágrafo, não a ideia central do texto todo.',
      },
      {
        id: 'c',
        text: 'O tamanho das raízes de árvores antigas chamadas juazeiros.',
        isCorrect: false,
        explanation: 'O juazeiro foi apenas o local onde avistaram o animal; o foco principal é o tatu-bola.',
      },
      {
        id: 'd',
        text: 'As diferenças entre bolas de tênis e bolas de futebol.',
        isCorrect: false,
        explanation: 'A bola de tênis foi usada apenas como comparação visual de tamanho.',
      },
    ],
  },
  {
    id: 'central-2',
    textId: 'telescopio-marina',
    question: 'Qual mensagem principal o autor deseja transmitir com a crônica da noite astronômica?',
    bestHeadlineQuestion: 'Qual opção expressa o sentido global de toda a reportagem escolar?',
    learningTip: 'Dica da Bússola: Pense no objetivo final declarado pelo professor Marcelo para todos os estudantes.',
    options: [
      {
        id: 'a',
        text: 'A experiência prática com o telescópio desperta nas crianças o amor pela ciência e pela observação do mundo.',
        isCorrect: true,
        explanation: 'Sensacional! O texto mostra como a noite de observação serviu para conectar as crianças com o universo e despertar o gosto pela ciência.',
      },
      {
        id: 'b',
        text: 'A importância de usar toucas de lã quando a temperatura cai à noite.',
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
    id: 'central-3',
    textId: 'sabedoria-formiga',
    question: 'Qual é o ensinamento (moral) central que resume a fábula da formiga Zoca?',
    bestHeadlineQuestion: 'Qual ditado ou lição resume melhor o desfecho da fábula?',
    learningTip: 'Dica da Bússola: Na fábula, a ideia central quase sempre é a lição que os personagens aprendem no final.',
    options: [
      {
        id: 'a',
        text: 'Com paciência, planejamento e união, é possível superar desafios que parecem impossíveis.',
        isCorrect: true,
        explanation: 'Exato! A fábula conclui demonstrando que a cooperação e a sabedoria vencem obstáculos maiores do que a força.',
      },
      {
        id: 'b',
        text: 'Formigas devem sempre morar longe de riachos perigosos.',
        isCorrect: false,
        explanation: 'O texto não ensina isso; a formiga conseguiu realizar a travessia com sucesso.',
      },
      {
        id: 'c',
        text: 'Os besouros são os animais mais sábios de toda a floresta.',
        isCorrect: false,
        explanation: 'Pelo contrário, o besouro zombou e se enganou ao achar que ela não conseguiria.',
      },
      {
        id: 'd',
        text: 'Maçãs caídas na água ficam estragadas rapidamente.',
        isCorrect: false,
        explanation: 'A maçã é apenas a recompensa inicial, não a lição moral da história.',
      },
    ],
  },
  {
    id: 'central-4',
    textId: 'horta-comunitaria',
    question: 'De forma geral, o que o texto demonstra sobre a horta comunitária?',
    bestHeadlineQuestion: 'Qual é o tema principal da notícia sobre a Vila Esperança?',
    learningTip: 'Dica da Bússola: Observe a transformação do espaço e o impacto na vida dos vizinhos.',
    options: [
      {
        id: 'a',
        text: 'A união da comunidade pode recuperar espaços abandonados e gerar alimentos saudáveis e convivência.',
        isCorrect: true,
        explanation: 'Muito bem! O texto mostra a transformação completa de um terreno de entulho em um lugar verde de saúde e união social.',
      },
      {
        id: 'b',
        text: 'O preço das sementes de cenoura nas lojas da cidade.',
        isCorrect: false,
        explanation: 'O texto não foca em valores financeiros ou comércio de sementes.',
      },
      {
        id: 'c',
        text: 'Como fabricar pneus velhos a partir de borracha sintética.',
        isCorrect: false,
        explanation: 'Os pneus eram entulho que foi retirado no início, não o tema central.',
      },
      {
        id: 'd',
        text: 'A rotina de compras no supermercado nos finais de semana.',
        isCorrect: false,
        explanation: 'A horta comunitária produziu alimentos próprios para a vizinhança.',
      },
    ],
  },
];

// EF35LP04: Informações Implícitas (Inferir / Ler nas entrelinhas)
export const IMPLICIT_QUESTIONS: ImplicitQuestion[] = [
  {
    id: 'imp-1',
    textId: 'tatu-bola',
    question: 'Por que o tatu-bola se enrolou em formato de esfera assim que percebeu a aproximação de passos?',
    excerptToAnalyze: 'Ao se aproximarem com passos suaves, a bolinha desenrolou lentamente...',
    implicitClue: 'Esta espécie tem a incrível habilidade de se fechar por completo para se defender dos predadores',
    pedagogicalReasoning: 'O texto não diz expressamente que ele sentiu medo de Tiago, mas sabemos que enrolar-se é sua forma natural de autodefesa contra ameaças.',
    options: [
      {
        id: 'a',
        text: 'Porque ele sentiu a vibração dos passos e ativou seu mecanismo de proteção contra possíveis predadores.',
        isCorrect: true,
        explanation: 'Fantástica dedução! Embora o texto não diga "o tatu teve medo", deduzimos isso porque o autor explica que enrolar-se é a defesa contra predadores.',
      },
      {
        id: 'b',
        text: 'Porque ele estava dormindo profundamente e gosta de rolar como brinquedo.',
        isCorrect: false,
        explanation: 'O formato esférico não é brincadeira, é uma estratégia biológica de sobrevivência.',
      },
      {
        id: 'c',
        text: 'Porque ele queria fingir ser uma pedra preciosa para ser levado embora.',
        isCorrect: false,
        explanation: 'Animais selvagens não buscam ser capturados; eles procuram segurança.',
      },
      {
        id: 'd',
        text: 'Porque ele estava com fome e procurava comida dentro da própria carapaça.',
        isCorrect: false,
        explanation: 'A carapaça serve de armadura para proteger a cabeça e as patas.',
      },
    ],
  },
  {
    id: 'imp-2',
    textId: 'telescopio-marina',
    question: 'O que a expressão "seus olhos brilharam" revela sobre os sentimentos da aluna Sofia ao olhar pela lente?',
    excerptToAnalyze: 'Quando a aluna Sofia olhou pela lente pela primeira vez, seus olhos brilharam...',
    implicitClue: 'ela pôde ver nitidamente as crateras cinzentas da Lua e quatro luas brilhantes orbitando Júpiter',
    pedagogicalReasoning: 'Dizer que os olhos brilharam é uma metáfora que expressa fascínio, encantamento e profunda admiração, e não uma luz física que acendeu no rosto.',
    options: [
      {
        id: 'a',
        text: 'Ela sentiu grande encantamento, surpresa e admiração diante da beleza do céu estrelado.',
        isCorrect: true,
        explanation: 'Brilhante interpretação! "Olhos brilharem" é uma figura de linguagem para representar fascínio e empolgação diante de algo incrível.',
      },
      {
        id: 'b',
        text: 'Ela ficou com dor de cabeça e seus olhos ficaram sensíveis à escuridão.',
        isCorrect: false,
        explanation: 'A expressão tem sentido positivo de deslumbramento e curiosidade.',
      },
      {
        id: 'c',
        text: 'Alguém acendeu uma lanterna muito forte bem dentro dos olhos dela.',
        isCorrect: false,
        explanation: 'Trata-se de uma metáfora para demonstrar emoção, não luz de lanterna.',
      },
      {
        id: 'd',
        text: 'Ela ficou com muito sono e queria ir para casa descansar.',
        isCorrect: false,
        explanation: 'Pelo contrário, ela ficou maravilhada com o que estava descobrindo.',
      },
    ],
  },
  {
    id: 'imp-3',
    textId: 'sabedoria-formiga',
    question: 'Por que o besouro zombou da formiga quando a viu perto do riacho?',
    excerptToAnalyze: 'Um besouro que passava por ali zombou da formiga, dizendo que ela jamais conseguiria superar um obstáculo tão largo sem asas como as dele...',
    implicitClue: 'dizendo que ela jamais conseguiria superar um obstáculo tão largo sem asas como as dele',
    pedagogicalReasoning: 'O besouro se achava superior por ter asas e duvidou da capacidade de quem não tinha os mesmos recursos físicos que ele.',
    options: [
      {
        id: 'a',
        text: 'Porque ele se considerava superior por ter asas e acreditava que só com força física ou vôo seria possível atravessar.',
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
        text: 'Porque ele sabia que a folha de embaúba iria afundar no riacho.',
        isCorrect: false,
        explanation: 'A folha não afundou, e ele nem sabia que ela usaria essa estratégia.',
      },
      {
        id: 'd',
        text: 'Porque as formigas tinham roubado a comida preferida dele.',
        isCorrect: false,
        explanation: 'Não há menção de conflito de comida entre eles no texto.',
      },
    ],
  },
  {
    id: 'imp-4',
    textId: 'horta-comunitaria',
    question: 'Podemos inferir que, antes da criação da horta comunitária, o terreno causava qual impacto para a vizinhança?',
    excerptToAnalyze: 'Em um terreno que antes acumulava apenas entulho e pneus velhos no bairro Vila Esperança...',
    implicitClue: 'acumulava apenas entulho e pneus velhos',
    pedagogicalReasoning: 'Entulho e pneus velhos acumulam água de chuva, atraem mosquitos (como da dengue) e desvalorizam o ambiente, gerando risco à saúde e aspecto de abandono.',
    options: [
      {
        id: 'a',
        text: 'Trazia preocupações com sujeira, possíveis criadouros de mosquitos e sensação de abandono.',
        isCorrect: true,
        explanation: 'Excelente raciocínio! Pneus velhos e entulhos são conhecidos por reter água parada e atrair pragas, tornando o local desagradável e perigoso.',
      },
      {
        id: 'b',
        text: 'Era o parque mais visitado e seguro de toda a região.',
        isCorrect: false,
        explanation: 'Um terreno com entulho e pneus não era um parque seguro.',
      },
      {
        id: 'c',
        text: 'Servia como pista profissional de corrida de bicicletas velozes.',
        isCorrect: false,
        explanation: 'Não há nenhuma pista, era apenas acúmulo de sujeira descartada.',
      },
      {
        id: 'd',
        text: 'Era uma floresta nativa preservada com animais raros.',
        isCorrect: false,
        explanation: 'O texto diz claramente que acumulava lixo e entulho.',
      },
    ],
  },
];

// EF05LP03: Acentuação de Oxítonas, Paroxítonas e Proparoxítonas
// Rules:
// 1. Proparoxítonas: a antepenúltima é tônica. REGRA: TODAS são acentuadas! (Ex: lâmpada, árvore, matemática, música, xícara, pássaro)
// 2. Oxítonas: a última é tônica. São acentuadas se terminarem em: a(s), e(s), o(s), em, ens. (Ex: café, cipó, você, sabiá, sofá, armazém, parabéns). Não acentua as terminadas em r, l, z, i, u (exceto hiato) como: papel, tambor, saci, urubu, caju.
// 3. Paroxítonas: a penúltima é tônica. NÃO são acentuadas as terminadas em a, e, o, em/ens (a maioria: janela, livro, escola, menino). SÃO acentuadas as que terminam em r, x, n, l, ps, ã, ão, um, uns, i, us, ditongo (fácil, tórax, álbum, vírus, lápis, júri, órfão).
export const SYLLABLE_EXERCISES: SyllableExercise[] = [
  // Proparoxítonas (todas têm acento)
  {
    id: 'syl-1',
    word: 'lâmpada',
    syllables: ['lâm', 'pa', 'da'],
    tonicIndex: 0, // antepenúltima (0 de 3)
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
    word: 'pássaro',
    syllables: ['pás', 'sa', 'ro'],
    tonicIndex: 0,
    classification: 'proparoxitona',
    needsAccent: true,
    accentRuleExplanation: 'Antepenúltima sílaba tônica = Proparoxítona! Portanto, leva acento agudo na letra "a".',
    wordWithoutAccent: 'passaro',
  },
  {
    id: 'syl-5',
    word: 'relâmpago',
    syllables: ['re', 'lâm', 'pa', 'go'],
    tonicIndex: 1, // antepenúltima (1 de 4: re [3ª], lâm [antepenúltima], pa [penúltima], go [última])
    classification: 'proparoxitona',
    needsAccent: true,
    accentRuleExplanation: 'A antepenúltima sílaba "lâm" é a mais forte. Pela regra de ouro das proparoxítonas, recebe acento circunflexo!',
    wordWithoutAccent: 'relampago',
  },

  // Oxítonas
  {
    id: 'syl-6',
    word: 'café',
    syllables: ['ca', 'fé'],
    tonicIndex: 1, // última
    classification: 'oxitona',
    needsAccent: true,
    accentRuleExplanation: 'É oxítona porque a última sílaba "fé" é a mais forte. Acentua-se porque termina na vogal "e"!',
    wordWithoutAccent: 'cafe',
  },
  {
    id: 'syl-7',
    word: 'sofá',
    syllables: ['so', 'fá'],
    tonicIndex: 1,
    classification: 'oxitona',
    needsAccent: true,
    accentRuleExplanation: 'É oxítona com última sílaba tônica ("fá"). Acentuamos oxítonas terminadas em "a(s)".',
    wordWithoutAccent: 'sofa',
  },
  {
    id: 'syl-8',
    word: 'cipó',
    syllables: ['ci', 'pó'],
    tonicIndex: 1,
    classification: 'oxitona',
    needsAccent: true,
    accentRuleExplanation: 'Oxítona terminada em "o". As oxítonas que terminam em a, e, o, em/ens sempre levam acento!',
    wordWithoutAccent: 'cipo',
  },
  {
    id: 'syl-9',
    word: 'tambor',
    syllables: ['tam', 'bor'],
    tonicIndex: 1,
    classification: 'oxitona',
    needsAccent: false,
    accentRuleExplanation: 'A última sílaba "bor" é a mais forte, portanto é OXÍTONA. Mas NÃO leva acento porque termina em "r" (oxítonas só levam acento terminadas em a, e, o, em/ens).',
    wordWithoutAccent: 'tambor',
  },
  {
    id: 'syl-10',
    word: 'caju',
    syllables: ['ca', 'ju'],
    tonicIndex: 1,
    classification: 'oxitona',
    needsAccent: false,
    accentRuleExplanation: 'É oxítona (a sílaba forte é "ju"), porém oxítonas terminadas em "u" NÃO recebem acento gráfico!',
    wordWithoutAccent: 'caju',
  },
  {
    id: 'syl-11',
    word: 'parabéns',
    syllables: ['pa', 'ra', 'béns'],
    tonicIndex: 2,
    classification: 'oxitona',
    needsAccent: true,
    accentRuleExplanation: 'Oxítona terminada em "ens"! A regra determina que oxítonas terminadas em "em" ou "ens" recebem acento gráfico.',
    wordWithoutAccent: 'parabens',
  },

  // Paroxítonas
  {
    id: 'syl-12',
    word: 'fácil',
    syllables: ['fá', 'cil'],
    tonicIndex: 0, // penúltima
    classification: 'paroxitona',
    needsAccent: true,
    accentRuleExplanation: 'É paroxítona (sílaba forte é a penúltima "fá"). Recebe acento porque termina na letra "L"!',
    wordWithoutAccent: 'facil',
  },
  {
    id: 'syl-13',
    word: 'janela',
    syllables: ['ja', 'ne', 'la'],
    tonicIndex: 1, // penúltima
    classification: 'paroxitona',
    needsAccent: false,
    accentRuleExplanation: 'A sílaba forte é "ne" (penúltima), logo é PAROXÍTONA. Não leva acento porque paroxítonas terminadas em "a" não são acentuadas!',
    wordWithoutAccent: 'janela',
  },
  {
    id: 'syl-14',
    word: 'álbum',
    syllables: ['ál', 'bum'],
    tonicIndex: 0,
    classification: 'paroxitona',
    needsAccent: true,
    accentRuleExplanation: 'Paroxítona com sílaba tônica "ál". Leva acento porque termina em "um" (como fórum, álbum).',
    wordWithoutAccent: 'album',
  },
  {
    id: 'syl-15',
    word: 'caderno',
    syllables: ['ca', 'der', 'no'],
    tonicIndex: 1,
    classification: 'paroxitona',
    needsAccent: false,
    accentRuleExplanation: 'A sílaba mais forte é a penúltima ("der"). É paroxítona, mas sem acento pois termina em "o".',
    wordWithoutAccent: 'caderno',
  },
  {
    id: 'syl-16',
    word: 'tórax',
    syllables: ['tó', 'rax'],
    tonicIndex: 0,
    classification: 'paroxitona',
    needsAccent: true,
    accentRuleExplanation: 'Paroxítona terminada na consoante "x"! As paroxítonas terminadas em r, x, n, l recebem acento gráfico.',
    wordWithoutAccent: 'torax',
  },
  {
    id: 'syl-17',
    word: 'amigo',
    syllables: ['a', 'mi', 'go'],
    tonicIndex: 1,
    classification: 'paroxitona',
    needsAccent: false,
    accentRuleExplanation: 'A penúltima sílaba "mi" é a mais forte. É paroxítona natural terminada em "o", portanto sem acento.',
    wordWithoutAccent: 'amigo',
  },
];
