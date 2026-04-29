import Image from 'next/image';
import SocialLoginButton from '@/shared/ui/login/SocialLoginButton';

export default function LoginContent() {
  return (
    <div className={"login__content__wrapper relative h-[calc(100vh_-_60.99px)]"}>
      <div className={"logo__part flex flex-col items-center pt-25"}>
        <Image src={"/svg/feel_log_big.svg"} alt={"feel_log_login"} width={181} height={53} />
        <span className={"block mt-2.5 text-white text-[14px]"}>감정으로 읽는 소비 기록</span>
      </div>
      <div className={"login__part absolute bottom-10 left-0 right-0 flex flex-col items-center gap-3"}>
        <SocialLoginButton imageUrl={"/svg/kakaotalk.svg"} text={"카카오로 로그인"} color={"#fee500"} textColor={"#000"} />
        <SocialLoginButton imageUrl={"/svg/naver.svg"} text={"네이버로 로그인"} color={"#05ac4f"} textColor={"#fff"} />
        <button className={"text-white text-[17px] mt-3"}>로그인 없이 둘러보기</button>
      </div>
    </div>
  );
}