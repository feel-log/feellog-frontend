'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import ReportMonthCard from '@/widgets/report/ReportMonthCard';
import ReportEmpty from '@/widgets/report/ReportEmpty';
import ReportInsights from '@/widgets/report/ReportInsights';
import Footer from '@/shared/ui/Footer';
import PageHeader from '@/shared/ui/PageHeader';
import FullScreenLoader from '@/shared/ui/FullScreenLoader';
import { useIsMounted } from '@/shared/hooks';
import { useToken } from '@/shared/store';
import { reportQueries } from '@/entities/report/api/report-queries';

const CategoryChart = dynamic(() => import('@/widgets/report/CategoryChart'), {
  loading: () => <div className="h-64 bg-gray-200 rounded animate-pulse" />,
});
const EmotionList = dynamic(() => import('@/widgets/report/EmotionList'), {
  loading: () => <div className="h-48 bg-gray-200 rounded animate-pulse" />,
});
const SituationTags = dynamic(() => import('@/widgets/report/SituationTags'), {
  loading: () => <div className="h-32 bg-gray-200 rounded animate-pulse" />,
});

export default function ReportPage() {
  const router = useRouter();
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const isMounted = useIsMounted();
  const { getAccessToken, isLoaded } = useToken();
  const accessToken = getAccessToken();

  const { data: reportData, isLoading } = useQuery(
    reportQueries.monthly(accessToken || '', year, month)
  );

  const hasData = reportData && (reportData.summary.totalIncome > 0 || reportData.summary.totalExpense > 0);

  const insightsArray = reportData?.comments ? [
    { type: 'categoryChange' as const, ...reportData.comments.categoryChange },
    { type: 'emotionTrend' as const, ...reportData.comments.emotionTrend },
    { type: 'situationTrend' as const, ...reportData.comments.situationTrend },
  ] : [];

  const isLoadingData = !isMounted || !isLoaded || isLoading;

  return (
    <>
      <FullScreenLoader isLoading={isLoadingData} />
      <div className={`flex flex-1 flex-col bg-white ${isLoadingData ? 'pointer-events-none' : ''}`}>
        <PageHeader title="리포트" showBack={false} />

        <div className="flex flex-col gap-6.25 px-4 pt-5 pb-30">
          <ReportMonthCard
            year={year}
            month={month}
            income={reportData?.summary.totalIncome ?? 0}
            expense={reportData?.summary.totalExpense ?? 0}
            onYearMonthChange={(ym) => {
              setYear(ym.year);
              setMonth(ym.month);
            }}
            onExpenseDetailClick={() =>
              router.push(hasData ? '/report/monthly' : '/record?type=expense')
            }
          />

          {hasData && reportData ? (
            <>
              <ReportInsights userName="사용자" insights={insightsArray} />
              <CategoryChart categories={reportData.categories.list} year={year} month={month} />
              <EmotionList emotions={reportData.emotions.list} year={year} month={month} />
              <SituationTags situations={reportData.situations.list} />
            </>
          ) : (
            <ReportEmpty />
          )}

          <Footer />
        </div>
      </div>
    </>
  );
}
