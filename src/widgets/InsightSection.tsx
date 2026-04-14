'use client';

import React from 'react';
import { Card } from '@/shared/ui';

interface Insight {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

interface InsightSectionProps {
  insights: Insight[];
}

export const InsightSection: React.FC<InsightSectionProps> = ({ insights }) => {
  return (
    <div className="p-4 space-y-4">
      <h3 className="text-lg font-bold">감정 분석 인사이트</h3>

      <div className="space-y-3">
        {insights.map((insight) => (
          <Card
            key={insight.id}
            className={`p-4 border-l-4 cursor-pointer hover:shadow-md transition-shadow ${insight.color}`}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{insight.icon}</span>
              <div className="flex-1">
                <p className="font-bold text-sm mb-1">{insight.title}</p>
                <p className="text-xs text-gray-600">{insight.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
