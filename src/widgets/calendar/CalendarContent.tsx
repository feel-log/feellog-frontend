'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useToken, useUser } from '@/shared/store';
import { expenseQueries } from '@/entities/expense';
import { incomeQueries } from '@/entities/income';
import { masterDataQueries, type MasterData } from '@/entities/master-data';
import CalendarHeader from '@/widgets/calendar/CalendarHeader';
import CalendarGrid from '@/widgets/calendar/CalendarGrid';
import CalendarSkeleton from '@/widgets/calendar/CalendarSkeleton';
import DateBottomSheet from '@/widgets/calendar/DateBottomSheet';
import ConfirmModal from '@/shared/ui/ConfirmModal';
import PageHeader from '@/shared/ui/PageHeader';

function buildLookups(masterData?: MasterData) {
  const categoryMap = new Map<number, string>();
  const emotionMap = new Map<number, string>();
  const situationMap = new Map<number, string>();
  const paymentMethodMap = new Map<number, string>();
  const incomeCategoryMap = new Map<number, string>();

  masterData?.categoryGroups.forEach((g) =>
    g.categories.forEach((c) => categoryMap.set(c.id, c.name)),
  );
  masterData?.emotionGroups.forEach((g) =>
    g.emotions.forEach((e) => emotionMap.set(e.id, e.name)),
  );
  masterData?.situationTags.forEach((s) =>
    situationMap.set(s.id, s.name),
  );
  masterData?.paymentMethods.forEach((p) =>
    paymentMethodMap.set(p.id, p.name),
  );
  masterData?.incomeCategories.forEach((c) =>
    incomeCategoryMap.set(c.id, c.name),
  );

  return { categoryMap, emotionMap, situationMap, paymentMethodMap, incomeCategoryMap };
}

export default function CalendarContent() {
  const router = useRouter();
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const { getAccessToken } = useToken();
  const { getUser } = useUser();
  const user = getUser();
  const token = getAccessToken();

  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.invalidateQueries({ refetchType: 'all' });
  }, [queryClient]);

  const handleAddExpense = () => {
    if (!user?.nickname || user?.nickname.startsWith('guest')) {
      setShowLoginModal(true);
      return;
    }
    router.push('/record?type=expense');
  };

  const { data: expenses, isLoading: isExpensesLoading } = useQuery({
    ...expenseQueries.monthly(token || '', year, month + 1),
    enabled: !!token,
  });

  const { data: incomes, isLoading: isIncomesLoading } = useQuery({
    ...incomeQueries.monthly(token || '', year, month + 1),
    enabled: !!token,
  });

  const { data: masterData, isLoading: isMasterDataLoading } = useQuery({
    ...masterDataQueries.data(token || ''),
    enabled: !!token,
  });

  const isLoading =
    !!token && (isExpensesLoading || isIncomesLoading || isMasterDataLoading);

  const { categoryMap, emotionMap, situationMap, paymentMethodMap, incomeCategoryMap } = useMemo(
    () => buildLookups(masterData),
    [masterData],
  );

  const dailyAmounts = useMemo(() => {
    const map: Record<number, { income: number; expense: number }> = {};
    (expenses ?? []).forEach((e) => {
      const day = Number(e.expenseDate.split('-')[2]);
      const prev = map[day] ?? { income: 0, expense: 0 };
      map[day] = { ...prev, expense: prev.expense + e.amount };
    });
    (incomes ?? []).forEach((i) => {
      const day = Number(i.incomeDate.split('-')[2]);
      const prev = map[day] ?? { income: 0, expense: 0 };
      map[day] = { ...prev, income: prev.income + i.amount };
    });
    return map;
  }, [expenses, incomes]);

  const monthlyTotals = useMemo(() => {
    const income = (incomes ?? []).reduce((acc, i) => acc + i.amount, 0);
    const expense = (expenses ?? []).reduce((acc, e) => acc + e.amount, 0);
    const balance = income - expense;
    return { income, expense, balance: balance || 0 };
  }, [expenses, incomes]);

  const dayData = useMemo(() => {
    if (selectedDay == null) {
      return { income: 0, expense: 0, expenseItems: [], incomeItems: [] };
    }
    const dayExpenses = (expenses ?? []).filter(
      (e) => Number(e.expenseDate.split('-')[2]) === selectedDay,
    );
    const dayIncomes = (incomes ?? []).filter(
      (i) => Number(i.incomeDate.split('-')[2]) === selectedDay,
    );
    const expenseItems = dayExpenses.map((e) => ({
      id: e.expenseId,
      category: categoryMap.get(e.categoryId) ?? '',
      tags: e.situationTagIds
        .map((id) => situationMap.get(id))
        .filter((n): n is string => !!n),
      amount: e.amount,
      paymentMethod: paymentMethodMap.get(e.paymentMethodId) ?? '',
      memo: e.memo ?? undefined,
      emotions: e.emotionIds
        .map((id) => emotionMap.get(id))
        .filter((n): n is string => !!n),
    }));
    const incomeItems = dayIncomes.map((i) => ({
      id: i.incomeId,
      category: incomeCategoryMap.get(i.incomeCategoryId) ?? '',
      amount: i.amount,
      memo: i.memo ?? undefined,
    }));
    const expense = dayExpenses.reduce((acc, e) => acc + e.amount, 0);
    const income = dayIncomes.reduce((acc, i) => acc + i.amount, 0);
    return { income, expense, expenseItems, incomeItems };
  }, [
    expenses,
    incomes,
    selectedDay,
    categoryMap,
    emotionMap,
    situationMap,
    paymentMethodMap,
    incomeCategoryMap,
  ]);

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

  if (isLoading) return <CalendarSkeleton />;

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
          onClick={handleAddExpense}
          aria-label="지출 추가"
          className="pointer-events-auto z-40 mb-32.5 mr-4 flex size-14.5 items-center justify-center rounded-full bg-[#13278A] p-2.75 shadow-[2px_3px_7px_0px_rgba(49,49,49,0.3)]"
        >
          <img src="/svg/icon_plus_white.svg" alt="" width={36} height={36} />
        </button>
      </div>

      <ConfirmModal
        isOpen={showLoginModal}
        type="loginCheck"
        title="로그인 후 이용 가능합니다."
        secondary="로그인 하시겠습니까?"
        onCancel={() => setShowLoginModal(false)}
        onConfirm={() => {
          setShowLoginModal(false);
          router.push('/login');
        }}
      />

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
