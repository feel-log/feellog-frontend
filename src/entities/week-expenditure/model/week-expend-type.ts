export interface WeekExpendType {
  weekStart: string;
  weekEnd: string;
  totalExpense: number;
  dailyAmounts: DailyExpendType[]
}

interface DailyExpendType {
  date: string;
  expense: number;
}