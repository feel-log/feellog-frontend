'use client';

import { useState } from 'react';
import Link from 'next/link';
import EmotionIcon from '@/shared/ui/EmotionIcon';
import type { EmotionItem } from '@/shared/constants/reportMockData';

type EmotionListItem = EmotionItem & { id?: number };

interface EmotionListProps {
  emotions: EmotionListItem[];
  year?: number;
  month?: number;
}

export default function EmotionList({ emotions, year, month }: EmotionListProps) {
  const [expanded, setExpanded] = useState(false);
  const visibleEmotions = expanded ? emotions.slice(0, 5) : emotions.slice(0, 3);

  if (emotions.length === 0) {
    return (
      <div className="flex flex-col rounded-[12px] border border-[#F0F0F0] bg-[#F7F8FA] pt-5 pb-19.75 px-4">
        <h2 className="text-[20px] font-semibold leading-normal tracking-[-0.5px] text-[#030303]">
          감정별 지출 항목
        </h2>
        <div className="mt-14.75 flex flex-col items-center">
          <p className="text-[16px] font-semibold leading-normal tracking-[-0.4px] text-[#73787E]">
            이번달 감정별 소비가 아직 없어요
          </p>
          <p className="text-[14px] font-medium leading-normal tracking-[-0.35px] text-[#9FA4A8]">
            소비를 기록하면 오늘을 돌아볼 수 있어요
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-7.5 rounded-[12px] bg-[#F7F8FA] py-5 px-4">
      <h2 className="text-[20px] font-semibold leading-normal tracking-[-0.5px] text-[#1C1D1F]">
        감정별 지출 항목
      </h2>

      <div className="flex flex-col gap-3.75">
        {visibleEmotions.map((item, index) => (
          <Link
            key={`${item.rank}-${item.name}-${index}`}
            href={
              item.id != null && year != null && month != null
                ? `/report/emotion/${item.id}?year=${year}&month=${month}`
                : `/report/emotion/${encodeURIComponent(item.name)}`
            }
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3.75">
              <span className="w-4.5 text-center text-[18px] font-medium tracking-[-0.45px] text-[#1C1D1F]">
                {item.rank}
              </span>
              <div className="flex items-center gap-2">
                <EmotionIcon name={item.name} size={24} />
                <span className="text-[18px] font-medium tracking-[-0.45px] text-[#1C1D1F]">
                  {item.name}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.25">
              <span className="text-[18px] font-semibold tracking-[-0.45px] text-[#030303]">
                {item.amount.toLocaleString()}원
              </span>
              <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                <path
                  d="M10 7L16 13L10 19"
                  stroke="#9FA4A8"
                  strokeWidth="1.73"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </Link>
        ))}
      </div>

      {emotions.length > 3 && (
        <button
          onClick={() => setExpanded((prev) => !prev)}
          className="flex justify-center"
          aria-expanded={expanded}
        >
          <svg
            width="30"
            height="30"
            viewBox="0 0 30 30"
            fill="none"
            className={`transition-transform ${expanded ? 'rotate-180' : ''}`}
          >
            <path
              d="M8 11L15 18L22 11"
              stroke="#9FA4A8"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
