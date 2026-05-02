const DAYS = ['일', '월', '화', '수', '목', '금', '토'];

function getCellAmountSize(amount: number): string {
  const abs = Math.abs(amount);
  if (abs >= 100_000_000) return 'text-[8px] tracking-[-0.2px]';
  if (abs >= 10_000_000) return 'text-[9px] tracking-[-0.225px]';
  if (abs >= 1_000_000) return 'text-[10px] tracking-[-0.25px]';
  if (abs >= 100_000) return 'text-[11px] tracking-[-0.275px]';
  return 'text-[12px] tracking-[-0.3px]';
}

function getCalendarDates(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();
  const prevLastDate = new Date(year, month, 0).getDate();

  const dates = [];

  for (let i = firstDay - 1; i >= 0; i--) {
    dates.push({ day: prevLastDate - i, isCurrentMonth: false });
  }

  for (let i = 1; i <= lastDate; i++) {
    dates.push({ day: i, isCurrentMonth: true });
  }

  const remaining = 42 - dates.length;
  for (let i = 1; i <= remaining; i++) {
    dates.push({ day: i, isCurrentMonth: false });
  }

  return dates;
}

export interface DailyAmount {
  income?: number;
  expense?: number;
}

interface CalendarGridProps {
  year: number;
  month: number;
  onDateClick?: (day: number) => void;
  dailyAmounts?: Record<number, DailyAmount>;
  selectedDay?: number | null;
}

export default function CalendarGrid({
  year,
  month,
  onDateClick,
  dailyAmounts = {},
  selectedDay = null,
}: CalendarGridProps) {
  const today = new Date();
  const isCurrentMonth =
    year === today.getFullYear() && month === today.getMonth();
  const todayDate = isCurrentMonth ? today.getDate() : -1;

  const dates = getCalendarDates(year, month);

  return (
    <div className="flex flex-1 flex-col">
      <div className="grid grid-cols-7 bg-[#F7F8FA]">
        {DAYS.map((day) => (
          <div
            key={day}
            className="flex items-center justify-center px-2.5 py-1.25 text-[14px] font-medium leading-normal tracking-[-0.35px] text-[#474C52]"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid flex-1 auto-rows-fr grid-cols-7">
        {dates.map((date, index) => {
          const amounts = date.isCurrentMonth ? dailyAmounts[date.day] : undefined;
          const isSelected = date.isCurrentMonth && date.day === selectedDay;
          const isToday = date.isCurrentMonth && date.day === todayDate;
          const otherDateSelected =
            selectedDay !== null && selectedDay !== todayDate;

          let dayClass = '';
          if (isSelected) {
            dayClass = 'rounded-[25px] bg-[#13278A] text-white';
          } else if (isToday && otherDateSelected) {
            dayClass = 'rounded-[25px] bg-[#E5E5E5] text-[#1C1D1F]';
          } else if (isToday) {
            dayClass = 'rounded-[25px] bg-[#13278A] text-white';
          } else if (date.isCurrentMonth) {
            dayClass = 'text-[#1C1D1F]';
          } else {
            dayClass = 'text-[#9FA4A8]';
          }

          return (
            <div
              key={index}
              onClick={() => date.isCurrentMonth && onDateClick?.(date.day)}
              className={`flex flex-col items-start gap-2.5 px-1.25 py-2 ${
                date.isCurrentMonth ? 'cursor-pointer' : ''
              }`}
            >
              <div
                className={`flex size-6.25 items-center justify-center text-[14px] font-medium leading-normal tracking-[-0.35px] ${dayClass}`}
              >
                {date.day}
              </div>
              {amounts && (
                <div className="flex flex-col gap-1.25 font-medium leading-normal">
                  {amounts.income ? (
                    <span className={`whitespace-nowrap text-[#030303] ${getCellAmountSize(amounts.income)}`}>
                      +{amounts.income.toLocaleString()}
                    </span>
                  ) : null}
                  {amounts.expense ? (
                    <span className={`whitespace-nowrap text-[#EB1C1C] ${getCellAmountSize(amounts.expense)}`}>
                      -{amounts.expense.toLocaleString()}
                    </span>
                  ) : null}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
