"use client";

import Image from 'next/image';
import { SocialLoginButton } from '@/features/login';
import { useGuestLogin } from '@/features/login/model/useGuestLogin';

export default function LoginContent() {
  const { mutate: loginGuest } = useGuestLogin();

  const handleNoLogin = () => {
    loginGuest();
  }

  return (
    <div className={'login__content__wrapper relative h-[calc(100vh-60.99px)]'}>
      <div className={'logo__part flex flex-col items-center pt-25'}>
        <Image src={'/svg/feel_log_big.svg'} alt={'feel_log_login'} width={181} height={53} />
        <span className={'mt-2.5 block text-[14px] text-white'}>감정으로 읽는 소비 기록</span>
      </div>
      <div
        className={'login__part absolute right-0 bottom-10 left-0 flex flex-col items-center gap-3'}
      >
        <SocialLoginButton
          social={"google"}
          imageUrl={'/svg/google.svg'}
          text={'구글로 로그인하기'}
          color={'#ffffff'}
          textColor={'#000'}
        />
        <SocialLoginButton
          social={"kakao"}
          imageUrl={'/svg/kakaotalk.svg'}
          text={'카카오로 로그인'}
          color={'#fee500'}
          textColor={'#000'}
        />
        <button className={'mt-3 text-[14px] text-white'} onClick={handleNoLogin}>로그인 없이 둘러보기</button>
      </div>
    </div>
  );
}
