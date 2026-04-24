export interface EmotionBadge {
  name: string;
  emoji: string;
  gradient: { from: string; to: string };
}

export interface ExpenseItem {
  id: string;
  tags: string[];
  emotions: EmotionBadge[];
  amount: number;
  memo?: string;
  payment: '카드' | '현금';
}

export interface ExpenseDateGroup {
  date: string;
  items: ExpenseItem[];
}

export interface CategoryDetail {
  name: string;
  emoji: string;
  totalAmount: number;
  month: number;
  groups: ExpenseDateGroup[];
}

const emotions: Record<string, EmotionBadge> = {
  boring: { name: '심심함', emoji: '😐', gradient: { from: '#EFE79C', to: '#CABE48' } },
  empty: { name: '공허함', emoji: '😶', gradient: { from: '#DBE3D9', to: '#95A590' } },
  tired: { name: '피곤함', emoji: '😩', gradient: { from: '#ECD9E7', to: '#A38F9E' } },
  joy: { name: '기쁨', emoji: '😊', gradient: { from: '#FFD8DF', to: '#FFABBA' } },
  excited: { name: '설렘', emoji: '🥰', gradient: { from: '#FFCAC5', to: '#FF897E' } },
  thankful: { name: '고마움', emoji: '🥺', gradient: { from: '#FFA7B1', to: '#FF6B7C' } },
  impulse: { name: '충동', emoji: '😵', gradient: { from: '#FFA0CB', to: '#FF4F9E' } },
  anxious: { name: '불안함', emoji: '😰', gradient: { from: '#E590F5', to: '#A046B1' } },
  proud: { name: '뿌듯함', emoji: '😎', gradient: { from: '#FFC2A5', to: '#FF874F' } },
  gloomy: { name: '우울함', emoji: '😔', gradient: { from: '#C8C8C8', to: '#7F888B' } },
  sad: { name: '슬픔', emoji: '😢', gradient: { from: '#BEEAF7', to: '#7BCDE6' } },
};

export const categoryDetailMockData: Record<string, CategoryDetail> = {
  식비: {
    name: '식비',
    emoji: '🍔',
    totalAmount: 592_000,
    month: 4,
    groups: [
      {
        date: '2일 목요일',
        items: [
          {
            id: 'f-1',
            tags: ['기분전환', '보상심리'],
            emotions: [emotions.boring, emotions.empty],
            amount: 68_000,
            memo: '케이크',
            payment: '카드',
          },
          {
            id: 'f-2',
            tags: ['피로회복', '기타'],
            emotions: [emotions.tired, emotions.joy],
            amount: 42_000,
            payment: '현금',
          },
        ],
      },
      {
        date: '3일 금요일',
        items: [
          {
            id: 'f-3',
            tags: ['기분전환'],
            emotions: [emotions.excited, emotions.joy],
            amount: 55_000,
            memo: '하이디라오',
            payment: '카드',
          },
          {
            id: 'f-4',
            tags: ['기분전환'],
            emotions: [emotions.excited, emotions.joy],
            amount: 28_000,
            payment: '카드',
          },
        ],
      },
      {
        date: '4일 토요일',
        items: [
          {
            id: 'f-5',
            tags: ['약속'],
            emotions: [emotions.thankful],
            amount: 74_000,
            payment: '카드',
          },
          {
            id: 'f-6',
            tags: ['충동소비', '기분전환'],
            emotions: [emotions.impulse, emotions.anxious],
            amount: 63_000,
            payment: '카드',
          },
        ],
      },
      {
        date: '5일 월요일',
        items: [
          {
            id: 'f-7',
            tags: ['필요'],
            emotions: [emotions.proud],
            amount: 48_000,
            payment: '현금',
          },
          {
            id: 'f-8',
            tags: ['충동소비', '기분전환'],
            emotions: [emotions.impulse, emotions.gloomy],
            amount: 86_000,
            memo: '대학교 친구들과 모임',
            payment: '카드',
          },
          {
            id: 'f-9',
            tags: ['피로회복'],
            emotions: [emotions.tired, emotions.sad],
            amount: 23_000,
            payment: '현금',
          },
        ],
      },
      {
        date: '6일 화요일',
        items: [
          {
            id: 'f-10',
            tags: ['피로회복'],
            emotions: [emotions.tired],
            amount: 105_000,
            payment: '카드',
          },
        ],
      },
    ],
  },
  경조사: {
    name: '경조사',
    emoji: '🎁',
    totalAmount: 254_000,
    month: 4,
    groups: [
      {
        date: '5일 월요일',
        items: [
          {
            id: 'c-1',
            tags: ['약속'],
            emotions: [emotions.thankful, emotions.joy],
            amount: 100_000,
            memo: '결혼식 축의금',
            payment: '현금',
          },
        ],
      },
      {
        date: '12일 월요일',
        items: [
          {
            id: 'c-2',
            tags: ['약속', '필요'],
            emotions: [emotions.proud],
            amount: 80_000,
            memo: '돌잔치 선물',
            payment: '카드',
          },
        ],
      },
      {
        date: '20일 화요일',
        items: [
          {
            id: 'c-3',
            tags: ['약속'],
            emotions: [emotions.sad, emotions.thankful],
            amount: 74_000,
            memo: '조의금',
            payment: '현금',
          },
        ],
      },
    ],
  },
  의료: {
    name: '의료',
    emoji: '💊',
    totalAmount: 84_000,
    month: 4,
    groups: [
      {
        date: '8일 목요일',
        items: [
          {
            id: 'm-1',
            tags: ['필요', '피로회복'],
            emotions: [emotions.tired, emotions.anxious],
            amount: 45_000,
            memo: '내과 진료',
            payment: '카드',
          },
        ],
      },
      {
        date: '15일 목요일',
        items: [
          {
            id: 'm-2',
            tags: ['필요'],
            emotions: [emotions.tired],
            amount: 39_000,
            memo: '처방약',
            payment: '카드',
          },
        ],
      },
    ],
  },
  뷰티: {
    name: '뷰티',
    emoji: '💄',
    totalAmount: 42_000,
    month: 4,
    groups: [
      {
        date: '10일 토요일',
        items: [
          {
            id: 'b-1',
            tags: ['기분전환', '보상심리'],
            emotions: [emotions.excited, emotions.joy],
            amount: 28_000,
            memo: '립스틱',
            payment: '카드',
          },
        ],
      },
      {
        date: '17일 토요일',
        items: [
          {
            id: 'b-2',
            tags: ['기분전환'],
            emotions: [emotions.joy],
            amount: 14_000,
            payment: '카드',
          },
        ],
      },
    ],
  },
  교통: {
    name: '교통',
    emoji: '🚌',
    totalAmount: 31_000,
    month: 4,
    groups: [
      {
        date: '3일 금요일',
        items: [
          {
            id: 't-1',
            tags: ['필요'],
            emotions: [emotions.tired],
            amount: 15_000,
            memo: '택시비',
            payment: '카드',
          },
        ],
      },
      {
        date: '11일 일요일',
        items: [
          {
            id: 't-2',
            tags: ['필요'],
            emotions: [emotions.proud],
            amount: 10_000,
            memo: 'KTX 편도',
            payment: '카드',
          },
        ],
      },
      {
        date: '19일 월요일',
        items: [
          {
            id: 't-3',
            tags: ['필요'],
            emotions: [emotions.empty],
            amount: 6_000,
            payment: '카드',
          },
        ],
      },
    ],
  },
};

export function getCategoryDetail(categoryId: string): CategoryDetail | null {
  return categoryDetailMockData[categoryId] ?? null;
}
