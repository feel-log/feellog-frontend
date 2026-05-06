'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useToken, useUser } from '@/shared/store';
import { useIsMounted } from '@/shared/hooks';
import { useUserGetter } from '@/entities/user';
import { reportQueries } from '@/entities/report';
import { useMasterData } from '@/entities/master-data';
import ReportMonthCard from '@/widgets/report/ReportMonthCard';
import ReportEmpty from '@/widgets/report/ReportEmpty';
import ReportInsights from '@/widgets/report/ReportInsights';
import CategoryChart from '@/widgets/report/CategoryChart';
import EmotionList from '@/widgets/report/EmotionList';
import SituationTags from '@/widgets/report/SituationTags';
import Footer from '@/shared/ui/Footer';
import PageHeader from '@/shared/ui/PageHeader';
import FullScreenLoader from '@/shared/ui/FullScreenLoader';
import { AuthGuard } from '@/shared/ui/guard/AuthGuard';

const CATEGORY_COLORS = ['#13278A', '#1BC590', '#FFDB72', '#E5E5E5', '#FFFFFF'];

export default function ReportContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { emotions: masterEmotions } = useMasterData();
  const today = new Date();
  const year = Number(searchParams?.get('year') ?? today.getFullYear());
  const month = Number(searchParams?.get('month') ?? today.getMonth() + 1);

  const handleYearMonthChange = (ym: { year: number; month: number }) => {
    const params = new URLSearchParams();
    params.set('year', String(ym.year));
    params.set('month', String(ym.month));
    router.replace(`/report?${params.toString()}`, { scroll: false });
  };

  const isMounted = useIsMounted();
  const { getAccessToken, isLoaded } = useToken();
  const token = getAccessToken();
  useUserGetter(token);
  const nickname = useUser((s) => s.nickname);

  const { data, isLoading } = useQuery({
    ...reportQueries.monthly(token || '', year, month),
    enabled: !!token && isMounted,
  });

  const prevYear = month === 1 ? year - 1 : year;
  const prevMonth = month === 1 ? 12 : month - 1;
  const { data: prevData } = useQuery({
    ...reportQueries.monthly(token || '', prevYear, prevMonth),
    enabled: !!token && isMounted,
  });

  const userName = isMounted ? nickname || '회원' : '회원';

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

  const emotions = (data?.emotions.list ?? []).map((e) => {
    const emotionData = masterEmotions.flatMap((g) => g.items).find(
      (item) => item.id === e.emotionId,
    );
    return {
      id: e.emotionId,
      rank: e.rank,
      emoji: emotionData?.emoji ?? '',
      name: e.emotionName,
      amount: e.linkedAmount,
    };
  });

  const situations = (data?.situations.list ?? []).map((s) => ({
    situationTagId: s.situationTagId,
    situationName: s.situationName,
    occurrenceCount: s.occurrenceCount,
    rank: s.rank,
  }));

  const categoryDirection = (() => {
    const target = data?.comments.categoryChange.targetName;
    if (!target || !prevData) return null;
    const current =
      data.categories.list.find((c) => c.categoryName === target)?.totalAmount ?? 0;
    const previous =
      prevData.categories.list.find((c) => c.categoryName === target)?.totalAmount ?? 0;
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

  const isLoadingData = !isMounted || !isLoaded || isLoading;

  return (
    <AuthGuard>
      <FullScreenLoader isLoading={isLoadingData} />
      <div
        className={`flex flex-1 flex-col bg-white ${isLoadingData ? 'pointer-events-none' : ''}`}
      >
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

          {hasData ? (
            <>
              <ReportInsights userName={userName} insights={insights} />
              <CategoryChart categories={categories} year={year} month={month} />
              <EmotionList emotions={emotions} year={year} month={month} />
              <SituationTags situations={situations} />
            </>
          ) : (
            <ReportEmpty />
          )}

          <Footer />
        </div>
      </div>
    </AuthGuard>
  );
}
