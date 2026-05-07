'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useToken } from '@/shared/store';
import { reportQueries } from '@/entities/report';
import RetroEmpty from '@/widgets/retro/RetroEmpty';
import RetroMain from '@/widgets/retro/RetroMain';
import RetroSkeleton from '@/widgets/retro/RetroSkeleton';
import PageHeader from '@/shared/ui/PageHeader';
import Skeleton from '@/shared/ui/Skeleton';

export default function RetroContent() {
  const router = useRouter();
  const { getAccessToken } = useToken();
  const token = getAccessToken();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();

  const { data, isLoading } = useQuery({
    ...reportQueries.daily(token || '', year, month, day),
    enabled: !!token && mounted,
  });

  const totalExpense = data?.summary.totalExpenseAmount ?? 0;
  const hasData = totalExpense > 0;

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-white">
      <PageHeader title="회고하기" backHref="/" />

      <div className="px-4 pt-5">
        {!mounted || isLoading ? (
          <Skeleton className="h-16 w-full rounded-[8px]" />
        ) : (
          <>
            <p className="text-[16px] font-medium leading-normal tracking-[-0.4px] text-[#73787E]">
              {`${month}월 ${day}일 지출`}
            </p>
            <p className="text-[28px] font-semibold leading-normal tracking-[-0.7px] text-[#030303]">
              {totalExpense.toLocaleString()}원
            </p>
          </>
        )}
      </div>

      <div className="flex flex-1 items-start justify-center px-4 pt-5 pb-6">
        {!mounted || isLoading ? (
          <RetroSkeleton />
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
