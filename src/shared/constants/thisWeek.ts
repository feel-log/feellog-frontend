export interface ThisWeekData {
  id: number;
  day: number;
  week: string;
  changed: number | false;
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

export function generateThisWeek(): ThisWeekData[] {
  const today = new Date();
  const currentDay = today.getDay();

  // 이번주 시작 (일요일)을 구함
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - currentDay);

  const week: ThisWeekData[] = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);

    week.push({
      id: i,
      day: date.getDate(),
      week: WEEKDAYS[i],
      changed: false
    });
  }

  return week;
}