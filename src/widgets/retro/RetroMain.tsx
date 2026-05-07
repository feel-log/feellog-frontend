'use client';

import { useRouter } from 'next/navigation';
import useEmblaCarousel from 'embla-carousel-react';
import EmotionIcon from '@/shared/ui/EmotionIcon';
import type { DailyEmotionItem, DailyReport } from '@/entities/report';

type ExpenseGraph = DailyReport['expenseGraph'];

interface RetroMainProps {
  expenseGraph: ExpenseGraph;
  emotions: DailyEmotionItem[];
  isEmotionsEmpty: boolean;
}

export default function RetroMain({
  expenseGraph,
  emotions,
  isEmotionsEmpty,
}: RetroMainProps) {
  const router = useRouter();
  const [emblaRef] = useEmblaCarousel({ align: 'start', dragFree: true });

  const {
    mainMessage,
    subMessage,
    topCategories,
    secondCategories = [],
    topExtraCount = 0,
    secondExtraCount = 0,
  } = expenseGraph;

  const topAmount = topCategories[0]?.amount ?? 0;
  const secondAmount = secondCategories[0]?.amount ?? 0;

  const joinLabels = (items: { label: string }[]) =>
    items.map((c) => c.label).join(', ');

  const topLabel =
    topCategories.length > 0
      ? topExtraCount > 0
        ? `${joinLabels(topCategories)} 외 ${topExtraCount}개`
        : joinLabels(topCategories)
      : '';

  const secondLabel =
    secondCategories.length > 0
      ? secondExtraCount > 0
        ? `${joinLabels(secondCategories)} 외 ${secondExtraCount}개`
        : joinLabels(secondCategories)
      : '';

  const barItems = [
    ...(topCategories.length > 0
      ? [{ label: topLabel, amount: topAmount, isTop: true }]
      : []),
    ...(secondCategories.length > 0
      ? [{ label: secondLabel, amount: secondAmount, isTop: secondCategories.length > 1 }]
      : []),
  ].slice(0, 2);

  const maxAmount = Math.max(...barItems.map((b) => b.amount), 1);

  const handleDetailClick = () => {
    const today = new Date();
    const dateString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    router.push(`/export?date=${dateString}`);
  };

  return (
    <div className="flex w-full flex-col gap-5">
      <div className="relative flex h-90 w-full flex-col items-center rounded-[12px] bg-[#F7F8FA] px-5">
        <div className="mt-7.5 flex flex-col items-center gap-0.5">
          <p className="whitespace-nowrap text-[18px] font-semibold text-[#1C1D1F]">{mainMessage}</p>
          <p className="whitespace-nowrap text-[14px] font-medium text-[#474C52]">{subMessage}</p>
        </div>

        <div className="mt-6 flex items-end gap-6.5">
          {barItems.map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-0.5">
              <p className="text-[14px] font-semibold text-[#1C1D1F]">
                {item.label}
              </p>
              <div
                className={`w-10 rounded-t-sm ${item.isTop ? 'bg-[#6B9CE5]' : 'bg-[#CACDD2]'}`}
                style={{
                  height: `${Math.max((item.amount / maxAmount) * 140, 40)}px`,
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

      {!isEmotionsEmpty && emotions.length > 0 && (
        <div className="-mx-4 overflow-hidden" ref={emblaRef}>
          <div className="flex gap-1.5 px-4">
            {emotions.map((emotion) => (
              <div
                key={emotion.emotionId}
                className="flex h-21.25 w-37 shrink-0 flex-col items-center justify-center rounded-[12px] bg-[#F7F8FA] px-4 py-3.5"
              >
                <p className="text-[14px] font-medium leading-normal tracking-[-0.35px] text-[#73787E]">
                  오늘의 소비 감정
                </p>
                <div className="mt-1.5 flex items-center gap-1.5">
                  <EmotionIcon name={emotion.emotionName} size={25} />
                  <p className="text-[18px] font-semibold leading-normal tracking-[-0.45px] text-[#1C1D1F]">
                    {emotion.emotionName}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
