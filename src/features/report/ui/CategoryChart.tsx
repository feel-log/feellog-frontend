'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { CategoryItem } from '@/features/report/mock/reportMockData';

interface CategoryChartProps {
  summary: string;
  categories: CategoryItem[];
}

function DonutChart({ categories }: { categories: CategoryItem[] }) {
  const radius = 70;
  const strokeWidth = 30;
  const circumference = 2 * Math.PI * radius;
  const totalPercent = categories.reduce((sum, c) => sum + c.percentage, 0);
  const sortedCategories = [...categories].sort((a, b) => b.percentage - a.percentage);

  let accumulatedDeg = 0;

  return (
    <div className="relative mx-auto h-42.5 w-42.5">
      <svg
        width="170"
        height="170"
        viewBox="0 0 170 170"
        style={{ transform: 'rotate(90deg) scaleX(-1)' }}
      >
        {sortedCategories.map((cat) => {
          const segDeg = (cat.percentage / totalPercent) * 360;
          const dash = (segDeg / 360) * circumference;
          const offset = -(accumulatedDeg / 360) * circumference;
          accumulatedDeg += segDeg;

          return (
            <circle
              key={cat.name}
              cx="85"
              cy="85"
              r={radius}
              fill="transparent"
              stroke={cat.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={offset}
            />
          );
        })}
      </svg>
    </div>
  );
}

export default function CategoryChart({ summary, categories }: CategoryChartProps) {
  const [expanded, setExpanded] = useState(false);

  if (categories.length === 0) return null;

  const topCategory = [...categories].sort((a, b) => b.percentage - a.percentage)[0];
  const visibleCategories = expanded ? categories.slice(0, 5) : categories.slice(0, 3);

  return (
    <div className="flex flex-col gap-5 rounded-[12px] bg-[#F7F8FA] py-5 px-4">
      <div className="flex flex-col gap-0.5">
        <h2 className="text-[20px] font-semibold leading-normal tracking-[-0.5px] text-[#030303]">
          카테고리별 지출 항목
        </h2>
        <p className="text-[16px] font-medium leading-normal tracking-[-0.4px] text-[#73787E]">
          {(() => {
            const parts = summary.split(topCategory.name);
            return parts.map((part, i) => (
              <span key={i}>
                {part}
                {i < parts.length - 1 && (
                  <span className="font-semibold text-[#474C52]">
                    {topCategory.name}
                  </span>
                )}
              </span>
            ));
          })()}
        </p>
      </div>


      <DonutChart categories={categories} />


      <div className="flex flex-col gap-3.75">
        {visibleCategories.map((cat) => (
          <Link
            key={cat.name}
            href={`/report/category/${encodeURIComponent(cat.name)}`}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2.5">
              <span
                className="block size-2 rounded-full"
                style={{
                  backgroundColor: cat.color,
                  border: cat.color === '#F7F8FA' ? '0.5px solid #CACDD2' : undefined,
                }}
              />
              <div className="flex items-center gap-2">
                <span className="text-[18px] font-medium tracking-[-0.45px] text-[#1C1D1F]">
                  {cat.name}
                </span>
                <span className="text-[18px] font-normal tracking-[-0.45px] text-[#73787E]">
                  {cat.percentage}%
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.25">
              <span className="text-[18px] font-semibold tracking-[-0.45px] text-[#030303]">
                {cat.amount.toLocaleString()}원
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

      {categories.length > 3 && (
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
