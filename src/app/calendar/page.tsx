'use client';

import { useState } from 'react';
import CalendarHeader from '@/features/calendar/ui/CalendarHeader';
import CalendarGrid from '@/features/calendar/ui/CalendarGrid';
import DateBottomSheet from '@/features/calendar/ui/DateBottomSheet';

export default function CalendarPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const dummyData = {
    income: 50000,
    expense: 50000,
    expenseItems: [
      { category: '카페', tags: ['기분전환', '보상심리'], amount: 12000, paymentMethod: '현금' },
      { category: '생필품', tags: ['필요'], amount: 24000, paymentMethod: '체크카드' },
      { category: '식비', tags: ['약속'], amount: 16000, paymentMethod: '체크카드' },
    ],
  };

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
      {/* 상단 헤더 (공용 컴포넌트로 변경예정) */}
      <header className="flex h-14 items-center justify-between px-4">
        <button>
          <img
            src="/icons/icon_arrow_left.svg"
            alt="뒤로가기"
            width={28}
            height={28}
          />
        </button>
        <h1 className="text-base font-bold">캘린더</h1>
        <div className="w-6" />
      </header>

      <div className="mt-5">
        <CalendarHeader
          year={year}
          month={month}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
        />
      </div>

      <div className="mt-2.5 flex flex-1 flex-col">
        <CalendarGrid
          year={year}
          month={month}
          onDateClick={(day) => setSelectedDay(day)}
        />
      </div>

      <div className="fixed bottom-0 left-1/2 flex w-full max-w-md -translate-x-1/2 justify-end">
        <button className="mb-46.75 mr-7.5 z-40 flex size-14.5 items-center justify-center rounded-full bg-[#13278A] p-2.75 shadow-[2px_3px_7px_0px_rgba(49,49,49,0.3)]">
          <img src="/icons/icon_plus.svg" alt="지출 추가" width={36} height={36} />
        </button>
      </div>

      {selectedDay !== null && (
        <DateBottomSheet
          date={selectedDay}
          month={month}
          year={year}
          income={dummyData.income}
          expense={dummyData.expense}
          expenseItems={dummyData.expenseItems}
          onClose={() => setSelectedDay(null)}
        />
      )}
    </div>
  );
}
