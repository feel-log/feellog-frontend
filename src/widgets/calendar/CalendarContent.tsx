'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useToken } from '@/shared/store';
import { expenseQueries } from '@/entities/expense';
import { masterDataQueries, type MasterData } from '@/entities/master-data';
import CalendarHeader from '@/widgets/calendar/CalendarHeader';
import CalendarGrid from '@/widgets/calendar/CalendarGrid';
import DateBottomSheet from '@/widgets/calendar/DateBottomSheet';
import PageHeader from '@/shared/ui/PageHeader';

const PAYMENT_METHOD_NAMES: Record<number, string> = {
  1: '카드',
  2: '현금',
  3: '계좌',
  4: '기타',
};

function buildLookups(masterData?: MasterData) {
  const categoryMap = new Map<number, string>();
  const emotionMap = new Map<number, string>();
  const situationMap = new Map<number, string>();

  masterData?.categoryGroups.forEach((g) =>
    g.categories.forEach((c) => categoryMap.set(c.id, c.name)),
  );
  masterData?.emotionGroups.forEach((g) =>
    g.emotions.forEach((e) => emotionMap.set(e.id, e.name)),
  );
  masterData?.situationTags.forEach((s) => situationMap.set(s.id, s.name));

  return { categoryMap, emotionMap, situationMap };
}

export default function CalendarContent() {
  const router = useRouter();
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const { getAccessToken } = useToken();
  const token = getAccessToken();

  const { data: expenses } = useQuery({
    ...expenseQueries.monthly(token || '', year, month + 1),
    enabled: !!token,
  });

  const { data: masterData } = useQuery({
    ...masterDataQueries.data(token || ''),
    enabled: !!token,
  });

  const { categoryMap, emotionMap, situationMap } = useMemo(
    () => buildLookups(masterData),
    [masterData],
  );

  const dailyAmounts = useMemo(() => {
    const map: Record<number, { expense: number }> = {};
    (expenses ?? []).forEach((e) => {
      const day = Number(e.expenseDate.split('-')[2]);
      const prev = map[day]?.expense ?? 0;
      map[day] = { expense: prev + e.amount };
    });
    return map;
  }, [expenses]);

  const monthlyTotals = useMemo(() => {
    const income = 0;
    const expense = (expenses ?? []).reduce((acc, e) => acc + e.amount, 0);
    const balance = income - expense;
    return { income, expense, balance: balance || 0 };
  }, [expenses]);

  const dayData = useMemo(() => {
    if (selectedDay == null || !expenses) {
      return { income: 0, expense: 0, expenseItems: [], incomeItems: [] };
    }
    const dayExpenses = expenses.filter(
      (e) => Number(e.expenseDate.split('-')[2]) === selectedDay,
    );
    const expenseItems = dayExpenses.map((e) => ({
      category: categoryMap.get(e.categoryId) ?? '',
      tags: e.situationTagIds
        .map((id) => situationMap.get(id))
        .filter((n): n is string => !!n),
      amount: e.amount,
      paymentMethod: PAYMENT_METHOD_NAMES[e.paymentMethodId] ?? '',
      memo: e.memo ?? undefined,
      emotions: e.emotionIds
        .map((id) => emotionMap.get(id))
        .filter((n): n is string => !!n),
    }));
    const expense = dayExpenses.reduce((acc, e) => acc + e.amount, 0);
    return { income: 0, expense, expenseItems, incomeItems: [] };
  }, [expenses, selectedDay, categoryMap, emotionMap, situationMap]);

  const handlePrevMonth = () => {
    if (month === 0) {
      setYear(year - 1);
      setMonth(11);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 11) {
      setYear(year + 1);
      setMonth(0);
    } else {
      setMonth(month + 1);
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader title="캘린더" backHref="/" />

      <div className="mt-5">
        <CalendarHeader
          year={year}
          month={month}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          income={monthlyTotals.income}
          expense={monthlyTotals.expense}
          balance={monthlyTotals.balance}
        />
      </div>

      <div className="mt-2.5 flex flex-1 flex-col">
        <CalendarGrid
          year={year}
          month={month}
          onDateClick={(day) => setSelectedDay(day)}
          dailyAmounts={dailyAmounts}
          selectedDay={selectedDay}
        />
      </div>

      <div className="pointer-events-none fixed bottom-0 left-1/2 flex w-full max-w-md -translate-x-1/2 justify-end">
        <button
          onClick={() => router.push('/record?type=expense')}
          aria-label="지출 추가"
          className="pointer-events-auto z-40 mb-32.5 mr-4 flex size-14.5 items-center justify-center rounded-full bg-[#13278A] p-2.75 shadow-[2px_3px_7px_0px_rgba(49,49,49,0.3)]"
        >
          <img src="/svg/icon_plus_white.svg" alt="" width={36} height={36} />
        </button>
      </div>

      {selectedDay !== null && (
        <DateBottomSheet
          date={selectedDay}
          month={month}
          year={year}
          income={dayData.income}
          expense={dayData.expense}
          expenseItems={dayData.expenseItems}
          incomeItems={dayData.incomeItems}
          onClose={() => setSelectedDay(null)}
        />
      )}
    </div>
  );
}
