"use client";

import { useQuery } from '@tanstack/react-query';
import { todayExpendQueries } from '@/entities/today-expenditure/api/today-expend-queries';
import { useMonthExpendStore } from '@/shared/store/month-expend-store';
import { useEffect, useRef } from 'react';

export function useTodayExpend(accessToken: string, year: number, month: number) {
  const prevMonthRef = useRef<string | null>(null);

  const query = useQuery({
    ...todayExpendQueries.getTodayQueries(accessToken, year, month),
    enabled: !!accessToken,
  });

  // 월이 바뀔 때만 refetch
  useEffect(() => {
    const currentMonth = `${year}-${month}`;
    if (prevMonthRef.current !== null && prevMonthRef.current !== currentMonth) {
      query.refetch();
    }
    prevMonthRef.current = currentMonth;
  }, [year, month, query]);

  const { setData } = useMonthExpendStore();

  useEffect(() => {
    if (query.isSuccess && query.data) {
      setData(query.data);
    }
  }, [query.isSuccess, query.data, setData]);

  return query;
}