'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useToken, useUser } from '@/shared/store';
import { useUserGetter } from '@/entities/user';
import { reportQueries } from '@/entities/report';
import ReportMonthCard from '@/widgets/report/ReportMonthCard';
import ReportEmpty from '@/widgets/report/ReportEmpty';
import ReportInsights from '@/widgets/report/ReportInsights';
import CategoryChart from '@/widgets/report/CategoryChart';
import EmotionList from '@/widgets/report/EmotionList';
import SituationTags from '@/widgets/report/SituationTags';
import Footer from '@/shared/ui/Footer';
import PageHeader from '@/shared/ui/PageHeader';

const CATEGORY_COLORS = ['#13278A', '#58E1B6', '#FFDB72', '#CACDD2', '#F7F8FA'];

export default function ReportContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const today = new Date();
  const year = Number(searchParams?.get('year') ?? today.getFullYear());
  const month = Number(searchParams?.get('month') ?? today.getMonth() + 1);

  const handleYearMonthChange = (ym: { year: number; month: number }) => {
    const params = new URLSearchParams();
    params.set('year', String(ym.year));
    params.set('month', String(ym.month));
    router.replace(`/report?${params.toString()}`, { scroll: false });
  };

  const { getAccessToken } = useToken();
  const token = getAccessToken();
  useUserGetter(token);
  const nickname = useUser((s) => s.nickname);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { data, isLoading } = useQuery({
    ...reportQueries.monthly(token || '', year, month),
    enabled: !!token,
  });

  const prevYear = month === 1 ? year - 1 : year;
  const prevMonth = month === 1 ? 12 : month - 1;
  const { data: prevData } = useQuery({
    ...reportQueries.monthly(token || '', prevYear, prevMonth),
    enabled: !!token,
  });

  const userName = mounted ? nickname || '회원' : '회원';

  const income = data?.summary.totalIncome ?? 0;
  const expense = data?.summary.totalExpense ?? 0;
  const hasData = !!data && (income > 0 || expense > 0);

  const categories = (data?.categories.list ?? []).map((c, idx) => ({
    id: c.categoryId,
    name: c.categoryName,
    amount: c.totalAmount,
    percentage: Math.round(c.shareRate),
    color: CATEGORY_COLORS[idx % CATEGORY_COLORS.length],
  }));

  const emotions = (data?.emotions.list ?? []).map((e) => ({
    id: e.emotionId,
    rank: e.rank,
    emoji: '',
    name: e.emotionName,
    amount: e.linkedAmount,
  }));

  const situations = (data?.situations.list ?? []).map((s) => ({
    rank: s.rank,
    name: s.situationName,
  }));

  const categoryDirection = (() => {
    const target = data?.comments.categoryChange.targetName;
    if (!target || !prevData) return null;
    const current = data.categories.list.find((c) => c.categoryName === target)?.totalAmount ?? 0;
    const previous = prevData.categories.list.find((c) => c.categoryName === target)?.totalAmount ?? 0;
    if (current > previous) return 'up' as const;
    if (current < previous) return 'down' as const;
    return null;
  })();

  const insights = data
    ? ([
        {
          type: 'categoryChange' as const,
          message: data.comments.categoryChange.message,
          targetName: data.comments.categoryChange.targetName,
          direction: categoryDirection,
        },
        {
          type: 'emotionTrend' as const,
          message: data.comments.emotionTrend.message,
          targetName: data.comments.emotionTrend.targetName,
        },
        {
          type: 'situationTrend' as const,
          message: data.comments.situationTrend.message,
          targetName: data.comments.situationTrend.targetName,
        },
      ])
    : [];

  return (
    <div className="flex flex-1 flex-col bg-white">
      <PageHeader title="리포트" showBack={false} />

      <div className="flex flex-col gap-6.25 px-4 pt-5 pb-30">
        <ReportMonthCard
          year={year}
          month={month}
          income={income}
          expense={expense}
          onYearMonthChange={handleYearMonthChange}
          onExpenseDetailClick={() =>
            router.push(
              hasData
                ? `/report/monthly?year=${year}&month=${month}`
                : '/record?type=expense',
            )
          }
        />

        {isLoading ? (
          <div className="flex flex-1 items-center justify-center py-20">
            <p className="text-[14px] text-[#9FA4A8]">불러오는 중...</p>
          </div>
        ) : hasData ? (
          <>
            <ReportInsights userName={userName} insights={insights} />
            <CategoryChart
              categories={categories}
              year={year}
              month={month}
            />
            <EmotionList
              emotions={emotions}
              year={year}
              month={month}
            />
            <SituationTags situations={situations} />
          </>
        ) : (
          <ReportEmpty />
        )}
      </div>

      <Footer />
    </div>
  );
}
