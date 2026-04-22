'use client';

import { useState } from 'react';
import ReportMonthCard from '@/features/report/ui/ReportMonthCard';
import ReportEmpty from '@/features/report/ui/ReportEmpty';
import ReportInsights from '@/features/report/ui/ReportInsights';
import CategoryChart from '@/features/report/ui/CategoryChart';
import EmotionList from '@/features/report/ui/EmotionList';
import SituationTags from '@/features/report/ui/SituationTags';
import { reportMockData } from '@/features/report/mock/reportMockData';

export default function ReportPage() {
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  const { income, expense, insights, categorySummary, categories, emotionSummary, emotions, situationSummary, situations } = reportMockData;
  const hasData = income > 0 || expense > 0;
  const userName = '태희';

  return (
    <div className="flex flex-1 flex-col bg-white">
      {/* 헤더 */}
      <header className="flex h-14 items-center justify-center px-4 py-3.25">
        <h1 className="text-[20px] font-semibold leading-normal tracking-[-0.5px] text-[#030303]">
          리포트
        </h1>
      </header>

      <div className="flex flex-col gap-6.25 px-4 pt-5 pb-30">
        <ReportMonthCard
          month={month}
          income={income}
          expense={expense}
          onMonthChange={setMonth}
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
    </div>
  );
}
