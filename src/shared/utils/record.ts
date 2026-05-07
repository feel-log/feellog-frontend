import { evaluate } from 'mathjs';

export const DAY_OF_WEEK = ['일', '월', '화', '수', '목', '금', '토'];

export interface RecordState {
  amount: number;
  type: 'income' | 'expense';
  date: string;
  categoryId: number | null;
  paymentMethodId: number | null;
  emotionIds?: number[];
  situationTagIds?: number[];
  memo: string;
}

export function formatDateDisplay(dateString: string): string {
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const dayOfWeek = DAY_OF_WEEK[date.getDay()];
  return `${year}년 ${month}월 ${day}일 ${dayOfWeek}요일`;
}

export function calculateExpression(expression: string): number {
  try {
    if (!expression || expression.trim() === '') {
      return 0;
    }
    const normalized = expression.replace(/,00/g, '.00').replace(/,000/g, '.000');
    const result = evaluate(normalized);
    return Math.round((result || 0) * 100) / 100;
  } catch {
    const numbers = expression.match(/\d+/g);
    return numbers ? parseInt(numbers[numbers.length - 1]) : 0;
  }
}

export function getDisplayAmount(amountInput: string): number {
  if (!amountInput) return 0;
  try {
    const normalized = amountInput.replace(/,00/g, '.00').replace(/,000/g, '.000');
    const result = evaluate(normalized);
    return Math.round((result || 0) * 100) / 100;
  } catch {
    const numbers = amountInput.match(/\d+/g);
    return numbers ? parseInt(numbers[numbers.length - 1]) : 0;
  }
}

export function getCalendarDays(year: number, month: number, today: string) {
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  const prevLastDay = new Date(year, month - 1, 0);

  const daysInMonth = lastDay.getDate();
  const daysInPrevMonth = prevLastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const days = [];

  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    const date = new Date(year, month - 2, daysInPrevMonth - i);
    days.push({
      date: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`,
      day: daysInPrevMonth - i,
      isCurrentMonth: false,
    });
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month - 1, i);
    days.push({
      date: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`,
      day: i,
      isCurrentMonth: true,
    });
  }

  const remainingDays = 42 - days.length;
  for (let i = 1; i <= remainingDays; i++) {
    const date = new Date(year, month, i);
    days.push({
      date: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`,
      day: i,
      isCurrentMonth: false,
    });
  }

  return days;
}
