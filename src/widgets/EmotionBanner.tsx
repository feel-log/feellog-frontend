'use client';

import React from 'react';
import { Button } from '@/shared/ui';

const emotions = [
  { emoji: '😊', label: '행복', color: 'bg-yellow-100' },
  { emoji: '😔', label: '슬픔', color: 'bg-blue-100' },
  { emoji: '😠', label: '분노', color: 'bg-red-100' },
  { emoji: '😰', label: '불안', color: 'bg-purple-100' },
  { emoji: '😌', label: '평온', color: 'bg-green-100' },
];

interface EmotionBannerProps {
  onEmotionSelect: (emotion: string) => void;
}

export const EmotionBanner: React.FC<EmotionBannerProps> = ({
  onEmotionSelect,
}) => {
  return (
    <div className="bg-gradient-to-r from-blue-400 to-blue-500 text-white p-6 rounded-b-2xl">
      <h2 className="text-2xl font-bold mb-4">오늘의 감정은?</h2>
      <div className="grid grid-cols-5 gap-2 mb-6">
        {emotions.map((emotion) => (
          <button
            key={emotion.label}
            onClick={() => onEmotionSelect(emotion.label)}
            className={`flex flex-col items-center justify-center py-3 rounded-lg transition-transform hover:scale-110 active:scale-95 ${emotion.color}`}
          >
            <span className="text-2xl mb-1">{emotion.emoji}</span>
            <span className="text-xs font-medium text-gray-800">
              {emotion.label}
            </span>
          </button>
        ))}
      </div>
      <Button
        fullWidth
        variant="secondary"
        onClick={() => console.log('감정 기록하기')}
      >
        지금 기록하기
      </Button>
    </div>
  );
};
