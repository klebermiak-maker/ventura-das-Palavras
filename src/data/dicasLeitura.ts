export interface ReadingStrategy {
  id: string;
  skill: 'EF35LP03' | 'EF35LP04';
  skillTitle: string;
  skillBadge: string;
  title: string;
  subtitle: string;
  icon: string;
  colorScheme: 'sky' | 'amber' | 'emerald' | 'indigo' | 'purple';
  stepByStep: string[];
  exampleText: string;
  clueFound: string;
  deductionResult: string;
  commonMistake: string;
  mentorTip: string;
  missionTarget: 'central' | 'implicitas';
  miniQuiz: {
    question: string;
    options: { text: string; isCorrect: boolean; explanation: string }[];
  };
}

export const READING_STRATEGIES: ReadingStrategy[] = [
  {
    id: 'strat-1',
    skill: 'EF35LP03',
    skillTitle: 'Identificar a Ideia Central',
    skillBadge: 'EF35LP03 · Bússola do Tema',
    title: 'A Pergunta de Ouro: Do Começo ao Fim',
    subtitle: 'Como descobrir a mensagem global do texto sem se perder em detalhes',
    icon: '🧭',
    colorScheme: 'sky',
    stepByStep: [
      'Faça a leitura completa do texto do início ao fim sem interrupções.',
      'Feche os olhos por 5 segundos e faça a Pergunta de Ouro: "Se eu tivesse que contar essa história em uma única frase para um colega, o que eu diria?".',
      'Verifique se essa frase abrange tanto o começo quanto o meio e o desfecho.',
      'Descarte alternativas que falem apenas sobre o que aconteceu em um único parágrafo.'
    ],
    exampleText: 'Um grupo de vizinhos se reuniu em um sábado para limpar uma praça abandonada. Pintaram os bancos, plantaram mudas de ipê amarelo e montaram uma horta comunitária. Ao final da tarde, crianças brincavam e os moradores lanchavam juntos com orgulho.',
    clueFound: 'Todos os parágrafos giram em torno da união dos vizinhos para transformar um espaço público.',
    deductionResult: 'Ideia Central: A cooperação comunitária revitaliza espaços públicos e une as pessoas.',
    commonMistake: 'Achar que a ideia central é "as crianças comeram bolo no lanche" — isso é só um detalhe do final!',
    mentorTip: 'A ideia central é como o tronco de uma árvore: os galhos e folhas são os detalhes, mas o tronco sustenta tudo.',
    missionTarget: 'central',
    miniQuiz: {
      question: 'Ao ler uma crônica sobre a amizade entre um cão e um pássaro, qual alternativa expressa a IDEIA CENTRAL?',
      options: [
        {
          text: 'O pássaro comia migalhas de pão na calçada às 8 horas da manhã.',
          isCorrect: false,
          explanation: 'Isso é apenas um detalhe secundário de tempo e ação inicial.'
        },
        {
          text: 'A amizade e a lealdade podem surgir mesmo entre seres muito diferentes.',
          isCorrect: true,
          explanation: 'Excelente! Essa frase resume o sentido global e a mensagem de toda a narrativa.'
        },
        {
          text: 'O quintal onde eles viviam tinha uma cerca de madeira branca.',
          isCorrect: false,
          explanation: 'A cerca é apenas o cenário físico, não a mensagem principal da crônica.'
        }
      ]
    }
  },
  {
    id: 'strat-2',
    skill: 'EF35LP04',
    skillTitle: 'Inferir Informações Implícitas',
    skillBadge: 'EF35LP04 · Mago das Entrelinhas',
    title: 'A Equação do Mago: Texto + Experiência',
    subtitle: 'Como ler o que o autor não escreveu com palavras diretas',
    icon: '🕵️',
    colorScheme: 'amber',
    stepByStep: [
      'Identifique a pista escrita: grife palavras que descrevem ações, sons, objetos ou vestimentas.',
      'Consulte sua bagagem de vida: "O que normalmente acontece quando alguém faz isso?".',
      'Junte os dois lados na Equação: Pista do Texto + Conhecimento de Mundo = Dedução Correta!',
      'Confirme se a sua conclusão faz sentido com o restante da história.'
    ],
    exampleText: 'Lucas calçou as galochas amarelas, abriu o grande guarda-chuva azul e escutou o tamborilar ritmado no telhado de zinco antes de pisar na calçada encharcada.',
    clueFound: 'Palavras: "galochas", "guarda-chuva", "tamborilar no telhado", "calçada encharcada".',
    deductionResult: 'Inferência: Está chovendo torrencialmente, mesmo que a palavra "chuva" não apareça.',
    commonMistake: 'Dizer que Lucas vai para a praia porque é feriado — o texto não dá nenhuma pista disso.',
    mentorTip: 'Ler nas entrelinhas é como ser um detetive: o autor espalha pegadas e você descobre quem passou por ali!',
    missionTarget: 'implicitas',
    miniQuiz: {
      question: '"Dona Clara olhou o termômetro na parede, colocou o cachecol de lã grossa e preparou um chá fumegante". O que se pode inferir?',
      options: [
        {
          text: 'O clima está muito frio naquele dia.',
          isCorrect: true,
          explanation: 'Correto! Cachecol de lã e chá fumegante são pistas clássicas de temperaturas baixas.'
        },
        {
          text: 'Dona Clara está atrasada para pegar o ônibus.',
          isCorrect: false,
          explanation: 'Não há pistas de pressa ou transporte no trecho apresentado.'
        },
        {
          text: 'É pleno verão de muito calor na praia.',
          isCorrect: false,
          explanation: 'Ninguém usa cachecol de lã grossa no calor intenso de verão!'
        }
      ]
    }
  },
  {
    id: 'strat-3',
    skill: 'EF35LP03',
    skillTitle: 'Identificar a Ideia Central',
    skillBadge: 'EF35LP03 · Bússola do Tema',
    title: 'O Radar do Título e dos Parágrafos Extremos',
    subtitle: 'Descobrindo o tema logo nas primeiras e últimas pistas do texto',
    icon: '🎯',
    colorScheme: 'emerald',
    stepByStep: [
      'Analise o título com lupa: muitas vezes o título já entrega o grande tema da história.',
      'Leia o primeiro parágrafo prestando atenção à apresentação do conflito ou situação.',
      'Vá direto ao último parágrafo e veja como a história se encerra e qual lição permaneceu.',
      'Compare se o título e o final confirmam a mesma mensagem central.'
    ],
    exampleText: 'Título: "A Coragem da Pequena Andorinha". No primeiro parágrafo, uma jovem andorinha teme a primeira migração além das montanhas. No último parágrafo, após ajudar suas irmãs na travessia tempestuosa, ela percebe que a verdadeira coragem não é a ausência de medo, mas a capacidade de seguir adiante.',
    clueFound: 'O título anuncia "A Coragem", o início mostra o medo inicial e o final define a superação.',
    deductionResult: 'Ideia Central: A superação dos próprios medos através da coragem e do apoio mútuo.',
    commonMistake: 'Achar que a ideia central é "a velocidade do bater das asas da andorinha".',
    mentorTip: 'O título é o cartão de visitas do texto; o final é o aperto de mão que sela a grande mensagem!',
    missionTarget: 'central',
    miniQuiz: {
      question: 'Qual é o melhor momento para checar o título e o desfecho ao procurar a ideia central?',
      options: [
        {
          text: 'Antes de ler o texto e imediatamente após terminar a primeira leitura.',
          isCorrect: true,
          explanation: 'Muito bem! Essa comparação reforça a bússola temática em sua mente.'
        },
        {
          text: 'Apenas quando errar a questão três vezes consecutivas.',
          isCorrect: false,
          explanation: 'Devemos usar a estratégia proativamente na primeira leitura, e não apenas no erro.'
        },
        {
          text: 'Nunca, pois o título costuma enganar o leitor de propósito.',
          isCorrect: false,
          explanation: 'Em textos didáticos e literários da BNCC, o título tem conexão direta com a ideia central.'
        }
      ]
    }
  },
  {
    id: 'strat-4',
    skill: 'EF35LP04',
    skillTitle: 'Inferir Informações Implícitas',
    skillBadge: 'EF35LP04 · Mago das Entrelinhas',
    title: 'Caçando Emoções nos Gestos e Expressões',
    subtitle: 'Como deduzir o que o personagem sente sem que ele precise dizer',
    icon: '🎭',
    colorScheme: 'purple',
    stepByStep: [
      'Procure verbos de ação física: roer unhas, bater portas, abrir sorrisos largos, engolir seco.',
      'Observe a postura corporal: ombros caídos, olhar fixo no chão, passos saltitantes.',
      'Traduza o gesto para a emoção correspondente usando a psicologia do leitor.',
      'Não confunda o sentimento do personagem com o que você sentiria na mesma situação.'
    ],
    exampleText: 'Quando o professor anunciou que entregaria as notas da olimpíada de matemática, Mariana começou a balançar a perna sem parar, apertou o estojo entre as mãos suadas e prendeu a respiração a cada nome chamado.',
    clueFound: 'Pistas corporais: "balançar perna sem parar", "mãos suadas", "prender a respiração".',
    deductionResult: 'Inferência: Mariana estava tomada por forte ansiedade, nervosismo e expectativa.',
    commonMistake: 'Achar que Mariana estava com sono ou com preguiça de fazer a aula.',
    mentorTip: 'O corpo fala nos textos! Quem morde os lábios e não olha nos olhos está escondendo algo ou inseguro.',
    missionTarget: 'implicitas',
    miniQuiz: {
      question: 'Se um texto descreve que "Tiago saltava pelos degraus cantarolando com os olhos brilhantes", o que podemos inferir?',
      options: [
        {
          text: 'Tiago está com muita pressa porque vai perder a hora do almoço.',
          isCorrect: false,
          explanation: 'Quem tem pressa e aflição não cantarola alegremente pelos degraus.'
        },
        {
          text: 'Tiago está triste com uma notícia difícil que recebeu.',
          isCorrect: false,
          explanation: 'Olhos brilhantes e cantarolar são expressões clássicas de júbilo e entusiasmo.'
        },
        {
          text: 'Tiago está extremamente alegre e comemorando algo positivo.',
          isCorrect: true,
          explanation: 'Exato! O comportamento corporal e musical expressa pura alegria e satisfação!'
        }
      ]
    }
  },
  {
    id: 'strat-5',
    skill: 'EF35LP03',
    skillTitle: 'Identificar a Ideia Central',
    skillBadge: 'EF35LP03 · Bússola do Tema',
    title: 'A Técnica da Paráfrase Resumidora',
    subtitle: 'Como reescrever com suas próprias palavras para testar se entendeu',
    icon: '📝',
    colorScheme: 'indigo',
    stepByStep: [
      'Após ler cada parágrafo, anote 2 ou 3 palavras-chave ao lado.',
      'No final, junte essas anotações e monte uma oração simples.',
      'Compare sua oração com as 4 opções da questão.',
      'A opção que disser a mesma coisa com outras palavras (sinônimos) é o gabarito!'
    ],
    exampleText: 'Muitas espécies de abelhas estão sumindo por causa do uso excessivo de agrotóxicos e do desmatamento. Sem abelhas, as flores não são polinizadas e as frutas e grãos deixam de nascer, ameaçando o fornecimento de alimentos para todos nós.',
    clueFound: 'Palavras: sumiço de abelhas -> falta de polinização -> ameaça à produção de comida.',
    deductionResult: 'Ideia Central: A importância das abelhas na polinização e os riscos do seu desaparecimento para a humanidade.',
    commonMistake: 'Pensar que o texto é uma receita de mel ou sobre picadas de inseto.',
    mentorTip: 'Paráfrase é dizer o mesmo conteúdo usando seu próprio vocabulário de leitor inteligente!',
    missionTarget: 'central',
    miniQuiz: {
      question: 'O que significa parafrasear a ideia central de um texto?',
      options: [
        {
          text: 'Copiar exatamente a primeira linha do texto sem mudar nenhuma vírgula.',
          isCorrect: false,
          explanation: 'Isso é apenas cópia literal, não demonstra se você realmente compreendeu o tema.'
        },
        {
          text: 'Expressar o sentido principal do texto utilizando palavras diferentes e vocabulário próprio.',
          isCorrect: true,
          explanation: 'Perfeito! A paráfrase prova que o cérebro processou e compreendeu a ideia do autor.'
        },
        {
          text: 'Inventar um final completamente diferente para a história.',
          isCorrect: false,
          explanation: 'Mudar a história altera os fatos, enquanto a paráfrase preserva o sentido original.'
        }
      ]
    }
  },
  {
    id: 'strat-6',
    skill: 'EF35LP04',
    skillTitle: 'Inferir Informações Implícitas',
    skillBadge: 'EF35LP04 · Mago das Entrelinhas',
    title: 'Rastreador de Cenários e Épocas Ocultas',
    subtitle: 'Como descobrir onde e quando a história acontece através de indícios',
    icon: '🏰',
    colorScheme: 'sky',
    stepByStep: [
      'Procure palavras que indiquem tecnologia: lampião a gás vs. lâmpada led; cavalo vs. carro elétrico.',
      'Repare na vegetação e clima: cactos e terra rachada (sertão/caatinga); pinheiros e neve (clima temperado).',
      'Identifique os sons do ambiente: sirenes e buzinas (cidade grande); canto de cigarras e mugidos (campo).',
      'Combine as pistas para cravar o local ou a época sem margem para dúvidas.'
    ],
    exampleText: 'O cavaleiro amarrou as rédeas do alazão no tronco da carvalha, retirou o elmo de ferro pesado e acendeu uma tocha para iluminar o portal de pedra do castelo.',
    clueFound: 'Indícios: "cavaleiro", "alazão", "elmo de ferro", "tocha", "portal do castelo".',
    deductionResult: 'Inferência: O conto se passa na Idade Média (época medieval), e não nos dias atuais.',
    commonMistake: 'Achar que o cavaleiro estava indo pegar o metrô.',
    mentorTip: 'Objetos e meios de transporte contam a história secreta do tempo e do espaço!',
    missionTarget: 'implicitas',
    miniQuiz: {
      question: 'Se um texto cita "o som de buzinas ensurdecedoras, pedestres apressados entre os arranha-céus e fumaça de escapamentos", onde se passa a cena?',
      options: [
        {
          text: 'Em uma aldeia isolada nas montanhas do Tibete.',
          isCorrect: false,
          explanation: 'Aldeias não possuem arranha-céus ou trânsito intenso de escapamentos.'
        },
        {
          text: 'Em uma grande metrópole urbana contemporânea.',
          isCorrect: true,
          explanation: 'Correto! Arranha-céus, tráfego pesado e multidões caracterizam grandes cidades.'
        },
        {
          text: 'Em uma fazenda de gado no interior.',
          isCorrect: false,
          explanation: 'O ambiente rural é caracterizado por silêncio, vegetação e animais, não arranha-céus.'
        }
      ]
    }
  }
];
