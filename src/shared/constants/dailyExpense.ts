export interface Emotion {
  emoji: string;
  label: string;
}

export interface ExpenseCategory {
  name: string;
  amount: number;
  emotions: Emotion[];
}

export interface DailyExpenseData {
  date: string; // YYYY-MM-DD format
  totalAmount: number;
  categories: ExpenseCategory[];
}

// 예시 데이터: 2026-04-08 ~ 2026-04-21
export const dailyExpenses: DailyExpenseData[] = [
  {
    date: '2026-04-08',
    totalAmount: 45000,
    categories: [
      {
        name: '카페',
        amount: 12000,
        emotions: [
          { emoji: '😊', label: '고마움' },
          { emoji: '😐', label: '심심함' },
        ],
      },
      {
        name: '생필품',
        amount: 15000,
        emotions: [{ emoji: '😤', label: '스트레스' }],
      },
      {
        name: '식비',
        amount: 18000,
        emotions: [
          { emoji: '😠', label: '짜증' },
          { emoji: '😋', label: '충동' },
        ],
      },
    ],
  },
  {
    date: '2026-04-09',
    totalAmount: 52000,
    categories: [
      {
        name: '카페',
        amount: 8000,
        emotions: [{ emoji: '😊', label: '고마움' }],
      },
      {
        name: '의류',
        amount: 35000,
        emotions: [
          { emoji: '😍', label: '행복' },
          { emoji: '😋', label: '충동' },
        ],
      },
      {
        name: '식비',
        amount: 9000,
        emotions: [{ emoji: '😋', label: '충동' }],
      },
    ],
  },
  {
    date: '2026-04-10',
    totalAmount: 86000,
    categories: [
      {
        name: '카페',
        amount: 12000,
        emotions: [
          { emoji: '😊', label: '고마움' },
          { emoji: '😐', label: '심심함' },
        ],
      },
      {
        name: '생필품',
        amount: 8000,
        emotions: [{ emoji: '😤', label: '스트레스' }],
      },
      {
        name: '식비',
        amount: 16000,
        emotions: [
          { emoji: '😠', label: '짜증' },
          { emoji: '😋', label: '충동' },
          { emoji: '😫', label: '피곤함' },
        ],
      },
    ],
  },
  {
    date: '2026-04-11',
    totalAmount: 34000,
    categories: [
      {
        name: '식비',
        amount: 28000,
        emotions: [
          { emoji: '😋', label: '충동' },
          { emoji: '😍', label: '행복' },
        ],
      },
      {
        name: '교통',
        amount: 6000,
        emotions: [{ emoji: '😫', label: '피곤함' }],
      },
    ],
  },
  {
    date: '2026-04-12',
    totalAmount: 41000,
    categories: [
      {
        name: '카페',
        amount: 10000,
        emotions: [{ emoji: '😊', label: '고마움' }],
      },
      {
        name: '쇼핑',
        amount: 20000,
        emotions: [{ emoji: '😍', label: '행복' }],
      },
      {
        name: '식비',
        amount: 11000,
        emotions: [{ emoji: '😋', label: '충동' }],
      },
    ],
  },
  {
    date: '2026-04-13',
    totalAmount: 28000,
    categories: [
      {
        name: '카페',
        amount: 8000,
        emotions: [{ emoji: '😐', label: '심심함' }],
      },
      {
        name: '식비',
        amount: 20000,
        emotions: [{ emoji: '😋', label: '충동' }],
      },
    ],
  },
  {
    date: '2026-04-14',
    totalAmount: 67000,
    categories: [
      {
        name: '영화',
        amount: 30000,
        emotions: [
          { emoji: '😍', label: '행복' },
          { emoji: '😊', label: '고마움' },
        ],
      },
      {
        name: '식비',
        amount: 25000,
        emotions: [
          { emoji: '😋', label: '충동' },
          { emoji: '😍', label: '행복' },
        ],
      },
      {
        name: '카페',
        amount: 12000,
        emotions: [{ emoji: '😊', label: '고마움' }],
      },
    ],
  },
  {
    date: '2026-04-15',
    totalAmount: 0,
    categories: [],
  },
  {
    date: '2026-04-16',
    totalAmount: 39000,
    categories: [
      {
        name: '카페',
        amount: 9000,
        emotions: [{ emoji: '😊', label: '고마움' }],
      },
      {
        name: '생필품',
        amount: 15000,
        emotions: [{ emoji: '😤', label: '스트레스' }],
      },
      {
        name: '식비',
        amount: 15000,
        emotions: [{ emoji: '😋', label: '충동' }],
      },
    ],
  },
  {
    date: '2026-04-17',
    totalAmount: 72000,
    categories: [
      {
        name: '식비',
        amount: 45000,
        emotions: [
          { emoji: '😋', label: '충동' },
          { emoji: '😍', label: '행복' },
        ],
      },
      {
        name: '카페',
        amount: 15000,
        emotions: [{ emoji: '😊', label: '고마움' }],
      },
      {
        name: '교통',
        amount: 12000,
        emotions: [{ emoji: '😫', label: '피곤함' }],
      },
    ],
  },
  {
    date: '2026-04-18',
    totalAmount: 31000,
    categories: [
      {
        name: '카페',
        amount: 7000,
        emotions: [{ emoji: '😐', label: '심심함' }],
      },
      {
        name: '식비',
        amount: 24000,
        emotions: [
          { emoji: '😋', label: '충동' },
          { emoji: '😍', label: '행복' },
        ],
      },
    ],
  },
  {
    date: '2026-04-19',
    totalAmount: 0,
    categories: [],
  },
  {
    date: '2026-04-20',
    totalAmount: 44000,
    categories: [
      {
        name: '카페',
        amount: 11000,
        emotions: [{ emoji: '😊', label: '고마움' }],
      },
      {
        name: '생필품',
        amount: 18000,
        emotions: [{ emoji: '😤', label: '스트레스' }],
      },
      {
        name: '식비',
        amount: 15000,
        emotions: [{ emoji: '😋', label: '충동' }],
      },
    ],
  },
  {
    date: '2026-04-21',
    totalAmount: 36000,
    categories: [
      {
        name: '카페',
        amount: 10000,
        emotions: [{ emoji: '😊', label: '고마움' }],
      },
      {
        name: '생필품',
        amount: 12000,
        emotions: [{ emoji: '😤', label: '스트레스' }],
      },
      {
        name: '식비',
        amount: 14000,
        emotions: [{ emoji: '😋', label: '충동' }],
      },
    ],
  },
];

export function getDailyExpense(dateString: string): DailyExpenseData | undefined {
  return dailyExpenses.find((exp) => exp.date === dateString);
}
