import { create } from 'zustand';
import { MonthlyExpendType } from '@/entities/today-expenditure/model/monthly-expend-type';

interface MonthExpendedStore {
  data: MonthlyExpendType[];
  setData: (data: MonthlyExpendType[]) => void;
  getData: () => MonthlyExpendType[];
}

export const useMonthExpendStore = create<MonthExpendedStore>((set, get) => ({
  data: [],
  setData: (data: MonthlyExpendType[]) => set({ data }),
  getData: () => get().data
}))