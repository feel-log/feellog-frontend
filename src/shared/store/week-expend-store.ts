import { WeekExpendType } from '@/entities/week-expenditure/model/week-expend-type';
import { create } from 'zustand';

interface WeekExpendStore extends WeekExpendType {
  setWeekExpend: (data: WeekExpendType) => void;
  getWeekExpend: () => WeekExpendType;
}

export const useWeekExpendStore = create<WeekExpendStore>((set,get) => ({
  weekStart: new Date().toDateString(),
  weekEnd: new Date().toDateString(),
  totalExpense: 0,
  dailyAmounts: [],
  setWeekExpend: (data: WeekExpendType) => set(data),
  getWeekExpend: () => {
    const state = get();
    return {
      weekStart: state.weekStart,
      weekEnd: state.weekEnd,
      totalExpense: state.totalExpense,
      dailyAmounts: state.dailyAmounts,
    }
  }
}))