'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getEmotionDetail } from '@/features/report/mock/emotionDetailMockData';

interface PageProps {
  params: Promise<{ emotionId: string }>;
}

export default function EmotionDetailPage({ params }: PageProps) {
  const router = useRouter();
  const { emotionId } = use(params);
  const decodedId = decodeURIComponent(emotionId);
  const detail = getEmotionDetail(decodedId);

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;

  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(detail?.month ?? currentMonth);

  const isNextDisabled = year > currentYear || (year === currentYear && month >= currentMonth);
  const monthLabel = year === currentYear ? `${month}월` : `${year}년 ${month}월`;

  const handlePrev = () => {
    if (month === 1) {
      setYear((y) => y - 1);
      setMonth(12);
    } else {
      setMonth((m) => m - 1);
    }
  };

  const handleNext = () => {
    if (isNextDisabled) return;
    if (month === 12) {
      setYear((y) => y + 1);
      setMonth(1);
    } else {
      setMonth((m) => m + 1);
    }
  };

  if (!detail) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center bg-white px-6">
        <p className="text-[16px] text-[#73787E]">감정을 찾을 수 없어요.</p>
        <button
          onClick={() => router.back()}
          className="mt-4 rounded-lg border border-[#E5E5E5] px-4 py-2 text-[14px]"
        >
          돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col bg-white">
      {/* 헤더 */}
      <header className="flex flex-col gap-4.5 border-b-[5px] border-[#F7F8FA] px-4 pt-3 pb-5">
        <button onClick={() => router.back()} aria-label="뒤로가기">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path
              d="M18 6L10 14L18 22"
              stroke="#27282C"
              strokeWidth="1.87"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div className="flex items-center gap-2.5">
          <button onClick={handlePrev} aria-label="이전 달">
            <img
              src="/icons/icon_arrow_left_fill.svg"
              alt=""
              width={26}
              height={26}
            />
          </button>
          <span
            className={`text-center text-[22px] font-bold leading-normal tracking-[-0.55px] text-[#27282C] ${
              year === currentYear ? 'w-13.5' : ''
            }`}
          >
            {monthLabel}
          </span>
          <button onClick={handleNext} disabled={isNextDisabled} aria-label="다음 달">
            <img
              src="/icons/icon_arrow_right_fill.svg"
              alt=""
              width={26}
              height={26}
              className={isNextDisabled ? 'opacity-30' : 'opacity-100'}
            />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex size-12 items-center justify-center text-[40px] leading-none">
            {detail.emoji}
          </span>
          <div className="flex flex-col gap-0.5">
            <span className="text-[18px] font-medium tracking-[-0.45px] text-[#474C52]">
              {detail.name}
            </span>
            <span className="text-[28px] font-semibold tracking-[-0.7px] text-[#030303]">
              {detail.totalAmount.toLocaleString()}원
            </span>
          </div>
        </div>
      </header>

      <div className="flex flex-col pb-30">
        {detail.groups.map((group, groupIdx) => (
          <section
            key={groupIdx}
            className="flex flex-col gap-7.5 border-b border-[#E5E5E5] py-7.5"
          >
            {group.items.map((item) => (
              <article key={item.id} className="flex flex-col gap-0.75 px-4">
                <span className="text-[14px] font-medium tracking-[-0.35px] text-[#73787E]">
                  {group.date}
                </span>
                <div className="flex items-center justify-between">
                  <span className="text-[18px] font-semibold tracking-[-0.45px] text-[#27282C]">
                    {item.category}
                  </span>
                  <span className="text-[20px] font-semibold tracking-[-0.5px] text-[#030303]">
                    {item.amount.toLocaleString()}원
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {item.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="text-[16px] font-medium tracking-[-0.4px] text-[#13278A]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <span className="text-[16px] font-medium tracking-[-0.4px] text-[#9FA4A8]">
                    {item.payment}
                  </span>
                </div>
                {item.memo && (
                  <span className="text-[16px] font-medium tracking-[-0.4px] text-[#9FA4A8]">
                    {item.memo}
                  </span>
                )}
              </article>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}
