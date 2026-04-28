import type { Insight } from '@/features/report/mock/reportMockData';

interface ReportInsightsProps {
  userName: string;
  insights: Insight[];
}

export default function ReportInsights({ userName, insights }: ReportInsightsProps) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-[20px] font-semibold leading-normal tracking-[-0.5px] text-[#030303]">
        이번 달 {userName}님은
      </h2>
      <div className="flex flex-col gap-2 rounded-[12px] border border-[#F0F0F0] bg-[#F7F8FA] py-3.5 px-4">
        {insights.map((insight) => (
          <img
            key={insight.id}
            src={insight.imageSrc}
            alt=""
            className="w-full"
          />
        ))}
      </div>
    </div>
  );
}
