const DAYS = ['일', '월', '화', '수', '목', '금', '토'];

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

interface CalendarGridProps {
  year: number;
  month: number;
  onDateClick?: (day: number) => void;
}

export default function CalendarGrid({ year, month, onDateClick }: CalendarGridProps) {
  const today = new Date();
  const isCurrentMonth =
    year === today.getFullYear() && month === today.getMonth();
  const todayDate = isCurrentMonth ? today.getDate() : -1;

  const dates = getCalendarDates(year, month);

  return (
    <div className="flex flex-1 flex-col">
      <div className="grid grid-cols-7 bg-[#ECF2FB]">
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
        {dates.map((date, index) => (
          <div
            key={index}
            onClick={() => date.isCurrentMonth && onDateClick?.(date.day)}
            className={`flex flex-col overflow-hidden border-t border-[#CACDD2] px-1.25 py-2 ${
              !date.isCurrentMonth ? 'bg-[#ECF2FB]' : 'cursor-pointer'
            }`}
          >

            <div
              className={`flex w-5.25 items-center justify-center text-[14px] font-medium leading-normal tracking-[-0.35px] ${
                date.isCurrentMonth && date.day === todayDate
                  ? 'rounded-[25px] bg-[#13278A] text-white'
                  : date.isCurrentMonth
                    ? 'text-[#1C1D1F]'
                    : 'text-[#73787E]'
              }`}
            >
              {date.day}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
