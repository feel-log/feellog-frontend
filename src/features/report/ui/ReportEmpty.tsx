const SECTIONS = [
  { id: 'category', title: '카테고리별 주요 지출 항목', height: 'h-58.25', titleColor: 'text-[#030303]' },
  { id: 'emotion', title: '감정별 주요 지출 항목', height: 'h-58.25', titleColor: 'text-[#030303]' },
  { id: 'situation', title: '자주 선택한 상황 태그', height: 'h-70', titleColor: 'text-[#1C1D1F]' },
];

export default function ReportEmpty() {
  return (
    <div className="flex flex-col gap-6.25">
      {SECTIONS.map((section) => (
        <div
          key={section.id}
          className={`flex ${section.height} w-full flex-col rounded-xl border border-[#F0F0F0] bg-[#F7F8FA] px-4 pt-5 pb-19.75`}
        >
          <p className={`text-[20px] font-semibold leading-normal tracking-[-0.5px] ${section.titleColor}`}>
            {section.title}
          </p>
          <div className="flex flex-1 flex-col items-center justify-center">
            <p className="text-[16px] font-semibold leading-normal tracking-[-0.4px] text-[#73787E]">
              이번 달 소비가 아직 없어요
            </p>
            <p className="text-[14px] font-medium leading-normal tracking-[-0.35px] text-[#9FA4A8]">
              소비를 기록하면 오늘을 돌아볼 수 있어요
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
