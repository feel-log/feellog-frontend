import { getDailyExpense } from './dailyExpense';

export interface ThisWeekData {
  id: number;
  day: number;
  week: string;
  changed: number | false;
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

// 더미 데이터가 없는 날짜에 임시로 보여줄 demo 금액 (요일 기반 결정)
const DEMO_AMOUNTS = [0, 12000, 25000, 0, 38000, 45000, 18000];

export function generateThisWeek(baseDate: Date = new Date()): ThisWeekData[] {
  const currentDay = baseDate.getDay();

  // 이번주 시작 (일요일)을 구함
  const startOfWeek = new Date(baseDate);
  startOfWeek.setDate(baseDate.getDate() - currentDay);

  const todayStr = baseDate.toISOString().split('T')[0];

  const week: ThisWeekData[] = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);

    const dateString = date.toISOString().split('T')[0];
    const expense = getDailyExpense(dateString);

    let changed: number | false = false;
    if (expense && expense.totalAmount > 0) {
      changed = -expense.totalAmount;
    } else if (dateString <= todayStr && DEMO_AMOUNTS[i] > 0) {
      // 더미 데이터 없을 때 today 이전 날짜에는 demo 금액 표시
      changed = -DEMO_AMOUNTS[i];
    }

    week.push({
      id: i,
      day: date.getDate(),
      week: WEEKDAYS[i],
      changed,
    });
  }

  return week;
}