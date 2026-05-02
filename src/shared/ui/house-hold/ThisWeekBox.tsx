'use client';

import { useState, useEffect } from 'react';
import { generateThisWeek, ThisWeekData } from '@/shared/constants/thisWeek';
import { cn } from '@/shared/lib/utils';

export default function ThisWeekBox() {
  const [weekData, setWeekData] = useState<ThisWeekData[]>([]);
  const [todayDate, setTodayDate] = useState<number>(0);

  useEffect(() => {
    const today = new Date();
    setTodayDate(today.getDate());
    setWeekData(generateThisWeek(today));
  }, []);

  if (weekData.length === 0) {
    return <div className={'this__week__box flex w-full justify-between'} />;
  }

  return (
    <div className={'this__week__box flex w-full items-start justify-between'}>
      {weekData.map((week) => {
        const isToday = week.day === todayDate;
        return (
          <div className={'this__week__each flex flex-col items-center gap-1.25'} key={week.id}>
            <span className={'text-[14px] font-medium tracking-[-0.025em] text-[#73787e]'}>{week.week}</span>
            <span
              className={cn(
                'flex h-7.5 w-7.5 items-center justify-center rounded-full text-[18px] font-semibold tracking-[-0.025em] transition-colors',
                isToday ? 'bg-[#7bbdff] text-white' : 'text-[#030303]'
              )}
            >
              {week.day}
            </span>
            {week.changed && (
              <span className={'text-[12px] font-medium tracking-[-0.025em] text-[#eb1c1c]'}>{week.changed.toLocaleString()}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}