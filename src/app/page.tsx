'use client';

import React, { useState } from 'react';
import { Header, BottomNavigation } from '@/shared/ui';
import {
  EmotionBanner,
  SpendingSection,
  InsightSection,
} from '@/widgets';

export default function Home() {
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);

  const mockSpendingItems = [
    {
      id: '1',
      category: '식비',
      amount: 35000,
      emotion: '행복',
      date: '2024-01-15',
    },
    {
      id: '2',
      category: '쇼핑',
      amount: 89000,
      emotion: '슬픔',
      date: '2024-01-14',
    },
    {
      id: '3',
      category: '여행',
      amount: 150000,
      emotion: '행복',
      date: '2024-01-13',
    },
  ];

  const mockInsights = [
    {
      id: '1',
      title: '행복할 때 더 소비해요',
      description: '행복한 상태에서의 소비가 평소보다 30% 높습니다',
      icon: '📈',
      color: 'border-yellow-400 bg-yellow-50',
    },
    {
      id: '2',
      title: '슬플 땐 음식을 찾으세요',
      description: '슬픔을 느낄 때 식비 소비가 증가하는 패턴이 보입니다',
      icon: '🍽️',
      color: 'border-blue-400 bg-blue-50',
    },
    {
      id: '3',
      title: '이번 달 트렌드',
      description: '여행 지출이 지난달 대비 2배 증가했습니다',
      icon: '✈️',
      color: 'border-purple-400 bg-purple-50',
    },
  ];

  const navItems = [
    { label: '홈', href: '/', icon: '🏠' },
    { label: '기록', href: '/emotions', icon: '😊' },
    { label: '분석', href: '/analysis', icon: '📊' },
    { label: '설정', href: '/settings', icon: '⚙️' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header title="Feel-Log" />

      <main className="flex-1 overflow-y-auto pb-20">
        <EmotionBanner onEmotionSelect={setSelectedEmotion} />

        {selectedEmotion && (
          <div className="p-4 bg-blue-50 border-b border-blue-200">
            <p className="text-sm text-blue-900">
              선택된 감정: <span className="font-bold">{selectedEmotion}</span>
            </p>
          </div>
        )}

        <SpendingSection items={mockSpendingItems} />

        <InsightSection insights={mockInsights} />

        <div className="p-4">
          <div className="text-center text-gray-500 text-sm">
            <p>더 자세한 분석을 위해 분석 페이지를 방문하세요</p>
          </div>
        </div>
      </main>

      <BottomNavigation items={navItems} />
    </div>
  );
}
