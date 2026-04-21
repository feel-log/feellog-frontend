'use client';

import { useState, useMemo } from 'react';
import { useFormattedDate } from '@/shared/hooks';
import { getDailyExpense, dailyExpenses } from '@/shared/constants/dailyExpense';
import Image from 'next/image';

const TODAY = new Date('2026-04-21');
const MIN_DATE = new Date('2026-04-08');

export default function TodayExpenseBox() {
  const [selectedDate, setSelectedDate] = useState<Date>(TODAY);

  const canGoPrev = selectedDate > MIN_DATE;
  const canGoNext = selectedDate < TODAY;

  const handlePrevDay = () => {
    if (canGoPrev) {
      const newDate = new Date(selectedDate);
      newDate.setDate(newDate.getDate() - 1);
      setSelectedDate(newDate);
    }
  };

  const handleNextDay = () => {
    if (canGoNext) {
      const newDate = new Date(selectedDate);
      newDate.setDate(newDate.getDate() + 1);
      setSelectedDate(newDate);
    }
  };

  const dateString = selectedDate.toISOString().split('T')[0];
  const expenseData = useMemo(() => getDailyExpense(dateString), [dateString]);
  const formattedDate = useFormattedDate(selectedDate.toISOString(), {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
  });

  const totalAmount = expenseData?.totalAmount ?? 0;

  return (
    <div className="mb-4 w-full rounded-[8px] bg-gradient-to-r from-white to-[#eaf5ff] px-8 py-4 shadow-[0px_0px_8px_0px_rgba(19,39,138,0.15)]">
      <div className="mb-5 flex flex-col">
        <span className="text-[14px] text-gray-500">오늘의 지출 비용</span>
        <span className="text-[18px] font-bold">{totalAmount.toLocaleString()}원</span>
      </div>

      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={handlePrevDay}
          disabled={!canGoPrev}
          className={`text-2xl transition-colors ${
            canGoPrev
              ? 'cursor-pointer text-gray-700 hover:text-black'
              : 'cursor-not-allowed text-gray-300'
          }`}
        >
          <Image src={'/svg/icon_arrow_left_fill.svg'} alt={'prev'} width={20} height={20} />
        </button>
        <span className="text-[17px] font-medium">{formattedDate}</span>
        <button
          onClick={handleNextDay}
          disabled={!canGoNext}
          className={`text-2xl transition-colors ${
            canGoNext
              ? 'cursor-pointer text-gray-700 hover:text-black'
              : 'cursor-not-allowed text-gray-300 opacity-50'
          }`}
        >
          <Image src={'/svg/icon_arrow_left_fill.svg'} alt={'next'} width={20} height={20} className={"rotate-180"} />
        </button>
      </div>

      {totalAmount === 0 ? (
        <div className="flex flex-col items-center justify-center py-10">
          <p className="mb-4 text-center text-[16px] font-medium text-gray-700">아직 지출이 없어요</p>
          <button className="w-full rounded-lg bg-blue-600 py-3 text-center font-medium text-white transition-colors hover:bg-blue-700">
            오늘의 지출 기록하러가기
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {expenseData?.categories.map((category, idx) => (
              <div key={idx} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[15px] font-medium">{category.name}</span>
                  <span className="text-[15px] font-bold">{category.amount.toLocaleString()}원</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {category.emotions.map((emotion, emoIdx) => (
                    <span
                      key={emoIdx}
                      className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-sm"
                    >
                      <span className="text-lg">{emotion.emoji}</span>
                      <span className="text-gray-700">{emotion.label}</span>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button className="mt-6 w-full rounded-lg border border-gray-300 py-3 text-center font-medium text-gray-700 transition-colors hover:bg-gray-50">
            더보기
          </button>
        </>
      )}
    </div>
  );
}
