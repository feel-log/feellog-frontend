'use client';

import { useState } from 'react';
import RetroEmpty from '@/features/retro/ui/RetroEmpty';
import RetroMain from '@/features/retro/ui/RetroMain';
import { retroMockData } from '@/features/retro/mock/retroMockData';

export default function RetroPage() {
  const { totalExpense } = retroMockData;
  const hasData = totalExpense > 0;
  const [showTooltip, setShowTooltip] = useState(true);

  const today = new Date();
  const dateLabel = `${today.getMonth() + 1}월 ${today.getDate()}일 지출`;

  return (
    <div className="flex flex-1 flex-col">
      {/* 상단 헤더 (공용 컴포넌트로 변경 예정) */}
      <header className="flex h-14 items-center justify-between px-4">
        <button>
          <img
            src="/icons/icon_arrow_left.svg"
            alt="뒤로가기"
            width={28}
            height={28}
          />
        </button>
        <h1 className="text-[20px] font-semibold text-[#030303]">회고하기</h1>
        <div className="w-7" />
      </header>

      <div className="px-4 pt-5">
        <p className="text-[16px] font-medium leading-6 text-[#73787E]">
          {dateLabel}
        </p>
        <div className="relative flex items-center gap-2">
          <p className="text-[28px] font-semibold text-[#030303]">
            {totalExpense.toLocaleString()}원
          </p>
          <button onClick={() => setShowTooltip(!showTooltip)}>
            <img src="/icons/icon_info.svg" alt="정보" width={28} height={28} />
          </button>

          {showTooltip && (
            <div className="absolute left-42.5 top-1/2 -translate-y-1/2 z-10 flex items-start gap-2.5 rounded-lg bg-white p-2 px-2.5 shadow-[0_1px_4px_rgba(0,0,0,0.2)]">
              <p className="w-41.25 text-[12px] font-medium leading-[150%] text-[#73787E]">
                가계부를 더 자세히 기록할수록, 회고가 더 정확해져요
              </p>
              <button onClick={() => setShowTooltip(false)}>
                <img src="/icons/icon_X.svg" alt="닫기" width={12} height={12} />
              </button>
              <div className="absolute -left-1.5 top-5 size-3 rotate-45 bg-white shadow-[-1px_1px_2px_rgba(0,0,0,0.1)]" />
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-1 items-start justify-center px-4 pt-7">
        {hasData ? (
          <RetroMain
            totalExpense={totalExpense}
            topCategory={retroMockData.topCategory}
            topCategoryRatio={retroMockData.topCategoryRatio}
            categories={retroMockData.categories}
            emotions={retroMockData.emotions}
          />
        ) : (
          <RetroEmpty />
        )}
      </div>

      <div className="flex w-full items-center justify-center bg-white pt-6 pb-12.75 pl-4.25 pr-3.75">
        <button className="h-13.5 w-full rounded-[10px] bg-[#13278A] text-[20px] font-semibold text-white">
          {hasData ? '소비 회고하기' : '소비 기록하러 가기'}
        </button>
      </div>
    </div>
  );
}
