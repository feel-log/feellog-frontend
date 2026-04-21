'use client';

import RetroEmpty from '@/features/retro/ui/RetroEmpty';

export default function RetroPage() {
  // 임시: 지출 데이터 없음
  const totalExpense = 0;
  const hasData = totalExpense > 0;

  const today = new Date();
  const dateLabel = `${today.getMonth() + 1}월 ${today.getDate()}일 지출`;

  return (
    <div className="flex flex-1 flex-col">
      {/* 상단 헤더 (공용 컴포넌트로 변경 예정) */}
      <header className="flex h-14 items-center justify-between px-4">
        <button>
          <img
            src="/icons/icon_arrow_left.svg"
            alt="뒤로가기"
            width={28}
            height={28}
          />
        </button>
        <h1 className="text-[20px] font-semibold text-[#030303]">회고하기</h1>
        <div className="w-7" />
      </header>

      {/* 날짜 / 금액 */}
      <div className="px-4 pt-5">
        <p className="text-[14px] font-medium leading-6 text-[#73787E]">{dateLabel}</p>
        <p className="text-[28px] font-bold text-[#030303]">
          {totalExpense.toLocaleString()}원
        </p>
      </div>

      {/* 콘텐츠 영역 */}
      <div className="flex flex-1 items-start justify-center px-4 pt-7">
        {hasData ? (
          <div />
        ) : (
          <RetroEmpty />
        )}
      </div>

      {/* 하단 버튼 */}
      <div className="flex w-full items-center justify-center bg-white pt-6 pb-12.75 pl-4.25 pr-3.75">
        <button className="h-13.5 w-full rounded-[10px] bg-[#13278A] text-[16px] font-semibold text-white">
          {hasData ? '소비 회고하기' : '소비 기록하러 가기'}
        </button>
      </div>
    </div>
  );
}
