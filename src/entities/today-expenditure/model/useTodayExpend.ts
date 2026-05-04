"use client";

import { useQuery } from '@tanstack/react-query';
import { todayExpendQueries } from '@/entities/today-expenditure/api/today-expend-queries';
import { useMonthExpendStore } from '@/shared/store/month-expend-store';
import { useEffect, useRef } from 'react';

export function useTodayExpend(year: number, month: number) {
  const prevMonthRef = useRef<string | null>(null);

  const query = useQuery({
    ...todayExpendQueries.getTodayQueries(year, month),
    staleTime: 1000 * 60,  // 1분간 캐시 유지
    refetchOnWindowFocus: false,  // 창 포커스 시 자동 refetch 비활성화
    refetchOnReconnect: false,  // 재연결 시 자동 refetch 비활성화
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