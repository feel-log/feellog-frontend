'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import RetroEmpty from '@/features/retro/ui/RetroEmpty';
import RetroMain from '@/features/retro/ui/RetroMain';
import { retroMockData } from '@/features/retro/mock/retroMockData';

const TODAY = new Date();
const TODAY_LABEL = `${TODAY.getMonth() + 1}월 ${TODAY.getDate()}일 지출`;

export default function RetroPage() {
  const router = useRouter();

  const totalExpense = retroMockData.totalExpense;
  const hasData = totalExpense > 0;

  return (
    <div className="flex flex-1 flex-col">
      {/* 헤더 */}
      <header className="flex h-14 items-center justify-between px-4">
        <button onClick={() => router.push('/')} aria-label="메인으로 이동">
          <Image src="/icons/icon_arrow_left.svg" alt="" width={28} height={28} />
        </button>
        <h1 className="text-[20px] font-semibold leading-normal tracking-[-0.5px] text-[#030303]">
          회고하기
        </h1>
        <div className="w-7" />
      </header>

      <div className="px-4 pt-5">
        <p className="text-[16px] font-medium leading-normal tracking-[-0.4px] text-[#73787E]">
          {TODAY_LABEL}
        </p>
        <p className="text-[28px] font-semibold leading-normal tracking-[-0.7px] text-[#030303]">
          {totalExpense.toLocaleString()}원
        </p>
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

      <div className="flex w-full items-center justify-center bg-white px-4 pt-6 pb-12.75">
        <button
          onClick={() => router.push(hasData ? '/retro/survey' : '/record?type=expense')}
          className="h-13.5 w-full rounded-[10px] bg-[#13278A] text-[20px] font-semibold leading-normal tracking-[-0.5px] text-white transition-colors hover:bg-[#0F1F6E]"
        >
          {hasData ? '소비 회고하기' : '소비 기록하러 가기'}
        </button>
      </div>
    </div>
  );
}
