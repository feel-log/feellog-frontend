import HouseHoldBoxWrapper from '@/widgets/house-hold/HouseHoldBoxWrapper';
import { ClientOnly } from '@/shared/ui';
import { DateDisplay } from './DateDisplay';

export default function HouseHoldWrapper() {
  return (
    <div className={"house__hold__wrapper relative px-4"}>
      <div className={"house__hold__chc__1 w-22 h-22 bg-[url('/svg/free_log_chc.png')] bg-center bg-cover absolute right-20 top-0"}></div>
      <div className={"house__hold__chc__1__hand w-11 h-3 bg-[url('/svg/free_log_chc_hand.png')] bg-center bg-cover absolute right-25.5 top-14 z-10"}></div>
      <div className={"house__hold__chc__2 w-10 h-10 bg-[url('/svg/free_log_chc_second.png')] bg-center bg-cover absolute right-8 top-9 z-1"}></div>
      <h2 className={"text-[17px] font-bold pt-7.5 pb-2"}>
        <ClientOnly fallback="날짜를 로드 중입니다..">
          <DateDisplay />
        </ClientOnly>
      </h2>
      <HouseHoldBoxWrapper />
    </div>
  );
}