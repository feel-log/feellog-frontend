"use client";

import Image from 'next/image';
import HouseHoldBox from '@/shared/ui/house-hold/HouseHoldBox';
import ThisWeekBox from '@/shared/ui/house-hold/ThisWeekBox';
import TodayExpenseBox from '@/shared/ui/house-hold/TodayExpenseBox';
import HouseHoldBoxSkeleton from './HouseHoldBoxSkeleton';
import { useWeekExpend } from '@/entities/week-expenditure/model/useWeekExpend';
import { useToken } from '@/shared/store';

export default function HouseHoldBoxWrapper() {
  const { getAccessToken, isLoaded } = useToken();
  const accessToken = getAccessToken();
  const query = useWeekExpend(accessToken || '');

  if (!isLoaded || !accessToken || query.isLoading) {
    return <HouseHoldBoxSkeleton />;
  }

  if (query.isError) {
    return <div className="text-center text-red-500">데이터를 불러오는 데 실패했습니다</div>;
  }

  return (
    <div className={'house__hold__box__wrapper'}>
      <HouseHoldBox className={'flex items-center px-4 py-2 bg-[linear-gradient(93.67deg,#fff_0.95%,#eaf5ff_100%)]'}>
        <div className={'flex flex-1 flex-col gap-0.5'}>
          <h2 className={'text-[18px] font-semibold tracking-[-0.025em] text-[#030303]'}>지갑 대신 마음을 채워봐요</h2>
          <h3 className={'text-[14px] font-medium tracking-[-0.025em] text-[#474c52]'}>공원을 산책하며 여유를 가져볼까요?</h3>
        </div>
        <div
          className={
            "clover h-19 w-19 shrink-0 bg-[url('/svg/icon_fourLeafLover.png')] bg-cover bg-center"
          }
        ></div>
      </HouseHoldBox>
      <HouseHoldBox isAnchor anchor={'/calendar'}>
        <div className={'mb-4.5 flex items-center justify-between'}>
          <div className={'flex flex-col'}>
            <span className={'text-[16px] font-medium tracking-[-0.025em] text-[#73787e]'}>이번 주 지출 비용</span>
            <span className={'text-[24px] font-semibold tracking-[-0.025em] text-[#030303]'}>{query.data?.totalExpense ? query.data.totalExpense + "원" : '0원' }</span>
          </div>
          <Image src={'/svg/icon_arrow_right.svg'} alt={'arrow_button'} width={24} height={24} />
        </div>
        {query.data && <ThisWeekBox data={query.data} />}
      </HouseHoldBox>
      <TodayExpenseBox />
      <HouseHoldBox className={'mb-36 px-4 py-2 shadow-none'} isAnchor anchor={'/retro'}>
        <div className={'flex w-full items-center'}>
          <div className={'flex flex-1 flex-col gap-0.5'}>
            <h2 className={'text-[18px] font-semibold tracking-[-0.025em] text-[#030303]'}>오늘 지출 회고하기</h2>
            <h3 className={'text-[14px] font-medium tracking-[-0.025em] text-[#474c52]'}>지출 속에 담긴 오늘의 마음을 살펴봐요</h3>
          </div>
          <div
            className={
              "note h-19 w-19 shrink-0 bg-[url('/svg/Icon_Review.svg')] bg-cover bg-center"
            }
          ></div>
        </div>
      </HouseHoldBox>
    </div>
  );
}