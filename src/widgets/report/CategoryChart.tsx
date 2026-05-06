'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { CategoryItem } from '@/shared/constants/reportMockData';

type CategoryChartCategory = CategoryItem & { id?: number };

interface CategoryChartProps {
  categories: CategoryChartCategory[];
  year?: number;
  month?: number;
}

function DonutChart({ categories }: { categories: CategoryChartCategory[] }) {
  const radius = 70;
  const strokeWidth = 30;
  const topStrokeWidth = 38;
  const circumference = 2 * Math.PI * radius;
  const totalPercent =
    categories.reduce((sum, c) => sum + c.percentage, 0) || 1;

  const sortedCategories = [...categories].sort(
    (a, b) => b.percentage - a.percentage,
  );

  let cumulative = 0;
  const segments = sortedCategories.map((cat) => {
    const startDeg = cumulative;
    const segDeg = (cat.percentage / totalPercent) * 360;
    cumulative += segDeg;
    return { ...cat, startDeg, segDeg, dashStartDeg: startDeg, dashDeg: segDeg };
  });

  // 1위 segment의 1/3 지점에 떠있는 라벨 배치
  const topSegment = segments[0];
  const topMidDeg = topSegment
    ? topSegment.startDeg + topSegment.segDeg / 3
    : 0;
  const topMidRad = (topMidDeg * Math.PI) / 180;
  const containerPx = 198;
  const center = containerPx / 2;
  const labelOrbit = 105;
  // 1위 segment가 12시→왼쪽으로 진행하므로 sin 부호 반전
  const labelX = center - Math.sin(topMidRad) * labelOrbit;
  const labelY = center - Math.cos(topMidRad) * labelOrbit;

  return (
    <div className="relative mx-auto h-49.5 w-49.5">
      <svg
        width="198"
        height="198"
        viewBox="-4 -4 178 178"
        style={{ transform: 'scaleX(-1) rotate(-90deg)' }}
      >
        <defs>
          <linearGradient
            id="rank1-gradient"
            x1="78.2%"
            y1="91.2%"
            x2="21.8%"
            y2="8.8%"
          >
            <stop offset="39.57%" stopColor="#13278A" />
            <stop offset="84.9%" stopColor="#566BD1" />
          </linearGradient>
        </defs>
        {/* 작은 것부터 그려서 큰 segment(1위)가 위에 오도록 */}
        {[...segments].reverse().map((seg) => {
          const dash = (seg.dashDeg / 360) * circumference;
          const offset = -(seg.dashStartDeg / 360) * circumference;
          const isTop = topSegment && seg.name === topSegment.name;
          return (
            <circle
              key={seg.name}
              cx="85"
              cy="85"
              r={radius}
              fill="transparent"
              stroke={isTop ? 'url(#rank1-gradient)' : seg.color}
              strokeWidth={isTop ? topStrokeWidth : strokeWidth}
              strokeLinecap="round"
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={offset}
            />
          );
        })}
      </svg>

      {topSegment && (
        <div
          className="absolute flex size-15.5 flex-col items-center justify-center rounded-full bg-white"
          style={{
            left: labelX,
            top: labelY,
            transform: 'translate(-50%, -50%)',
            boxShadow: '3.32px 3.32px 6.64px 1.1px rgba(55, 55, 55, 0.2)',
          }}
        >
          <span className="text-[12px] font-medium leading-normal tracking-[-0.3px] text-[#474C52]">
            {topSegment.name}
          </span>
          <span className="text-[14px] font-semibold leading-normal tracking-[-0.35px] text-[#13278A]">
            {Math.round(topSegment.percentage)}%
          </span>
        </div>
      )}
    </div>
  );
}

export default function CategoryChart({ categories, year, month }: CategoryChartProps) {
  const [expanded, setExpanded] = useState(false);

  if (categories.length === 0) return null;

  const visibleCategories = expanded ? categories.slice(0, 5) : categories.slice(0, 3);

  return (
    <div className="flex flex-col gap-5 rounded-[12px] bg-[#F7F8FA] py-5 px-4">
      <h2 className="text-[20px] font-semibold leading-normal tracking-[-0.5px] text-[#030303]">
        카테고리별 지출 항목
      </h2>


      <DonutChart categories={categories} />


      <div className="flex flex-col gap-3.75">
        {visibleCategories.map((cat) => (
          <Link
            key={cat.name}
            href={
              cat.id != null && year != null && month != null
                ? `/report/category/${cat.id}?year=${year}&month=${month}`
                : `/report/category/${encodeURIComponent(cat.name)}`
            }
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2.5">
              <span
                className="block size-2 rounded-full"
                style={{
                  backgroundColor: cat.color,
                  border: cat.color === '#FFFFFF' ? '0.5px solid #CACDD2' : undefined,
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
