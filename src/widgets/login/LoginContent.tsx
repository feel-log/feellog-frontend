"use client";

import Image from 'next/image';
import { SocialLoginButton } from '@/features/login';
import { useGuestLogin } from '@/features/login/model/useGuestLogin';
import { useToken } from '@/shared/store';
import ConfirmModal from '@/shared/ui/ConfirmModal';

export default function LoginContent() {
  const { mutate: loginGuest } = useGuestLogin();
  const { setErrorBox, errorBox } = useToken();

  const handleNoLogin = () => {
    loginGuest();
  }

  return (
    <>
      <ConfirmModal isOpen={errorBox} noCancel title={"로그인 중 문제가 발생했어요.|다시 시도해주세요."} onConfirm={() => setErrorBox(false)} onCancel={() => setErrorBox(false)} />
      <div className={'login__content__wrapper h-[calc(100vh-60.99px)]'}>
        <div className={'logo__part flex flex-col items-center pt-25 pb-75'}>
          <Image
            src={'/svg/feel_log_big.svg'}
            alt={'feel_log_login'}
            width={181}
            height={53}
            priority
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IGZpbGw9IiNlNWU3ZWIiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiLz48L3N2Zz4="
          />
          <span className={'mt-2.5 block text-[14px] text-white'}>감정으로 읽는 소비 기록</span>
        </div>
        <div
          className={
            'login__part flex flex-col items-center gap-3'
          }
        >
          <SocialLoginButton
            social={'google'}
            imageUrl={'/svg/google.svg'}
            text={'구글로 로그인'}
            color={'#ffffff'}
            textColor={'#000'}
            isPriority={true}
          />
          <SocialLoginButton
            social={'kakao'}
            imageUrl={'/svg/kakaotalk.svg'}
            text={'카카오로 로그인'}
            color={'#fee500'}
            textColor={'#000'}
            isPriority={true}
          />
          <button className={'mt-3 cursor-pointer text-[14px] text-white'} onClick={handleNoLogin}>
            로그인 없이 둘러보기
          </button>
        </div>
      </div>
    </>
  );
}
