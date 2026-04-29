'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CalendarHeader from '@/widgets/calendar/CalendarHeader';
import CalendarGrid from '@/widgets/calendar/CalendarGrid';
import DateBottomSheet from '@/widgets/calendar/DateBottomSheet';
import PageHeader from '@/shared/ui/PageHeader';
import {
  getCalendarDailyData,
  getDailyAmounts,
  getMonthlyTotals,
} from '@/shared/constants/calendarMockData';

export default function CalendarPage() {
  const router = useRouter();
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const dailyAmounts = getDailyAmounts();
  const dayData = getCalendarDailyData(selectedDay);
  const monthlyTotals = getMonthlyTotals();

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
          onClose={() => setSelectedDay(null)}
        />
      )}
    </div>
  );
}
