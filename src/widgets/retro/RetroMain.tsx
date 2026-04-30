'use client';

import { useRouter } from 'next/navigation';
import useEmblaCarousel from 'embla-carousel-react';
import EmotionIcon from '@/shared/ui/EmotionIcon';

interface ExpenseCategory {
  name: string;
  amount: number;
  ratio: number;
}

interface Emotion {
  name: string;
}

interface RetroMainProps {
  totalExpense: number;
  topCategory: string;
  topCategoryRatio: number;
  categories: ExpenseCategory[];
  emotions: Emotion[];
}

export default function RetroMain({
  topCategory,
  topCategoryRatio,
  categories,
  emotions,
}: RetroMainProps) {
  const router = useRouter();
  const maxAmount = Math.max(...categories.map((c) => c.amount));
  const [emblaRef] = useEmblaCarousel({ align: 'start', dragFree: true });

  const handleDetailClick = () => {
    const today = new Date();
    const dateString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    router.push(`/export?date=${dateString}`);
  };

  return (
    <div className="flex w-full flex-col gap-5">

      <div className="relative flex h-90 w-full flex-col items-center rounded-[12px] bg-[#F7F8FA] px-5">
        <div className="mt-7.5 flex flex-col items-center gap-0.5">
          <p className="text-[18px] font-bold text-[#1C1D1F]">
            오늘은 {topCategory}에 가장 많이 지출했어요
          </p>
          <p className="text-[14px] font-medium text-[#474C52]">
            {topCategory} 지출이 전체의 {topCategoryRatio}%를 차지해요
          </p>
        </div>

        {/* 막대 차트 */}
        <div className="mt-6 flex items-end gap-6.5">
          {categories.slice(0, 2).map((cat) => (
            <div key={cat.name} className="flex flex-col items-center gap-0.5">
              <p className="text-[14px] font-semibold text-[#1C1D1F]">
                {cat.name}
              </p>
              <div
                className={`w-10 rounded-t-sm ${
                  cat.name === topCategory ? 'bg-[#6B9CE5]' : 'bg-[#CACDD2]'
                }`}
                style={{
                  height: `${Math.max((cat.amount / maxAmount) * 140, 40)}px`,
                }}
              />
            </div>
          ))}
        </div>

        <button
          onClick={handleDetailClick}
          className="absolute right-4 bottom-4 left-4 rounded-lg bg-[#DEE8F7] px-14 py-2.5"
        >
          <p className="text-center text-[16px] font-semibold text-[#13278A]">
            지출 상세 내역
          </p>
        </button>
      </div>

      <div className="-mx-4 overflow-hidden" ref={emblaRef}>
        <div className="flex gap-1.5">
          {emotions.map((emotion) => (
            <div
              key={emotion.name}
              className="flex h-21.25 w-37 shrink-0 flex-col items-center justify-center rounded-[12px] bg-[#F7F8FA] px-4 py-3.5"
            >
              <p className="text-[14px] font-medium leading-normal tracking-[-0.35px] text-[#73787E]">
                오늘의 소비 감정
              </p>
              <div className="mt-1.5 flex items-center gap-1.5">
                <EmotionIcon name={emotion.name} size={25} />
                <p className="text-[20px] font-semibold leading-normal tracking-[-0.5px] text-[#1C1D1F]">
                  {emotion.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
