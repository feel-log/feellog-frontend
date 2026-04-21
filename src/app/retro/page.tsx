'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import RetroEmpty from '@/features/retro/ui/RetroEmpty';
import RetroMain from '@/features/retro/ui/RetroMain';
import { retroMockData } from '@/features/retro/mock/retroMockData';

const TODAY = new Date();
const TODAY_LABEL = `${TODAY.getMonth() + 1}월 ${TODAY.getDate()}일 지출`;

export default function RetroPage() {
  const router = useRouter();
  const [showTooltip, setShowTooltip] = useState(true);

  const totalExpense = 0; // 임시: 지출 데이터 없음
  const hasData = totalExpense > 0;

  return (
    <div className="flex flex-1 flex-col">
      {/* 헤더 */}
      <header className="flex h-14 items-center justify-between border-b border-gray-200 px-4">
        <button onClick={() => router.back()}>
          <Image src="/icons/icon_arrow_left.svg" alt="뒤로가기" width={28} height={28} />
        </button>
        <h1 className="text-lg font-semibold">회고하기</h1>
        <div className="w-7" />
      </header>

      {/* 날짜 / 금액 */}
      <div className="px-4 pt-5">
        <p className="mb-2 text-sm font-medium text-gray-500">{TODAY_LABEL}</p>
        <div className="relative flex items-center gap-2">
          <p className="text-[28px] font-bold">{totalExpense.toLocaleString()}원</p>
          <button onClick={() => setShowTooltip(!showTooltip)}>
            <Image src="/icons/icon_info.svg" alt="정보" width={28} height={28} />
          </button>

          {showTooltip && (
            <div className="absolute top-1/2 left-40 z-10 flex -translate-y-1/2 items-start gap-2.5 rounded-lg bg-white p-2.5 shadow-sm">
              <p className="max-w-[165px] text-xs font-medium text-gray-500">
                가계부를 더 자세히 기록할수록, 회고가 더 정확해져요
              </p>
              <button onClick={() => setShowTooltip(false)}>
                <Image src="/icons/icon_X.svg" alt="닫기" width={12} height={12} />
              </button>
              <div className="absolute top-4 -left-1.5 h-3 w-3 rotate-45 bg-white shadow-sm" />
            </div>
          )}
        </div>
      </div>

      {/* 콘텐츠 영역 */}
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

      {/* 하단 버튼 */}
      <div className="flex w-full items-center justify-center bg-white px-4 pt-6 pb-24">
        <button
          onClick={() => router.push(hasData ? '/retro/survey' : '/calendar')}
          className="h-14 w-full rounded-lg bg-blue-900 text-base font-semibold text-white transition-colors hover:bg-blue-800"
        >
          {hasData ? '소비 회고하기' : '소비 기록하러 가기'}
        </button>
      </div>
    </div>
  );
}
