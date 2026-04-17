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

  // 바텀시트 임시 더미 데이터
  const dummyData = {
    income: 50000,
    expense: 50000,
    expenseItems: [
      { category: '카페', tags: ['기분전환', '보상심리'], amount: 12000 },
      { category: '취미', tags: ['기분전환', '할인'], amount: 12000 },
      { category: '식비', tags: ['약속'], amount: 12000 },
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

      {/* 월 이동 + 수입/지출/합계 출력 */}
      <div className="mt-5">
        <CalendarHeader
          year={year}
          month={month}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
        />
      </div>

      {/* 캘린더 그리드 */}
      <div className="mt-2.5 flex flex-1 flex-col">
        <CalendarGrid
          year={year}
          month={month}
          onDateClick={(day) => setSelectedDay(day)}
        />
      </div>

      {/* 바텀시트 */}
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
