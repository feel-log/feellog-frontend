export interface MonthlyExpenseItem {
  id: string;
  date: string;
  dateLabel: string;
  name?: string;
  amount: number;
  paymentMethod: string;
  tags: string[];
  emotions: string[];
}

export const monthlyExpenseMock: MonthlyExpenseItem[] = [
  {
    id: '1',
    date: '2026-04-06',
    dateLabel: '4월 6일 목요일',
    name: '케이크',
    amount: 68000,
    paymentMethod: '카드',
    tags: ['기분전환', '보상심리'],
    emotions: ['심심함', '공허함'],
  },
  {
    id: '2',
    date: '2026-04-06',
    dateLabel: '4월 6일 목요일',
    amount: 42000,
    paymentMethod: '현금',
    tags: ['피로회복', '기타'],
    emotions: ['피곤함', '기쁨'],
  },
  {
    id: '3',
    date: '2026-04-05',
    dateLabel: '4월 5일 금요일',
    name: '하이디라오',
    amount: 55000,
    paymentMethod: '카드',
    tags: ['기분전환'],
    emotions: ['설렘', '기쁨'],
  },
  {
    id: '4',
    date: '2026-04-05',
    dateLabel: '4월 5일 금요일',
    amount: 28000,
    paymentMethod: '카드',
    tags: ['기분전환'],
    emotions: ['설렘', '기쁨'],
  },
  {
    id: '5',
    date: '2026-04-04',
    dateLabel: '4월 4일 토요일',
    amount: 74000,
    paymentMethod: '카드',
    tags: ['약속'],
    emotions: ['고마움'],
  },
  {
    id: '6',
    date: '2026-04-04',
    dateLabel: '4월 4일 토요일',
    amount: 63000,
    paymentMethod: '카드',
    tags: ['충동소비', '기분전환'],
    emotions: ['충동', '불안함'],
  },
  {
    id: '7',
    date: '2026-04-03',
    dateLabel: '4월 3일 월요일',
    amount: 48000,
    paymentMethod: '현금',
    tags: ['필요'],
    emotions: ['뿌듯함'],
  },
  {
    id: '8',
    date: '2026-04-03',
    dateLabel: '4월 3일 월요일',
    name: '대학교 친구들과 모임',
    amount: 86000,
    paymentMethod: '카드',
    tags: ['충동소비', '기분전환'],
    emotions: ['충동', '우울함'],
  },
  {
    id: '9',
    date: '2026-04-03',
    dateLabel: '4월 3일 월요일',
    amount: 23000,
    paymentMethod: '현금',
    tags: ['피로회복'],
    emotions: ['피곤함', '슬픔'],
  },
  {
    id: '10',
    date: '2026-04-02',
    dateLabel: '4월 2일 화요일',
    amount: 105000,
    paymentMethod: '카드',
    tags: ['피로회복'],
    emotions: ['피곤함'],
  },
];

export function getMonthlyExpenseTotal(): number {
  return monthlyExpenseMock.reduce((sum, item) => sum + item.amount, 0);
}
