import { thisWeek } from '@/shared/constants/thisWeek';

export default function ThisWeekBox() {

  return (
    <div className={'this__week__box flex w-full gap-4'}>
      {thisWeek.map((week, index) => (
        <div className={'this__week__each flex flex-1 flex-col items-center gap-2'} key={week.id}>
          <span className={'text-gray-500'}>{week.week}</span>
          <span className={`font-bold w-8 h-8 flex justify-center items-center`}>{week.day}</span>
          {week.changed && (
            <span className={'text-[14px] text-red-500'}>{week.changed.toLocaleString()}</span>
          )}
        </div>
      ))}
    </div>
  );
}