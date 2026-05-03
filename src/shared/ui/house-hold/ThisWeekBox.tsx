import { cn } from '@/shared/lib/utils';
import { WeekExpendType } from '@/entities/week-expenditure/model/week-expend-type';

export default function ThisWeekBox({ data } : { data: WeekExpendType}) {

  if (data.dailyAmounts.length === 0) {
    return <div className={'this__week__box flex w-full justify-between'} />;
  }

  const castDay = (day: number) => {
    switch(day) {
      case 0: return "일"
      case 1: return "월"
      case 2: return "화"
      case 3: return "수"
      case 4: return "목"
      case 5: return "금"
      default: return "토"
    }
  }

  return (
    <div className={'this__week__box flex w-full items-start justify-between'}>
      {data.dailyAmounts.map((week) => {
        return (
          <div className={'this__week__each flex flex-col items-center gap-1.25'} key={week.date}>
            <span className={'text-[14px] font-medium tracking-[-0.025em] text-[#73787e]'}>
              {castDay(new Date(week.date).getDay())}
            </span>
            <span
              className={cn(
                'flex h-7.5 w-7.5 items-center justify-center rounded-full text-[18px] font-semibold tracking-[-0.025em] transition-colors',
                Number(new Date().getDate()) === Number(week.date.split('-')[2]) ? 'bg-[#78bdff] text-white' : ''
              )}
            >
              {week.date.split('-')[2].includes('0')
                ? Number(week.date.split('-')[2])
                : week.date.split('-')[2]}
            </span>
            {week.expense > 0 && (
              <span className={'text-[12px] font-medium tracking-[-0.025em] text-[#eb1c1c]'}>
                {week.expense.toLocaleString()}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}