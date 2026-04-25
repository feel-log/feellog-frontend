import type { SituationTag } from '@/features/report/mock/reportMockData';

interface SituationTagsProps {
  summary: string;
  situations: SituationTag[];
}

const BUBBLE_CONFIGS: Record<
  number,
  {
    size: number;
    left: number;
    top: number;
    bgStyle: React.CSSProperties;
    rankSize: number;
    rankColor: string;
    labelSize: number;
    labelColor: string;
  }
> = {
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

export default function SituationTags({ summary, situations }: SituationTagsProps) {
  return (
    <div className="flex flex-col gap-2.5 rounded-[12px] border border-[#F0F0F0] bg-[#F7F8FA] py-5">
      <div className="flex flex-col gap-0.5 px-4">
        <h2 className="text-[20px] font-semibold leading-normal tracking-[-0.5px] text-[#1C1D1F]">
          자주 선택한 상황 태그
        </h2>
        <p className="text-[16px] font-medium leading-normal tracking-[-0.4px] text-[#73787E]">
          {summary}
        </p>
      </div>

      <div className="relative mx-auto h-66.5 w-80">
        {situations.map((situation) => {
          const config = BUBBLE_CONFIGS[situation.rank];
          if (!config) return null;
          return (
            <div
              key={situation.name}
              className="absolute flex flex-col items-center justify-center rounded-full"
              style={{
                width: config.size,
                height: config.size,
                left: config.left,
                top: config.top,
                ...config.bgStyle,
              }}
            >
              <span
                className="font-medium tracking-[-0.025em]"
                style={{ fontSize: config.rankSize, color: config.rankColor }}
              >
                {situation.rank}위
              </span>
              <span
                className="font-semibold tracking-[-0.025em]"
                style={{ fontSize: config.labelSize, color: config.labelColor }}
              >
                {situation.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
