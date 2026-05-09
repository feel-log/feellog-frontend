'use client';

import { useState } from 'react';
import Image from 'next/image';
import BottomSheet from '@/shared/ui/BottomSheet';
import { cn } from '@/shared/lib/utils';
import { getCalendarDays, DAY_OF_WEEK } from '@/shared/utils/record';

interface DatePickerBottomSheetProps {
  isOpen: boolean;
  selectedDate: string;
  today: string;
  onClose: () => void;
  onSave: (date: string) => void;
}

export default function DatePickerBottomSheet({
  isOpen,
  selectedDate,
  today,
  onClose,
  onSave,
}: DatePickerBottomSheetProps) {
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const [year, month] = selectedDate.split('-').map(Number);
    return { year, month };
  });
  const [tempDate, setTempDate] = useState(selectedDate);
  const now = new Date();

  const handleSave = () => {
    onSave(tempDate);
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      title="날짜를 선택해주세요"
      onClose={onClose}
      onSave={handleSave}
      height={636}
    >
      <div>
        <div className="mb-5 flex items-center gap-5">
          <button
            onClick={() => {
              if (calendarMonth.month === 1) {
                setCalendarMonth({ year: calendarMonth.year - 1, month: 12 });
              } else {
                setCalendarMonth({ ...calendarMonth, month: calendarMonth.month - 1 });
              }
            }}
            className="cursor-pointer"
            aria-label="이전 달"
          >
            <Image src={'/svg/icon_arrow_left_fill.svg'} alt={'left'} width={30} height={30} />
          </button>
          <h3 className="min-w-13.5 text-center text-[20px] font-bold tracking-[-0.025em] text-[#27282c]">
            {calendarMonth.year === 2026 ? `${calendarMonth.month}월` : `${calendarMonth.year}년 ${calendarMonth.month}월`}
          </h3>
          <button
            onClick={() => {
              if (calendarMonth.month === 12) {
                setCalendarMonth({ year: calendarMonth.year + 1, month: 1 });
              } else {
                setCalendarMonth({ ...calendarMonth, month: calendarMonth.month + 1 });
              }
            }}
            disabled={calendarMonth.year > now.getFullYear() || (calendarMonth.year === now.getFullYear() && calendarMonth.month >= now.getMonth() + 1)}
            className={cn(
              'transition-opacity',
              calendarMonth.year > now.getFullYear() || (calendarMonth.year === now.getFullYear() && calendarMonth.month >= now.getMonth() + 1)
                ? 'cursor-not-allowed opacity-40'
                : 'cursor-pointer'
            )}
            aria-label="다음 달"
          >
            <Image
              src={'/svg/icon_arrow_left_fill.svg'}
              alt={'right'}
              width={30}
              height={30}
              className={'rotate-180'}
            />
          </button>
        </div>

        <div className="mb-5 grid grid-cols-7 text-center">
          {DAY_OF_WEEK.map((day) => (
            <div key={day} className="text-[14px] font-medium tracking-[-0.025em] text-[#73787e]">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-y-5 text-center">
          {getCalendarDays(calendarMonth.year, calendarMonth.month, today).map((item, idx) => {
            const isSelected = item.date === tempDate;
            const isToday = item.date === today;
            const isFutureDate = new Date(item.date) > new Date(today);
            const handleDayClick = () => {
              if (isFutureDate) return;
              if (!item.isCurrentMonth) {
                const [y, m] = item.date.split('-').map(Number);
                setCalendarMonth({ year: y, month: m });
              }
              setTempDate(item.date);
            };
            return (
              <button
                key={idx}
                onClick={handleDayClick}
                disabled={isFutureDate}
                className={cn(
                  'relative mx-auto flex h-7.5 w-7.5 items-center justify-center text-[18px] font-semibold tracking-[-0.025em] transition-colors',
                  isFutureDate
                    ? 'cursor-not-allowed text-[#d0d0d0] opacity-50'
                    : isSelected
                      ? 'rounded-full bg-[#13278a] text-white cursor-pointer'
                      : isToday
                        ? 'rounded-full bg-[#e5e5e5] text-[#030303] cursor-pointer'
                        : item.isCurrentMonth
                          ? 'text-[#030303] cursor-pointer'
                          : 'text-[#9fa4a8] cursor-pointer'
                )}
              >
                {item.day}
              </button>
            );
          })}
        </div>
      </div>
    </BottomSheet>
  );
}
