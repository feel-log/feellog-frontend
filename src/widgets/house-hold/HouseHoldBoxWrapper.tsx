"use client";

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import HouseHoldBox from '@/shared/ui/house-hold/HouseHoldBox';
import ThisWeekBox from '@/shared/ui/house-hold/ThisWeekBox';
import TodayExpenseBox from '@/shared/ui/house-hold/TodayExpenseBox';
import ConfirmModal from '@/shared/ui/ConfirmModal';
import HouseHoldBoxSkeleton from './HouseHoldBoxSkeleton';
import { greetingMessages } from '@/shared/constants/greetingMessages';
import { type GreetingMessage } from '@/shared/constants/greetingMessages';
import { useWeekExpend } from '@/entities/week-expenditure/model/useWeekExpend';
import { useToken, useUser } from '@/shared/store';
import { useMasterData } from '@/entities/master-data';
import { useMemo } from 'react';

const getRandomNumberByDate = (): number => {
  const today = new Date().toISOString().split('T')[0];
  let hash = 0;
  for (let i = 0; i < today.length; i++) {
    hash = today.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % 4;
};

export default function HouseHoldBoxWrapper() {
  const router = useRouter();
  const { getAccessToken, isLoaded } = useToken();
  const { getUser } = useUser();
  const user = getUser();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const accessToken = getAccessToken();
  const query = useWeekExpend(accessToken || '');
  const { emotions, expenseCategories } = useMasterData();
  const randomNumber = useMemo(() => getRandomNumberByDate(), []);

  const handleWeekBoxClick = () => {
    if (!user?.nickname || user?.nickname.startsWith('guest')) {
      setShowLoginModal(true);
      return;
    }
    router.push('/calendar');
  };

  if (!isLoaded || !accessToken) {
    return <HouseHoldBoxSkeleton />;
  }

  if (query.isError) {
    return <div className="text-center text-red-500">데이터를 불러오는 데 실패했습니다</div>;
  }

  return (
    <div className={'house__hold__box__wrapper'}>
      {query.isLoading ? (
        <HouseHoldBoxSkeleton />
      ) : (
        <>
          <HouseHoldBox className={'flex items-center px-4 py-2 bg-[linear-gradient(93.67deg,#fff_0.95%,#eaf5ff_100%)]'}>
            <div className={'flex flex-1 flex-col gap-0.5'}>
              <h2 className={'text-[18px] font-semibold tracking-[-0.025em] text-[#030303]'}>{greetingMessages[randomNumber].title}</h2>
              <h3 className={'text-[14px] font-medium tracking-[-0.025em] text-[#474c52]'}>{greetingMessages[randomNumber].secondary}</h3>
            </div>
            <div
              className={
                `h-19 w-19 shrink-0 bg-cover bg-center`
              }
              style={{ backgroundImage: `url(${greetingMessages[randomNumber].image})` }}
            ></div>
          </HouseHoldBox>
          {query.data && (
            <HouseHoldBox isAnchor onClick={handleWeekBoxClick}>
              <div className={'mb-4.5 flex items-center justify-between'}>
                <div className={'flex flex-col'}>
                  <span className={'text-[16px] font-medium tracking-[-0.025em] text-[#73787e]'}>이번 주 지출 비용</span>
                  <span className={'text-[24px] font-semibold tracking-[-0.025em] text-[#030303]'}>{query.data?.totalExpense ? query.data.totalExpense.toLocaleString() + "원" : '0원' }</span>
                </div>
                <Image src={'/svg/icon_arrow_right.svg'} alt={'arrow_button'} width={24} height={24} />
              </div>
              {query.data && <ThisWeekBox data={query.data} />}
            </HouseHoldBox>
          )}
          <TodayExpenseBox emotions={emotions} expenseCategories={expenseCategories} />
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

          <ConfirmModal
            isOpen={showLoginModal}
            type="loginCheck"
            title="로그인 후 이용 가능합니다."
            secondary="로그인 하시겠습니까?"
            onCancel={() => setShowLoginModal(false)}
            onConfirm={() => {
              setShowLoginModal(false);
              router.push('/login');
            }}
          />
        </>
      )}
    </div>
  );
}