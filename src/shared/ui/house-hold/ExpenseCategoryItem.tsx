'use client';

import EmotionTag from './EmotionTag';

interface Emotion {
  id: number;
  label: string;
  emoji?: string;
}

interface ExpenseCategoryItemProps {
  name: string;
  amount: number;
  emotions: Emotion[];
}

export default function ExpenseCategoryItem({
  name,
  amount,
  emotions,
}: ExpenseCategoryItemProps) {
  return (
    <div>
      <div className="mb-1.25 flex items-center justify-between">
        <span className="text-[16px] font-medium tracking-[-0.025em] text-[#27282c]">
          {name}
        </span>
        <span className="text-[18px] font-semibold tracking-[-0.025em] text-[#030303]">
          {amount.toLocaleString()}원
        </span>
      </div>
      <div className="flex flex-wrap gap-1.25">
        {emotions.map((emotion) => (
          <EmotionTag
            key={emotion.id}
            emoji={emotion.emoji}
            label={emotion.label}
          />
        ))}
      </div>
    </div>
  );
}
