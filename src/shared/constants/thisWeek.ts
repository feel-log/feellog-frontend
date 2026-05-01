import { getDailyExpense } from './dailyExpense';

export interface ThisWeekData {
  id: number;
  day: number;
  week: string;
  changed: number | false;
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

export function generateThisWeek(baseDate: Date = new Date()): ThisWeekData[] {
  const currentDay = baseDate.getDay();

  // 이번주 시작 (일요일)을 구함
  const startOfWeek = new Date(baseDate);
  startOfWeek.setDate(baseDate.getDate() - currentDay);

  const week: ThisWeekData[] = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);

    const dateString = date.toISOString().split('T')[0];
    const expense = getDailyExpense(dateString);

    week.push({
      id: i,
      day: date.getDate(),
      week: WEEKDAYS[i],
      changed: expense && expense.totalAmount > 0 ? -expense.totalAmount : false
    });
  }

  return week;
}