const SECTIONS = [
  {
    id: 'category',
    title: '카테고리별 주요 지출 항목',
    boxClass: 'h-[233px] pb-[79px]',
    messageGap: 'mt-[59px]',
    titleColor: 'text-[#030303]',
  },
  {
    id: 'emotion',
    title: '감정별 주요 지출 항목',
    boxClass: 'h-[233px] pb-[79px]',
    messageGap: 'mt-[59px]',
    titleColor: 'text-[#030303]',
  },
  {
    id: 'situation',
    title: '자주 선택한 상황 태그',
    boxClass: 'h-[280px] pb-5',
    messageGap: 'mt-[86px]',
    titleColor: 'text-[#1C1D1F]',
  },
];

export default function ReportEmpty() {
  return (
    <div className="flex flex-col gap-[25px]">
      {SECTIONS.map((section) => (
        <div
          key={section.id}
          className={`flex w-full flex-col rounded-xl border border-[#F0F0F0] bg-[#F7F8FA] px-4 pt-5 ${section.boxClass}`}
        >
          <p
            className={`text-[20px] font-semibold leading-[150%] tracking-[-0.025em] ${section.titleColor}`}
          >
            {section.title}
          </p>
          <div className={`${section.messageGap} flex w-[216px] flex-col items-center self-center`}>
            <p className="text-[16px] font-semibold leading-[150%] tracking-[-0.025em] text-[#73787E]">
              이번 달 소비가 아직 없어요
            </p>
            <p className="text-[14px] font-medium leading-[150%] tracking-[-0.025em] text-[#9FA4A8]">
              소비를 기록하면 오늘을 돌아볼 수 있어요
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
