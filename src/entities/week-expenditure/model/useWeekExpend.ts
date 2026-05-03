"use client";

import { useQuery } from '@tanstack/react-query';
import { weekExpendQueries } from '@/entities/week-expenditure/api/week-expend-queries';
import { useEffect } from 'react';
import { useWeekExpendStore } from '@/shared/store/week-expend-store';


export const useWeekExpend = (accessToken: string) => {
  const query = useQuery({
    ...weekExpendQueries.getWeekExpendQuery(accessToken),
    enabled: !!accessToken,
  });

  const { setWeekExpend } = useWeekExpendStore();

  useEffect(() => {
    if(query.isSuccess && query.data) {
      setWeekExpend(query.data);
    }
  },[query.isSuccess, query.data, setWeekExpend]);

  return query;
}