'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ReportMonthCard from '@/widgets/report/ReportMonthCard';
import ReportEmpty from '@/widgets/report/ReportEmpty';
import ReportInsights from '@/widgets/report/ReportInsights';
import CategoryChart from '@/widgets/report/CategoryChart';
import EmotionList from '@/widgets/report/EmotionList';
import SituationTags from '@/widgets/report/SituationTags';
import Footer from '@/shared/ui/Footer';
import PageHeader from '@/shared/ui/PageHeader';
import { reportMockData } from '@/shared/constants/reportMockData';

export default function ReportPage() {
  const router = useRouter();
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);

  const { income, expense, insights, categorySummary, categories, emotionSummary, emotions, situationSummary, situations } = reportMockData;
  const hasData = income > 0 || expense > 0;
  const userName = '태희';

  return (
    <div className="flex flex-1 flex-col bg-white">
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
      </div>

      <Footer />
    </div>
  );
}
