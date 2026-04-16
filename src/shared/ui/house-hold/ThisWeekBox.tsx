import { thisWeek } from '@/shared/constants/thisWeek';

export default function ThisWeekBox() {
  return <div className={"this__week__box flex gap-4 w-full"}>
    {
      thisWeek.map((week, index) => (
        <div className={"this__week__each flex flex-col gap-2 items-center flex-1"} key={week.id}>
          <span className={"text-gray-500"}>{week.week}</span>
          <span className={"font-bold"}>{week.day}</span>
        </div>
      ))
    }
  </div>
}