'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import ReportMonthCard from '@/widgets/report/ReportMonthCard';
import ReportEmpty from '@/widgets/report/ReportEmpty';
import ReportInsights from '@/widgets/report/ReportInsights';
import Footer from '@/shared/ui/Footer';
import PageHeader from '@/shared/ui/PageHeader';
import FullScreenLoader from '@/shared/ui/FullScreenLoader';
import { reportMockData } from '@/shared/constants/reportMockData';

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
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { income, expense, insights, categorySummary, categories, emotionSummary, emotions, situationSummary, situations } = reportMockData;
  const hasData = income > 0 || expense > 0;
  const userName = '태희';

  return (
    <>
      <FullScreenLoader isLoading={!isMounted} />
      <div className={`flex flex-1 flex-col bg-white ${!isMounted ? 'pointer-events-none' : ''}`}>
        <PageHeader title="리포트" showBack={false} />

        <div className="flex flex-col gap-6.25 px-4 pt-5 pb-30">
          <ReportMonthCard
            year={year}
            month={month}
            income={income}
            expense={expense}
            onYearMonthChange={(ym) => {
              setYear(ym.year);
              setMonth(ym.month);
            }}
            onExpenseDetailClick={() =>
              router.push(hasData ? '/report/monthly' : '/record?type=expense')
            }
          />

          {hasData ? (
            <>
              <ReportInsights userName={userName} insights={insights} />
              <CategoryChart summary={categorySummary} categories={categories} />
              <EmotionList summary={emotionSummary} emotions={emotions} />
              <SituationTags summary={situationSummary} situations={situations} />
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
