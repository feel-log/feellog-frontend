import type { ReportSituationItem } from '@/entities/report/model/report-schema';

interface SituationTagsProps {
  situations: ReportSituationItem[];
}

interface SlotConfig {
  size: number;
  left: number;
  top: number;
  bgStyle: React.CSSProperties;
  rankSize: number;
  rankColor: string;
  labelSize: number;
  labelColor: string;
}

const BUBBLE_CONFIGS: Record<number, SlotConfig> = {
  1: {
    size: 144,
    left: 85,
    top: 0,
    bgStyle: {
      background:
        'linear-gradient(160deg, #13278A -0.36%, #192D91 48.82%, #827E72 109.24%)',
    },
    rankSize: 18,
    rankColor: '#E5E5E5',
    labelSize: 20,
    labelColor: '#FFFFFF',
  },
  2: {
    size: 118,
    left: 178,
    top: 134,
    bgStyle: { background: '#64A2FF' },
    rankSize: 16,
    rankColor: '#474C52',
    labelSize: 18,
    labelColor: '#27282C',
  },
  3: {
    size: 118,
    left: 44,
    top: 148,
    bgStyle: { background: '#FFDB72' },
    rankSize: 15.5,
    rankColor: '#73787E',
    labelSize: 18,
    labelColor: '#474C52',
  },
  4: {
    size: 82,
    left: 237,
    top: 51,
    bgStyle: { background: '#E5E5E5' },
    rankSize: 12,
    rankColor: '#73787E',
    labelSize: 14,
    labelColor: '#474C52',
  },
  5: {
    size: 82,
    left: 0,
    top: 72,
    bgStyle: { background: '#E5E5E5' },
    rankSize: 12,
    rankColor: '#73787E',
    labelSize: 14,
    labelColor: '#474C52',
  },
};

interface RenderInfo {
  size: number;
  left: number;
  top: number;
  bgStyle: React.CSSProperties;
  rankSize: number;
  rankColor: string;
  labelSize: number;
  labelColor: string;
  displayRank: number;
}

const MIN_BUBBLE_SIZE = 60;
const MAX_BUBBLE_SIZE = 144;

function buildRenderInfos(items: ReportSituationItem[]): (RenderInfo | null)[] {
  const groupsByRank = new Map<number, number[]>();
  items.forEach((item, idx) => {
    const list = groupsByRank.get(item.rank) ?? [];
    list.push(idx);
    groupsByRank.set(item.rank, list);
  });

  const maxCount = Math.max(...items.map((i) => i.occurrenceCount), 1);

  return items.map((item, idx) => {
    const slot = idx + 1;
    const slotConfig = BUBBLE_CONFIGS[slot];
    if (!slotConfig) return null;

    const groupIndices = groupsByRank.get(item.rank) ?? [idx];

    // 1) 비율 기반 size (선택 건수 비율)
    const ratioSize =
      MIN_BUBBLE_SIZE +
      (item.occurrenceCount / maxCount) * (MAX_BUBBLE_SIZE - MIN_BUBBLE_SIZE);

    // 2) 그룹 내 슬롯 size 최소값 (안 겹치도록 제한)
    const groupSlotMin = Math.min(
      ...groupIndices.map((i) => BUBBLE_CONFIGS[i + 1]?.size ?? 82),
    );

    const size = Math.min(ratioSize, groupSlotMin);

    // 위치는 본인 슬롯 중심 기준 + size 변경분만큼 보정
    const centerX = slotConfig.left + slotConfig.size / 2;
    const centerY = slotConfig.top + slotConfig.size / 2;
    const left = centerX - size / 2;
    const top = centerY - size / 2;

    return {
      size,
      left,
      top,
      bgStyle: slotConfig.bgStyle,
      rankSize: slotConfig.rankSize,
      rankColor: slotConfig.rankColor,
      labelSize: slotConfig.labelSize,
      labelColor: slotConfig.labelColor,
      displayRank: item.rank,
    };
  });
}

export default function SituationTags({ situations }: SituationTagsProps) {
  if (situations.length === 0) {
    return (
      <div className="flex flex-col rounded-[12px] border border-[#F0F0F0] bg-[#F7F8FA] pt-5 pb-24.75 px-4">
        <h2 className="text-[20px] font-semibold leading-normal tracking-[-0.5px] text-[#1C1D1F]">
          자주 선택한 상황 태그
        </h2>
        <div className="mt-21.5 flex flex-col items-center">
          <p className="text-[16px] font-semibold leading-normal tracking-[-0.4px] text-[#73787E]">
            이번달 상황별 소비가 아직 없어요
          </p>
          <p className="text-[14px] font-medium leading-normal tracking-[-0.35px] text-[#9FA4A8]">
            소비를 기록하면 오늘을 돌아볼 수 있어요
          </p>
        </div>
      </div>
    );
  }

  const items = situations.slice(0, 5);
  const renderInfos = buildRenderInfos(items);

  return (
    <div className="flex flex-col gap-2.5 rounded-[12px] border border-[#F0F0F0] bg-[#F7F8FA] py-5">
      <h2 className="px-4 text-[20px] font-semibold leading-normal tracking-[-0.5px] text-[#1C1D1F]">
        자주 선택한 상황 태그
      </h2>

      <div className="relative mx-auto h-66.5 w-80">
        {items.map((situation, index) => {
          const info = renderInfos[index];
          if (!info) return null;
          return (
            <div
              key={situation.situationTagId}
              className="absolute flex flex-col items-center justify-center rounded-full"
              style={{
                width: info.size,
                height: info.size,
                left: info.left,
                top: info.top,
                ...info.bgStyle,
              }}
            >
              <span
                className="font-medium tracking-[-0.025em]"
                style={{ fontSize: info.rankSize, color: info.rankColor }}
              >
                {info.displayRank}위
              </span>
              <span
                className="font-semibold tracking-[-0.025em]"
                style={{ fontSize: info.labelSize, color: info.labelColor }}
              >
                {situation.situationName}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
