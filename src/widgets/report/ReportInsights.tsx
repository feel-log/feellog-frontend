import type { ReactNode } from 'react';
import Image from 'next/image';
import EmotionIcon from '@/shared/ui/EmotionIcon';

export type InsightType = 'categoryChange' | 'emotionTrend' | 'situationTrend';

export interface InsightItem {
  type: InsightType;
  message: string;
  targetName?: string | null;
  direction?: 'up' | 'down' | null;
}

interface ReportInsightsProps {
  userName: string;
  insights: InsightItem[];
}

function CategoryUpIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M16.7079 2.20955C16.3172 1.81794 15.6828 1.81794 15.2921 2.20955L3.70237 13.826C3.07352 14.4563 3.51994 15.5323 4.41029 15.5323H9.4C9.95228 15.5323 10.4 15.98 10.4 16.5323V29.5C10.4 30.0523 10.8477 30.5 11.4 30.5H20.6C21.1523 30.5 21.6 30.0523 21.6 29.5V16.5323C21.6 15.98 22.0477 15.5323 22.6 15.5323H27.5897C28.4801 15.5323 28.9265 14.4563 28.2976 13.826L16.7079 2.20955Z"
        fill="url(#ric-up-fill)"
      />
      <defs>
        <linearGradient id="ric-up-fill" x1="16" y1="4.30662" x2="16" y2="30.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="#EB1C1C" />
          <stop offset="1" stopColor="#EB1C1C" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function CategoryDownIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M15.2921 29.7904C15.6828 30.1821 16.3172 30.1821 16.7079 29.7904L28.2976 18.174C28.9265 17.5437 28.4801 16.4677 27.5897 16.4677L22.6 16.4677C22.0477 16.4677 21.6 16.02 21.6 15.4677L21.6 2.5C21.6 1.94772 21.1523 1.5 20.6 1.5L11.4 1.5C10.8477 1.5 10.4 1.94771 10.4 2.5L10.4 15.4677C10.4 16.02 9.95229 16.4677 9.4 16.4677L4.41029 16.4677C3.51994 16.4677 3.07352 17.5437 3.70237 18.174L15.2921 29.7904Z"
        fill="url(#ric-down-fill)"
      />
      <defs>
        <linearGradient id="ric-down-fill" x1="16" y1="1.5" x2="16" y2="30.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="#13278A" stopOpacity="0" />
          <stop offset="1" stopColor="#13278A" />
        </linearGradient>
      </defs>
    </svg>
  );
}


function renderMessageWithTarget(message: string, target: string | null | undefined) {
  if (!target || !message.includes(target)) {
    return message;
  }
  const segments = message.split(target);
  return segments.flatMap((seg, i) => {
    if (i === segments.length - 1) return [seg];
    return [
      seg,
      <span
        key={i}
        className="text-[18px] font-bold tracking-[-0.45px] text-[#13278A]"
      >
        {target}
      </span>,
    ];
  });
}

function isFallbackMessage(message: string): boolean {
  return /기록하면|다음 달부터/.test(message);
}

function renderFallbackMessage(message: string): ReactNode {
  if (message.includes('감정을 기록하면')) {
    return (
      <>
        감정을 기록하면 이번 달 소비와
        <br />
        연결된 마음을 알려드릴게요
      </>
    );
  }
  if (message.includes('상황을 기록하면')) {
    return (
      <>
        상황을 기록하면 어떤 이유의 소비가
        <br />
        많았는지 보여드릴게요
      </>
    );
  }
  return message;
}

function InsightCard({ insight }: { insight: InsightItem }) {
  if (isFallbackMessage(insight.message)) {
    return (
      <div className="rounded-[8px] bg-white py-3.5 px-4">
        <p className="text-[16px] font-medium leading-normal tracking-[-0.4px] text-[#474C52]">
          {renderFallbackMessage(insight.message)}
        </p>
      </div>
    );
  }

  const hasTarget = !!insight.targetName;

  return (
    <div className="flex items-center justify-between gap-2.5 rounded-[8px] bg-white p-4">
      <p className="whitespace-nowrap text-[16px] font-medium leading-normal tracking-[-0.4px] text-[#474C52]">
        {renderMessageWithTarget(insight.message, insight.targetName ?? undefined)}
      </p>
      {hasTarget && (
        <div className="size-8 shrink-0">
          {insight.type === 'categoryChange' &&
            (insight.direction === 'down' ? <CategoryDownIcon /> : <CategoryUpIcon />)}
          {insight.type === 'emotionTrend' && (
            <EmotionIcon name={insight.targetName!} size={28} />
          )}
          {insight.type === 'situationTrend' && (
            <Image
              src="/svg/icon_shopping_bag.svg"
              alt="shopping bag"
              width={32}
              height={32}
              unoptimized
            />
          )}
        </div>
      )}
    </div>
  );
}

export default function ReportInsights({ userName, insights }: ReportInsightsProps) {
  if (insights.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-[20px] font-semibold leading-normal tracking-[-0.5px] text-[#030303]">
        이번 달 {userName}님은
      </h2>
      <div className="flex flex-col gap-2 rounded-[12px] border border-[#F0F0F0] bg-[#F7F8FA] py-3.5 px-4">
        {insights.map((insight, idx) => (
          <InsightCard key={`${insight.type}-${insight.targetName}-${idx}`} insight={insight} />
        ))}
      </div>
    </div>
  );
}
