'use client';

import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useToken } from '@/shared/store';
import { reportQueries } from '@/entities/report';
import RetroEmpty from '@/widgets/retro/RetroEmpty';
import RetroMain from '@/widgets/retro/RetroMain';
import PageHeader from '@/shared/ui/PageHeader';

function todayLabel(): string {
  const d = new Date();
  return `${d.getMonth() + 1}월 ${d.getDate()}일 지출`;
}

export default function RetroContent() {
  const router = useRouter();
  const { getAccessToken } = useToken();
  const token = getAccessToken();

  const { data, isLoading } = useQuery({
    ...reportQueries.daily(token || ''),
    enabled: !!token,
  });

  const totalExpense = data?.summary.totalExpenseAmount ?? 0;
  const hasData = totalExpense > 0;

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-white">
      <PageHeader title="회고하기" backHref="/" />

      <div className="px-4 pt-5">
        <p className="text-[16px] font-medium leading-normal tracking-[-0.4px] text-[#73787E]">
          {todayLabel()}
        </p>
        <p className="text-[28px] font-semibold leading-normal tracking-[-0.7px] text-[#030303]">
          {totalExpense.toLocaleString()}원
        </p>
      </div>

      <div className="flex flex-1 items-start justify-center px-4 pt-5 pb-6">
        {isLoading ? (
          <p className="py-10 text-[14px] text-[#9FA4A8]">불러오는 중...</p>
        ) : hasData && data ? (
          <RetroMain
            expenseGraph={data.expenseGraph}
            emotions={data.emotions.list}
            isEmotionsEmpty={data.emotions.isEmpty}
          />
        ) : (
          <RetroEmpty />
        )}
      </div>

      <div className="flex w-full items-center justify-center bg-white px-4 pt-6 pb-9">
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
