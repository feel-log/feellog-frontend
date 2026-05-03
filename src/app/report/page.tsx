'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useToken } from '@/shared/store';
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

export default function ReportPage() {
  const router = useRouter();
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);

  const { getAccessToken } = useToken();
  const token = getAccessToken();

  const { data, isLoading } = useQuery({
    ...reportQueries.monthly(token || '', year, month),
    enabled: !!token,
  });

  const userName = '태희';

  const income = data?.summary.totalIncome ?? 0;
  const expense = data?.summary.totalExpense ?? 0;
  const hasData = !!data && (income > 0 || expense > 0);

  const categories = (data?.categories.list ?? []).map((c, idx) => ({
    id: c.categoryId,
    name: c.categoryName,
    amount: c.totalAmount,
    percentage: Math.round(c.shareRate * 100),
    color: CATEGORY_COLORS[idx % CATEGORY_COLORS.length],
  }));

  const emotions = (data?.emotions.list ?? []).map((e) => ({
    rank: e.rank,
    emoji: '',
    name: e.emotionName,
    amount: e.linkedAmount,
  }));

  const situations = (data?.situations.list ?? []).map((s) => ({
    rank: s.rank,
    name: s.situationName,
  }));

  const categorySummary = data?.comments.categoryChange.message ?? '';
  const emotionSummary = data?.comments.emotionTrend.message ?? '';
  const situationSummary = data?.comments.situationTrend.message ?? '';

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

        {isLoading ? (
          <div className="flex flex-1 items-center justify-center py-20">
            <p className="text-[14px] text-[#9FA4A8]">불러오는 중...</p>
          </div>
        ) : hasData ? (
          <>
            <ReportInsights userName={userName} insights={[]} />
            <CategoryChart
              summary={categorySummary}
              categories={categories}
              year={year}
              month={month}
            />
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
