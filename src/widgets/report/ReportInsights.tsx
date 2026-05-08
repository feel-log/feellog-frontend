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
      <p className="min-w-0 flex-1 whitespace-pre-line text-[16px] font-medium leading-normal tracking-[-0.4px] text-[#474C52]">
        {renderMessageWithTarget(
          insight.message.replace(/\s비슷한/, '\n비슷한'),
          insight.targetName ?? undefined
        )}
      </p>
      {hasTarget && (
        <div className="size-8 shrink-0">
          {insight.type === 'categoryChange' && (
            <Image
              src={insight.direction === 'down' ? '/svg/icon_down.svg' : '/svg/icon_up.svg'}
              alt={insight.direction === 'down' ? 'down' : 'up'}
              width={32}
              height={32}
              unoptimized
            />
          )}
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
