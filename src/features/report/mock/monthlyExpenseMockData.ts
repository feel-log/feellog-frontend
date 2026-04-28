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
    emotions: ['boring', 'emptiness'],
  },
  {
    id: '2',
    date: '2026-04-06',
    dateLabel: '4월 6일 목요일',
    amount: 42000,
    paymentMethod: '현금',
    tags: ['피로회복', '기타'],
    emotions: ['tired', 'happy'],
  },
  {
    id: '3',
    date: '2026-04-05',
    dateLabel: '4월 5일 금요일',
    name: '하이디라오',
    amount: 55000,
    paymentMethod: '카드',
    tags: ['기분전환'],
    emotions: ['flut', 'happy'],
  },
  {
    id: '4',
    date: '2026-04-05',
    dateLabel: '4월 5일 금요일',
    amount: 28000,
    paymentMethod: '카드',
    tags: ['기분전환'],
    emotions: ['flut', 'happy'],
  },
  {
    id: '5',
    date: '2026-04-04',
    dateLabel: '4월 4일 토요일',
    amount: 74000,
    paymentMethod: '카드',
    tags: ['약속'],
    emotions: ['thanks'],
  },
  {
    id: '6',
    date: '2026-04-04',
    dateLabel: '4월 4일 토요일',
    amount: 63000,
    paymentMethod: '카드',
    tags: ['충동소비', '기분전환'],
    emotions: ['impulse', 'anxios'],
  },
  {
    id: '7',
    date: '2026-04-03',
    dateLabel: '4월 3일 월요일',
    amount: 48000,
    paymentMethod: '현금',
    tags: ['필요'],
    emotions: ['proud'],
  },
  {
    id: '8',
    date: '2026-04-03',
    dateLabel: '4월 3일 월요일',
    name: '대학교 친구들과 모임',
    amount: 86000,
    paymentMethod: '카드',
    tags: ['충동소비', '기분전환'],
    emotions: ['impulse', 'depressed'],
  },
  {
    id: '9',
    date: '2026-04-03',
    dateLabel: '4월 3일 월요일',
    amount: 23000,
    paymentMethod: '현금',
    tags: ['피로회복'],
    emotions: ['tired', 'sad'],
  },
  {
    id: '10',
    date: '2026-04-02',
    dateLabel: '4월 2일 화요일',
    amount: 105000,
    paymentMethod: '카드',
    tags: ['피로회복'],
    emotions: ['tired'],
  },
];

export function getMonthlyExpenseTotal(): number {
  return monthlyExpenseMock.reduce((sum, item) => sum + item.amount, 0);
}
