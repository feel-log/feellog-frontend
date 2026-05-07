'use client';

import Image from 'next/image';

interface EmotionTagProps {
  emoji?: string;
  label: string;
}

export default function EmotionTag({ emoji, label }: EmotionTagProps) {
  return (
    <span className="inline-flex items-center gap-1.25 rounded-full bg-[#f0f4f5] px-2.5 py-0.75 text-[12px] font-medium tracking-[-0.025em] text-[#474c52]">
      {emoji && (
        <Image
          src={emoji}
          alt={label}
          width={14}
          height={14}
          loading="lazy"
        />
      )}
      <span>{label}</span>
    </span>
  );
}
