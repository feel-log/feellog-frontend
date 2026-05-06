import { Suspense } from 'react';
import ReportContent from '@/widgets/report/ReportContent';

export default function ReportPage() {
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
import { AuthGuard } from '@/shared/ui/guard/AuthGuard';
import { useMasterData } from '@/entities/master-data';

const CHART_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
  '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B195', '#C7CEEA',
];

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
  const { emotions } = useMasterData();
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
    { type: 'categoryChange' as const, message: reportData.comments.categoryChange.message, targetName: reportData.comments.categoryChange.targetName },
    { type: 'emotionTrend' as const, message: reportData.comments.emotionTrend.message, targetName: reportData.comments.emotionTrend.targetName },
    { type: 'situationTrend' as const, message: reportData.comments.situationTrend.message, targetName: reportData.comments.situationTrend.targetName },
  ] : [];

  const categoriesForChart = reportData?.categories.list.map((cat, idx) => ({
    ...cat,
    id: cat.categoryId,
    name: cat.categoryName,
    amount: cat.totalAmount,
    percentage: Math.round(cat.shareRateDisplay),
    color: CHART_COLORS[idx % CHART_COLORS.length],
  })) ?? [];

  const emotionsForList = reportData?.emotions.list.map((emotion) => {
    const emotionData = emotions
      .flatMap((g) => g.items)
      .find((e) => e.id === emotion.emotionId);
    return {
      ...emotion,
      id: emotion.emotionId,
      name: emotion.emotionName,
      amount: emotion.linkedAmount,
      emoji: emotionData?.emoji ?? '',
    };
  }) ?? [];

  const isLoadingData = !isMounted || !isLoaded || isLoading;

  return (
    <Suspense fallback={<div>로딩중...</div>}>
      <ReportContent />
    </Suspense>
  );
}
