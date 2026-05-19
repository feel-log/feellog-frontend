'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import PageHeader from '@/shared/ui/PageHeader';
import MonthPickerBottomSheet, { type YearMonth } from '@/widgets/report/MonthPickerBottomSheet';
import { apiClient } from '@/shared/api/api-instance';
import type { ReviewMonthlyResponse } from '@/entities/review/model/review-schema';
import { useToken } from '@/shared/store';
import RetroHistorySkeleton from './RetroHistorySkeleton';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'] as const;

function pad(n: number) {
  return String(n).padStart(2, '0');
}

interface CalendarCell {
  date: string;
  day: number;
  isCurrentMonth: boolean;
}

function buildCalendar(year: number, month: number): CalendarCell[] {
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  const startWeekday = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;
  const prevMonthLastDay = new Date(prevYear, prevMonth, 0).getDate();

  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;

  const cells: CalendarCell[] = [];

  for (let i = startWeekday - 1; i >= 0; i--) {
    const day = prevMonthLastDay - i;
    cells.push({
      date: `${prevYear}-${pad(prevMonth)}-${pad(day)}`,
      day,
      isCurrentMonth: false,
    });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({
      date: `${year}-${pad(month)}-${pad(day)}`,
      day,
      isCurrentMonth: true,
    });
  }

  while (cells.length % 7 !== 0) {
    const day = cells.length - (startWeekday + daysInMonth) + 1;
    cells.push({
      date: `${nextYear}-${pad(nextMonth)}-${pad(day)}`,
      day,
      isCurrentMonth: false,
    });
  }

  return cells;
}

export default function RetroHistoryContent() {
  const router = useRouter();
  const { getAccessToken } = useToken();
  const token = getAccessToken();
  const today = useMemo(() => new Date(), []);
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [pendingYear, setPendingYear] = useState(year);
  const [pendingMonth, setPendingMonth] = useState(month);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const cells = useMemo(() => buildCalendar(year, month), [year, month]);
  const { data: monthlyData, isLoading, isError } = useQuery({
    queryKey: ['review', 'monthly', token ?? '', year, month],
    queryFn: () =>
      apiClient<ReviewMonthlyResponse>(
        `/api/v1/reviews/monthly?year=${year}&month=${month}`,
        { method: 'GET' }
      ),
    staleTime: 1000 * 60,
    enabled: mounted && !!token,
  });
  const historySet = useMemo(
    () => new Set(monthlyData?.days.filter((d) => d.written).map((d) => d.date) ?? []),
    [monthlyData]
  );

  const currentSystemYear = new Date().getFullYear();
  const monthLabel = year === currentSystemYear ? `${month}월` : `${year}년 ${month}월`;

  const handleOpenPicker = () => {
    setPendingYear(year);
    setPendingMonth(month);
    setIsPickerOpen(true);
  };

  const handlePickerChange = (ym: YearMonth) => {
    setPendingYear(ym.year);
    setPendingMonth(ym.month);
  };

  const handlePickerConfirm = () => {
    setYear(pendingYear);
    setMonth(pendingMonth);
    setIsPickerOpen(false);
  };

  const handleDayClick = (cell: CalendarCell) => {
    if (!cell.isCurrentMonth) return;
    if (!historySet.has(cell.date)) return;
    router.push(`/retro/history/${cell.date}`);
  };

  if (!mounted || isLoading) return <RetroHistorySkeleton />;

  if (isError) {
    return (
      <div className="flex min-h-dvh flex-col bg-white">
        <PageHeader title="회고록" />
        <div className="flex flex-1 items-center justify-center px-4">
          <p className="text-[14px] text-[#9FA4A8]">
            회고를 불러오지 못했어요. 잠시 후 다시 시도해주세요.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <PageHeader title="회고록" />

      <div className="px-4 pt-4 pb-3">
        <button
          type="button"
          onClick={handleOpenPicker}
          className="flex cursor-pointer items-center gap-1"
          aria-expanded={isPickerOpen}
        >
          <span className="text-[22px] font-semibold leading-normal tracking-[-0.025em] text-[#030303]">
            {monthLabel}
          </span>
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            className={`transition-transform ${isPickerOpen ? 'rotate-180' : ''}`}
          >
            <path d="M5 7.5L10 12.5L15 7.5" stroke="#73787E" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 bg-[#F7F8FA]">
        {WEEKDAYS.map((wd) => (
          <div
            key={wd}
            className="flex h-[31px] items-center justify-center text-[14px] font-medium tracking-[-0.025em] text-[#474C52]"
          >
            {wd}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {cells.map((cell, idx) => {
          const hasRetro = cell.isCurrentMonth && historySet.has(cell.date);
          return (
            <button
              key={idx}
              type="button"
              onClick={() => handleDayClick(cell)}
              disabled={!hasRetro}
              className={`flex h-[106px] flex-col items-start gap-2.5 px-[5px] py-2 ${
                hasRetro ? 'cursor-pointer' : 'cursor-default'
              }`}
            >
              <span
                className={`flex h-[25px] w-[25px] items-center justify-center text-[14px] font-medium tracking-[-0.025em] ${
                  cell.isCurrentMonth ? 'text-[#1C1D1F]' : 'text-[#9FA4A8]'
                }`}
              >
                {cell.day}
              </span>
              {hasRetro && (
                <div className="flex w-[25px] items-center justify-center">
                  <span className="h-2 w-2 rounded-full bg-[#13278A]" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      <MonthPickerBottomSheet
        isOpen={isPickerOpen}
        selectedYear={pendingYear}
        selectedMonth={pendingMonth}
        onChange={handlePickerChange}
        onConfirm={handlePickerConfirm}
        onClose={() => setIsPickerOpen(false)}
      />
    </div>
  );
}
