/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AlbumConfig } from "./types";

export const defaultAlbumConfig: AlbumConfig = {
  couple: {
    partner1: "Gabriel",
    partner2: "Mariana",
    startDate: "2024-06-12",
    proposalType: "namoro",
    coverPhoto: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=800",
  },
  story: {
    firstContactText: "Tudo começou com uma mensagem despretensiosa em uma tarde ensolarada. Um comentário sobre uma música que ambos amavam abriu as portas para horas seguidas de conversa, risadas e a certeza de que estávamos diante de alguém muito especial.",
    firstContactDate: "2024-04-15",
    firstContactPhoto: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=800",
    firstContactChatSnippet: "Gabriel: 'Não acredito que você também ouve essa banda! Pensei que só eu conhecesse.'\nMariana: 'Mentira! É a minha música favorita da vida! 😍'",
    meetingPlaceCoordinates: {
      lat: -23.56168,
      lng: -46.65598,
      label: "Parque do Ibirapuera, São Paulo",
    },
  },
  timeline: [
    {
      id: "tl-1",
      title: "Nosso Primeiro Encontro",
      date: "2024-05-01",
      description: "O nervosismo no estômago, o sorriso tímido ao longe e o primeiro abraço que fez parecer que o mundo inteiro tinha parado de girar. Passamos horas conversando no café como se já nos conhecêssemos há anos.",
      photo: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=800",
    },
    {
      id: "tl-2",
      title: "Primeira Viagem Juntos",
      date: "2024-10-12",
      description: "Uma escapada de fim de semana para a praia. Pegamos chuva no caminho, cantamos todas as músicas desafinados no carro e assistimos ao pôr do sol mais lindo das nossas vidas.",
      photo: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=800",
    },
    {
      id: "tl-3",
      title: "Primeira Foto Oficial",
      date: "2024-05-15",
      description: "A foto que mandamos para os nossos amigos mais próximos quando decidimos que não dava mais para esconder a felicidade gigante que estávamos vivendo juntos.",
      photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800",
    },
  ],
  memories: [
    {
      id: "mem-1",
      category: "kiss",
      title: "Nosso primeiro beijo 💋",
      description: "Sob a luz suave de um poste no final do nosso terceiro encontro. Um momento mágico em que o tempo simplesmente congelou e o coração bateu acelerado.",
      photo: "https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?q=80&w=800",
    },
    {
      id: "mem-2",
      category: "trip",
      title: "Nossa primeira viagem ✈️",
      description: "Explorar novos lugares com você transformou qualquer destino simples em uma aventura inesquecível de tirar o fôlego.",
      photo: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=800",
    },
    {
      id: "mem-3",
      category: "anniversary",
      title: "Nosso primeiro aniversário 🎂",
      description: "Um jantar romântico à luz de velas feito em casa, celebrando todos os sorrisos compartilhados, as piadas internas e o amor crescendo a cada dia.",
      photo: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=800",
    },
    {
      id: "mem-4",
      category: "unforgettable",
      title: "Aquele dia inesquecível ✨",
      description: "Quando deitamos sob o céu aberto para assistir à chuva de meteoros, enrolados em um cobertor quentinho, dividindo fones de ouvido e conversando sobre o universo.",
      photo: "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=800",
    },
  ],
  qualities: [
    {
      id: "qual-1",
      title: "Seu Sorriso",
      description: "Ilumina até os meus dias mais cinzentos. Ele tem o superpoder instantâneo de me trazer paz e me fazer sorrir de volta sem nem perceber.",
      icon: "Smile",
    },
    {
      id: "qual-2",
      title: "Seu Carinho",
      description: "A forma como você me abraça de surpresa ou segura a minha mão no carro. Seu toque me transmite segurança e me faz sentir em casa.",
      icon: "Heart",
    },
    {
      id: "qual-3",
      title: "Seu jeito de cuidar de mim",
      description: "Desde lembrar de mim com um doce que eu gosto até me apoiar nas minhas maiores inseguranças. Sua empatia e generosidade são inspiradoras.",
      icon: "Sparkles",
    },
    {
      id: "qual-4",
      title: "Como você me faz feliz",
      description: "A vida ganhou mais cor, mais música e muito mais sentido desde que você entrou nela. Ao seu lado, sou a minha melhor versão.",
      icon: "Sun",
    },
  ],
  dreams: [
    {
      id: "dream-1",
      title: "Viagem dos Sonhos juntos",
      description: "Explorar os canais de Veneza, andar pelas ruas floridas de Paris ou acampar sob a Aurora Boreal.",
      photo: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800",
      category: "viagem",
    },
    {
      id: "dream-2",
      title: "Nosso Cantinho no Mundo",
      description: "Construir uma casinha aconchegante com uma janela grande, muitos livros na estante, plantas na varanda e espaço para nossos bichinhos.",
      photo: "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?q=80&w=800",
      category: "casa",
    },
    {
      id: "dream-3",
      title: "Envelhecer Sorrindo",
      description: "Apoiar a carreira um do outro, comemorar pequenas vitórias diárias e continuar rindo das mesmas piadas bobas daqui a cinquenta anos.",
      photo: "https://images.unsplash.com/photo-1464746133101-a2c3f88e0dd9?q=80&w=800",
      category: "meta",
    },
  ],
  quiz: [
    {
      id: "q-1",
      question: "Onde foi o nosso primeiro encontro oficial?",
      options: [
        "No parque tomando sorvete",
        "No aconchegante café no centro da cidade",
        "No cinema assistindo a um filme de terror",
        "Em um show de rock barulhento"
      ],
      correctIndex: 1,
      hint: "Tinha aroma de grãos moídos na hora e um clima super intimista...",
    },
    {
      id: "q-2",
      question: "Quem deu o primeiro passo e se apaixonou primeiro?",
      options: [
        "Gabriel, com toda a certeza do mundo!",
        "Mariana, embora tente negar até hoje!",
        "Foi mútuo e instantâneo, no primeiro olhar!",
        "Nenhum dos dois, foi por insistência dos amigos!"
      ],
      correctIndex: 0,
      hint: "Dica: quem mandou o textão de boa noite primeiro?",
    },
    {
      id: "q-3",
      question: "Qual música define o nosso relacionamento?",
      options: [
        "A canção indie que tocava no rádio daquele café",
        "Aquele sertanejo animado de churrasco",
        "Uma clássica balada de rock dos anos 80",
        "O hit eletrônico que ouvimos na viagem"
      ],
      correctIndex: 0,
      hint: "Foi a faixa musical que gerou nosso primeiro contato nas redes sociais!",
    },
  ],
  secretLetter: {
    title: "Minha Carta de Amor Secreta para Você",
    content: "Querido amor,\n\nSe você está lendo isso, significa que desvendou todos os mistérios do nosso quiz e trilhou nossa linda linha do tempo de memórias.\n\nEscrever isso é fácil porque falar de você é falar de felicidade. Desde que você entrou na minha vida, as segundas-feiras ficaram mais leves, as risadas ganharam mais eco e o futuro pareceu um lugar extremamente convidativo e lindo.\n\nObrigado(a) por ser meu porto seguro, meu riso frouxo, e a pessoa com quem quero compartilhar cada amanhecer e pôr do sol. Meu amor por você cresce em detalhes: no jeito que você pisca quando ri, na segurança do seu abraço e no som da sua voz.\n\nEstarei sempre aqui, aplaudindo suas vitórias e te amparando nos dias cansativos. Você é a minha escolha todos os dias.\n\nCom todo o meu amor,\nSeu par ideal ❤️",
    unlockedByQuiz: true,
  },
  audioTrack: {
    type: "synth",
    synthMelodyName: "romantic_progression",
  },
};
