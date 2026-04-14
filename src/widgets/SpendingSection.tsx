'use client';

import React from 'react';
import { Card } from '@/shared/ui';

interface SpendingItem {
  id: string;
  category: string;
  amount: number;
  emotion: string;
  date: string;
}

interface SpendingSectionProps {
  items: SpendingItem[];
}

const categoryIcons: Record<string, string> = {
  식비: '🍔',
  쇼핑: '🛍️',
  여행: '✈️',
  여가: '🎬',
  교통: '🚗',
  기타: '💰',
};

export const SpendingSection: React.FC<SpendingSectionProps> = ({ items }) => {
  const totalSpending = items.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">이번 달 소비 현황</h3>
        <a href="/spending" className="text-blue-500 text-sm font-medium">
          더보기 →
        </a>
      </div>

      <Card variant="elevated" className="p-4">
        <div className="text-center mb-4">
          <p className="text-gray-600 text-sm mb-1">이번 달 총 소비액</p>
          <p className="text-3xl font-bold text-blue-600">
            ₩{totalSpending.toLocaleString()}
          </p>
        </div>
      </Card>

      <div className="space-y-2">
        {items.slice(0, 3).map((item) => (
          <Card key={item.id} className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">
                  {categoryIcons[item.category] || '💰'}
                </span>
                <div>
                  <p className="font-medium text-sm">{item.category}</p>
                  <p className="text-xs text-gray-500">{item.emotion}</p>
                </div>
              </div>
              <p className="font-bold text-gray-900">
                ₩{item.amount.toLocaleString()}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
