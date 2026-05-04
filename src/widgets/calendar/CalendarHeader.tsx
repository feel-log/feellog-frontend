import Image from 'next/image';

interface CalendarHeaderProps {
  year: number;
  month: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  income: number;
  expense: number;
  balance: number;
}

function getHeaderAmountSize(amount: number): string {
  return Math.abs(amount) >= 10_000_000
    ? 'text-[14px] tracking-[-0.35px]'
    : 'text-[16px] tracking-[-0.4px]';
}

export default function CalendarHeader({
  year,
  month,
  onPrevMonth,
  onNextMonth,
  income,
  expense,
  balance,
}: CalendarHeaderProps) {
  const today = new Date();
  const isCurrentMonth =
    year === today.getFullYear() && month === today.getMonth();
  const isNextDisabled =
    year > today.getFullYear() ||
    (year === today.getFullYear() && month >= today.getMonth());

  const currentYear = today.getFullYear();
  const label =
    year === currentYear ? `${month + 1}월` : `${year}년 ${month + 1}월`;

  return (
    <div className="flex w-full flex-col items-center gap-3.5">
      <div className="flex items-center justify-center gap-2.5">
        <button onClick={onPrevMonth}>
          <Image
            src="/svg/icon_arrow_left_fill.svg"
            alt="이전 달"
            width={26}
            height={26}
            className={isCurrentMonth ? '' : 'opacity-100'}
          />
        </button>
        <span className={`text-center text-[18px] font-bold leading-normal tracking-[-0.45px] text-[#27282C] ${year === currentYear ? 'w-13.5' : ''}`}>
          {label}
        </span>
        <button onClick={onNextMonth} disabled={isNextDisabled}>
          <Image
            src="/svg/icon_arrow_right_fill.svg"
            alt="다음 달"
            width={26}
            height={26}
            className={isNextDisabled ? 'opacity-30' : 'opacity-100'}
          />
        </button>
      </div>

      <div className="flex w-full justify-center">
        <div className="flex">
          <div className="flex w-29.25 flex-col items-center px-2.5 py-0.75 pb-1.5">
            <p className="text-[14px] font-medium leading-normal tracking-[-0.35px] text-[#73787E]">
              수입
            </p>
            <p className={`whitespace-nowrap font-semibold leading-normal text-[#030303] ${getHeaderAmountSize(income)}`}>
              {income.toLocaleString()}원
            </p>
          </div>
          <div className="flex w-29 flex-col items-center px-2.5 py-0.75 pb-1.5">
            <p className="text-[14px] font-medium leading-normal tracking-[-0.35px] text-[#73787E]">
              지출
            </p>
            <p className={`whitespace-nowrap font-semibold leading-normal text-[#EB1C1C] ${getHeaderAmountSize(expense)}`}>
              {expense.toLocaleString()}원
            </p>
          </div>
          <div className="flex w-29.25 flex-col items-center px-2.5 py-0.75 pb-1.5">
            <p className="text-[14px] font-medium leading-normal tracking-[-0.35px] text-[#73787E]">
              합계
            </p>
            <p className={`whitespace-nowrap font-semibold leading-normal text-[#030303] ${getHeaderAmountSize(balance)}`}>
              {balance.toLocaleString()}원
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
