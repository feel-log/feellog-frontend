'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useFormattedDate } from '@/shared/hooks';
import { getDailyExpense, dailyExpenses } from '@/shared/constants/dailyExpense';
import Image from 'next/image';
import { cn } from '@/shared/lib/utils';

const TODAY = new Date('2026-04-21');
const MIN_DATE = new Date('2026-04-08');

export default function TodayExpenseBox() {
  const router = useRouter();
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
    <div className="relative mb-4 w-full rounded-[8px] bg-linear-to-r from-white to-[#eaf5ff] px-4 py-4 shadow-[0px_0px_8px_0px_rgba(19,39,138,0.15)]">
      <div className="mb-5 flex flex-col">
        <span className="text-[14px] text-gray-500">오늘의 지출 비용</span>
        <span className="text-[18px] font-bold">{totalAmount.toLocaleString()}원</span>
      </div>

      <button
        className={'absolute top-5 right-5 cursor-pointer'}
        onClick={() => router.push(`/export?date=${dateString}`)}
      >
        <Image src={'/svg/icon_arrow_right.svg'} alt={'right-arrow'} width={20} height={20} />
      </button>

      <div className={cn('flex items-center gap-4', totalAmount === 0 ? 'mb-2' : 'mb-6')}>
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
          <Image
            src={'/svg/icon_arrow_left_fill.svg'}
            alt={'next'}
            width={20}
            height={20}
            className={'rotate-180'}
          />
        </button>
      </div>

      {totalAmount === 0 ? (
        <div className="flex flex-col items-center justify-center">
          <p className="mb-4 self-start text-[14px] font-medium text-gray-500">
            아직 지출이 없어요
          </p>
          <button
            onClick={() => router.push(`/record?date=${dateString}`)}
            className="w-full rounded-lg border border-gray-300 py-3 text-center font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
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
                  <span className="text-[15px] font-bold">
                    {category.amount.toLocaleString()}원
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {category.emotions.map((emotion, emoIdx) => (
                    <span
                      key={emoIdx}
                      className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-sm"
                    >
                      <Image src={emotion.emoji} alt={emotion.label} width={14} height={14} />
                      <span className="text-gray-700">{emotion.label}</span>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button className="mt-6 w-full rounded-lg border border-gray-300 py-3 text-center font-medium text-gray-700 transition-colors hover:bg-gray-50 cursor-pointer">
            더보기
          </button>
        </>
      )}
    </div>
  );
}
