
import { Card, Pack, SchoolEvent, Trade } from '@/types';

export const mockCards: Card[] = [
  {
    id: 'card1',
    name: 'Painel Solar IFPR',
    rarity: 'common',
    imageUrl: '/placeholder.svg?height=300&width=200',
    available: true,
    description: 'Representa o compromisso do IFPR com energia sustentável',
    price: 15
  },
  {
    id: 'card2',
    name: 'Laboratório de Robótica',
    rarity: 'rare',
    imageUrl: '/placeholder.svg?height=300&width=200',
    available: true,
    description: 'O laboratório mais avançado para desenvolvimento de robôs',
    price: 35
  },
  {
    id: 'card3',
    name: 'Mascote IFPR Dourado',
    rarity: 'legendary',
    imageUrl: '/placeholder.svg?height=300&width=200',
    available: true,
    copiesAvailable: 50,
    description: 'Edição especial dourada do mascote oficial do IFPR',
    price: 75
  },
  {
    id: 'card4',
    name: 'Fundadores do IFPR',
    rarity: 'mythic',
    imageUrl: '/placeholder.svg?height=300&width=200',
    available: true,
    copiesAvailable: 10,
    description: 'Carta raríssima dos fundadores da instituição',
    price: 150
  },
  {
    id: 'card5',
    name: 'Biblioteca Central',
    rarity: 'common',
    imageUrl: '/placeholder.svg?height=300&width=200',
    available: true,
    description: 'O coração do conhecimento do campus',
    price: 12
  },
  {
    id: 'card6',
    name: 'Competição de Programação',
    rarity: 'rare',
    imageUrl: '/placeholder.svg?height=300&width=200',
    available: true,
    eventId: 'event1',
    description: 'Evento especial de programação competitiva',
    price: 40
  }
];

export const mockPacks: Pack[] = [
  {
    id: 'pack1',
    name: 'Pacote Iniciante',
    available: true,
    limitPerStudent: 5,
    price: 50,
    cardProbabilities: {
      common: 70,
      rare: 25,
      legendary: 4,
      mythic: 1
    }
  },
  {
    id: 'pack2',
    name: 'Pacote Premium',
    available: true,
    limitPerStudent: 2,
    price: 100,
    cardProbabilities: {
      common: 50,
      rare: 35,
      legendary: 13,
      mythic: 2
    }
  }
];

export const mockEvents: SchoolEvent[] = [
  {
    id: 'event1',
    name: 'Semana da Tecnologia',
    startDate: '2024-06-01',
    endDate: '2024-06-07',
    bonusMultiplier: 2,
    cards: ['card6'],
    description: 'Evento especial com foco em inovação tecnológica'
  },
  {
    id: 'event2',
    name: 'Feira de Ciências',
    startDate: '2024-07-15',
    endDate: '2024-07-20',
    bonusMultiplier: 1.5,
    cards: ['card3'],
    description: 'Exposição dos melhores projetos científicos do ano'
  }
];

export const mockTrades: Trade[] = [
  {
    id: 'trade1',
    from: 'student1',
    to: 'student2',
    offered: {
      cards: { 'card1': 2 },
      coins: 10
    },
    requested: {
      cards: { 'card2': 1 },
      coins: 0
    },
    status: 'pending',
    timestamp: Date.now() - 3600000
  },
  {
    id: 'trade2',
    from: 'student3',
    to: 'student1',
    offered: {
      cards: { 'card5': 1 },
      coins: 25
    },
    requested: {
      cards: { 'card3': 1 },
      coins: 0
    },
    status: 'accepted',
    timestamp: Date.now() - 7200000
  }
];
