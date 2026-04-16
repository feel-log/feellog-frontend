import HouseHoldBoxWrapper from '@/widgets/house-hold/HouseHoldBoxWrapper';

export default function HouseHoldWrapper() {
  return (
    <div className={"house__hold__wrapper relative px-4"}>
      <div className={"house__hold__chc__1 w-22 h-22 bg-[url('/svg/free_log_chc.png')] bg-center bg-cover absolute right-20 top-0"}></div>
      <div className={"house__hold__chc__1__hand w-11 h-3 bg-[url('/svg/free_log_chc_hand.png')] bg-center bg-cover absolute right-25.5 top-14 z-10"}></div>
      <h2 className={"text-[15px] pt-7.5 pb-2"}>4월 7일 (화)</h2>
      <HouseHoldBoxWrapper />
    </div>
  );
}