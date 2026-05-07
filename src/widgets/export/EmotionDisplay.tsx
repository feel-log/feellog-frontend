'use client';

import Image from 'next/image';

interface Emotion {
  emoji: string;
  label: string;
}

interface EmotionDisplayProps {
  emotions: Emotion[];
}

export default function EmotionDisplay({ emotions }: EmotionDisplayProps) {
  if (emotions.length === 0) return null;

  return (
    <div className="flex items-center gap-1.5">
      {emotions.map((emotion, idx) => (
        <span key={idx} className="flex items-center gap-1">
          {emotion.emoji && (
            <Image
              src={emotion.emoji}
              alt={emotion.label}
              width={18}
              height={18}
            />
          )}
          <span className="text-[14px] font-medium tracking-[-0.025em] text-[#474c52]">
            {emotion.label}
          </span>
          {idx < emotions.length - 1 && (
            <span className="text-[14px] text-[#9fa4a8]">,</span>
          )}
        </span>
      ))}
    </div>
  );
}
