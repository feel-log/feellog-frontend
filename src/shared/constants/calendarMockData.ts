export interface CalendarExpenseItem {
  category: string;
  tags: string[];
  amount: number;
  paymentMethod: string;
  memo?: string;
  emotions?: string[];
}

export interface CalendarIncomeItem {
  category: string;
  amount: number;
  memo?: string;
}

export interface CalendarDailyData {
  income: number;
  expense: number;
  expenseItems: CalendarExpenseItem[];
  incomeItems: CalendarIncomeItem[];
}

export const dailyCalendarMock: Record<number, CalendarDailyData> = {
  2: {
    income: 200000,
    expense: 75000,
    incomeItems: [
      { category: '급여', amount: 150000, memo: '3월 월급' },
      { category: '부수입', amount: 50000, memo: '주식' },
    ],
    expenseItems: [
      { category: '식비', tags: ['약속', '보상심리'], amount: 28000, paymentMethod: '카드', memo: '친구 생일 저녁', emotions: ['기쁨', '고마움'] },
      { category: '카페', tags: ['기분전환'], amount: 12000, paymentMethod: '현금', emotions: ['설렘'] },
      { category: '디저트', tags: ['보상심리'], amount: 9000, paymentMethod: '카드', memo: '두쫀쿠', emotions: ['기쁨'] },
      { category: '생필품', tags: ['필요'], amount: 14000, paymentMethod: '체크카드', emotions: ['뿌듯함'] },
      { category: '교통', tags: ['피로회복'], amount: 8000, paymentMethod: '카드', emotions: ['피곤함'] },
      { category: '편의점', tags: ['충동소비'], amount: 4000, paymentMethod: '현금', memo: '간식', emotions: ['충동'] },
    ],
  },
  7: {
    income: 0,
    expense: 50000,
    incomeItems: [],
    expenseItems: [
      { category: '카페', tags: ['기분전환'], amount: 25000, paymentMethod: '카드', memo: '스타벅스', emotions: ['설렘'] },
      { category: '생필품', tags: ['필요'], amount: 25000, paymentMethod: '체크카드', memo: '다이소', emotions: ['뿌듯함'] },
    ],
  },
  10: {
    income: 0,
    expense: 76000,
    incomeItems: [],
    expenseItems: [
      { category: '카페', tags: ['기분전환', '보상심리'], amount: 12000, paymentMethod: '현금', emotions: ['스트레스', '기쁨'] },
      { category: '취미', tags: ['기분전환', '할인'], amount: 12000, paymentMethod: '카드', memo: '피규어 신상 구매', emotions: ['설렘', '뿌듯함'] },
      { category: '생필품', tags: ['필요'], amount: 5000, paymentMethod: '카드', memo: '다이소', emotions: ['뿌듯함'] },
      { category: '식비', tags: ['약속'], amount: 42000, paymentMethod: '체크카드', emotions: ['충동'] },
      { category: '교통비', tags: ['지각'], amount: 5000, paymentMethod: '현금', emotions: ['짜증'] },
    ],
  },
};

export const emptyCalendarData: CalendarDailyData = {
  income: 0,
  expense: 0,
  expenseItems: [],
  incomeItems: [],
};

export function getCalendarDailyData(day: number | null): CalendarDailyData {
  if (day === null) return emptyCalendarData;
  return dailyCalendarMock[day] ?? emptyCalendarData;
}

export function getDailyAmounts(): Record<number, { income: number; expense: number }> {
  return Object.fromEntries(
    Object.entries(dailyCalendarMock).map(([day, data]) => [
      day,
      { income: data.income, expense: data.expense },
    ])
  );
}

export function getMonthlyTotals(): { income: number; expense: number; balance: number } {
  const totals = Object.values(dailyCalendarMock).reduce(
    (acc, data) => ({
      income: acc.income + data.income,
      expense: acc.expense + data.expense,
    }),
    { income: 0, expense: 0 }
  );
  return {
    ...totals,
    balance: totals.income - totals.expense,
  };
}
