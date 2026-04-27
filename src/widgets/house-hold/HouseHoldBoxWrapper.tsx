import Image from 'next/image';
import HouseHoldBox from '@/shared/ui/house-hold/HouseHoldBox';
import ThisWeekBox from '@/shared/ui/house-hold/ThisWeekBox';
import TodayExpenseBox from '@/shared/ui/house-hold/TodayExpenseBox';

export default function HouseHoldBoxWrapper() {
  return (
    <div className={'house__hold__box__wrapper'}>
      <HouseHoldBox>
        <h2 className={'py-1 text-[17px] font-medium'}>지갑 대신 마음을 채워봐요.</h2>
        <h3 className={'pb-1 text-[13px] text-gray-600'}>공원을 산책하며 여유를 가져볼까요?</h3>
        <div
          className={
            "clover absolute top-0 right-10 bottom-0 my-auto h-14 w-14 bg-[url('/svg/icon_fourLeafLover.png')] bg-cover bg-center"
          }
        ></div>
      </HouseHoldBox>
      <HouseHoldBox isAnchor anchor={'/calendar'}>
        <div className={'export_money mb-5 flex flex-col'}>
          <span className={'text-[15px] text-gray-500'}>이번 주 지출 비용</span>
          <span className={'text-[18px] font-bold'}>120,000원</span>
        </div>
        <div className={'arrow__button absolute top-4 right-4'}>
          <Image src={'/svg/icon_arrow_right.svg'} alt={'arrow_button'} width={20} height={20} />
        </div>
        <ThisWeekBox />
      </HouseHoldBox>
      <TodayExpenseBox />
      <HouseHoldBox className={"mb-36"}>
        <h2 className={'py-1 text-[17px] font-medium'}>오늘의 지출 회고하기</h2>
        <h3 className={'pb-1 text-[13px] text-gray-600'}>지출 속에 담긴 오늘의 마음을 살펴봐요</h3>
        <div
          className={
            "note absolute top-0 right-10 bottom-0 my-auto h-14 w-14 bg-[url('/svg/Icon_Review.svg')] bg-cover bg-center"
          }
        ></div>
      </HouseHoldBox>
    </div>
  );
}