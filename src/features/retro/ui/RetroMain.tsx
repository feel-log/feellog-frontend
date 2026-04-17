interface ExpenseCategory {
  name: string;
  amount: number;
  ratio: number;
}

interface Emotion {
  name: string;
  emoji: string;
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
  const maxAmount = Math.max(...categories.map((c) => c.amount));

  return (
    <div className="flex w-full flex-col gap-4">

      <div className="relative flex h-90 w-89.5 flex-col items-center rounded-[10px] bg-[#F7F8FA]">
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
          {categories.map((cat) => (
            <div key={cat.name} className="flex flex-col items-center gap-0.5">
              <p className="text-[14px] font-semibold text-[#1C1D1F]">
                {cat.name}
              </p>
              <div
                className={`w-10 rounded-t-sm ${
                  cat.name === topCategory ? 'bg-[#6B9CE5]' : 'bg-[#CACDD2]'
                }`}
                style={{
                  height: `${Math.max((cat.amount / maxAmount) * 140, 20)}px`,
                }}
              />
            </div>
          ))}
        </div>

        <button className="absolute bottom-4 mx-auto w-78.5 rounded-lg bg-[#DEE8F7] px-14 py-2.5">
          <p className="text-center text-[16px] font-semibold text-[#13278A]">
            지출 상세 내역
          </p>
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto">
        {emotions.map((emotion) => (
          <div
            key={emotion.name}
            className="flex h-21.25 w-37 shrink-0 flex-col items-center justify-center rounded-[10px] bg-[#F7F8FA] px-4 py-3.5"
          >
            <p className="text-[14px] font-medium text-[#73787E]">
              오늘의 소비 감정
            </p>
            <div className="mt-1.5 flex items-center gap-1.5">
              <span className="text-[25px]">{emotion.emoji}</span>
              <p className="text-[20px] font-semibold text-[#1C1D1F]">
                {emotion.name}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
