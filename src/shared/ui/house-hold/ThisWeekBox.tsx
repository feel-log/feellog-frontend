'use client';

import { useState, useEffect } from 'react';
import { generateThisWeek, ThisWeekData } from '@/shared/constants/thisWeek';

export default function ThisWeekBox() {
  const [weekData, setWeekData] = useState<ThisWeekData[]>([]);
  const [todayDate, setTodayDate] = useState<number>(0);

  useEffect(() => {
    const today = new Date();
    setTodayDate(today.getDate());
    setWeekData(generateThisWeek());
  }, []);

  if (weekData.length === 0) {
    return <div className={'this__week__box flex w-full gap-4'} />;
  }

  return (
    <div className={'this__week__box flex w-full gap-4'}>
      {weekData.map((week) => {
        const isToday = week.day === todayDate;
        return (
          <div className={'this__week__each flex flex-1 flex-col items-center gap-2'} key={week.id}>
            <span className={'text-gray-500'}>{week.week}</span>
            <span
              className={`font-bold w-8 h-8 flex justify-center items-center rounded-full transition-colors ${
                isToday ? 'bg-[#7bbdff] text-white' : ''
              }`}
            >
              {week.day}
            </span>
            {week.changed && (
              <span className={'text-[14px] text-red-500'}>{week.changed.toLocaleString()}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}