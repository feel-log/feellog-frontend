export interface EmotionExpenseItem {
  id: string;
  category: string;
  amount: number;
  tags: string[];
  memo?: string;
  payment: '카드' | '현금';
}

export interface EmotionExpenseDateGroup {
  date: string;
  items: EmotionExpenseItem[];
}

export interface EmotionDetail {
  name: string;
  emoji: string;
  totalAmount: number;
  month: number;
  groups: EmotionExpenseDateGroup[];
}

export const emotionDetailMockData: Record<string, EmotionDetail> = {
  우울함: {
    name: '우울함',
    emoji: '😔',
    totalAmount: 342_000,
    month: 4,
    groups: [
      {
        date: '2일 목요일',
        items: [
          {
            id: 'g-1',
            category: '의류',
            amount: 68_000,
            tags: ['기분전환', '보상심리'],
            memo: '일본 여행 코디',
            payment: '현금',
          },
          {
            id: 'g-2',
            category: '카페',
            amount: 18_000,
            tags: ['피로회복'],
            payment: '카드',
          },
        ],
      },
      {
        date: '4일 토요일',
        items: [
          {
            id: 'g-3',
            category: '식비',
            amount: 54_000,
            tags: ['기분전환', '약속'],
            memo: '고등학교 동창 정기 모임',
            payment: '카드',
          },
          {
            id: 'g-4',
            category: '뷰티',
            amount: 47_000,
            tags: ['기분전환', '충동소비'],
            payment: '카드',
          },
        ],
      },
      {
        date: '5일 일요일',
        items: [
          {
            id: 'g-5',
            category: '생필품',
            amount: 29_000,
            tags: ['필요', '할인'],
            memo: '피규어 신상 구매',
            payment: '현금',
          },
        ],
      },
      {
        date: '6일 월요일',
        items: [
          {
            id: 'g-6',
            category: '문화생활',
            amount: 82_000,
            tags: ['충동소비', '기분전환'],
            memo: '해서웨이 공연 관람',
            payment: '현금',
          },
          {
            id: 'g-7',
            category: '카페',
            amount: 14_000,
            tags: ['피로회복'],
            payment: '현금',
          },
        ],
      },
      {
        date: '8일 수요일',
        items: [
          {
            id: 'g-8',
            category: '식비',
            amount: 30_000,
            tags: ['보상심리'],
            payment: '카드',
          },
        ],
      },
    ],
  },
  충동: {
    name: '충동',
    emoji: '😵',
    totalAmount: 145_000,
    month: 4,
    groups: [
      {
        date: '3일 금요일',
        items: [
          {
            id: 'i-1',
            category: '뷰티',
            amount: 58_000,
            tags: ['충동소비'],
            memo: '립스틱 신상',
            payment: '카드',
          },
        ],
      },
      {
        date: '10일 토요일',
        items: [
          {
            id: 'i-2',
            category: '의류',
            amount: 45_000,
            tags: ['충동소비', '할인'],
            payment: '카드',
          },
          {
            id: 'i-3',
            category: '카페',
            amount: 22_000,
            tags: ['기분전환'],
            payment: '현금',
          },
        ],
      },
      {
        date: '15일 목요일',
        items: [
          {
            id: 'i-4',
            category: '생필품',
            amount: 20_000,
            tags: ['충동소비'],
            payment: '카드',
          },
        ],
      },
    ],
  },
  불안함: {
    name: '불안함',
    emoji: '😟',
    totalAmount: 95_000,
    month: 4,
    groups: [
      {
        date: '7일 수요일',
        items: [
          {
            id: 'a-1',
            category: '의료',
            amount: 50_000,
            tags: ['필요'],
            memo: '건강검진',
            payment: '카드',
          },
        ],
      },
      {
        date: '14일 수요일',
        items: [
          {
            id: 'a-2',
            category: '식비',
            amount: 28_000,
            tags: ['보상심리'],
            payment: '카드',
          },
          {
            id: 'a-3',
            category: '카페',
            amount: 17_000,
            tags: ['기분전환'],
            payment: '현금',
          },
        ],
      },
    ],
  },
  스트레스: {
    name: '스트레스',
    emoji: '😫',
    totalAmount: 32_000,
    month: 4,
    groups: [
      {
        date: '9일 금요일',
        items: [
          {
            id: 's-1',
            category: '카페',
            amount: 12_000,
            tags: ['기분전환'],
            payment: '카드',
          },
        ],
      },
      {
        date: '16일 금요일',
        items: [
          {
            id: 's-2',
            category: '식비',
            amount: 20_000,
            tags: ['보상심리'],
            memo: '야식 배달',
            payment: '카드',
          },
        ],
      },
    ],
  },
  외로움: {
    name: '외로움',
    emoji: '😢',
    totalAmount: 13_000,
    month: 4,
    groups: [
      {
        date: '18일 일요일',
        items: [
          {
            id: 'l-1',
            category: '카페',
            amount: 13_000,
            tags: ['기분전환'],
            memo: '혼자 브런치',
            payment: '카드',
          },
        ],
      },
    ],
  },
};

export function getEmotionDetail(emotionId: string): EmotionDetail | null {
  return emotionDetailMockData[emotionId] ?? null;
}
