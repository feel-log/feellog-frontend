'use client';

export default function EmptyStateMessage() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <h3 className="mb-1 text-[18px] font-semibold tracking-[-0.025em] text-[#474c52]">
        지출 기록이 아직 없어요
      </h3>
      <p className="text-[14px] font-medium tracking-[-0.025em] text-[#9fa4a8]">
        오늘의 소비와 감정을 함께 기록해보세요
      </p>
    </div>
  );
}
