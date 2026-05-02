import Image from 'next/image';
import SocialLoginButton from '@/shared/ui/login/SocialLoginButton';

export default function LoginContent() {
  return (
    <div className="relative h-screen w-full">
      {/* 로고 */}
      <div className="absolute left-1/2 top-36.5 -translate-x-1/2">
        <Image
          src="/svg/feel_log_big.svg"
          alt="Feel-Log"
          width={181}
          height={53}
          priority
        />
        <p className="mt-2.5 text-center text-[16px] font-medium tracking-[-0.025em] text-white">
          감정으로 읽는 소비 기록
        </p>
      </div>

      {/* 로그인 버튼 그룹 */}
      <div className="absolute bottom-35 left-1/2 flex w-75 -translate-x-1/2 flex-col gap-3.75">
        <SocialLoginButton
          imageUrl="/svg/google.svg"
          imageSize={20}
          text="Google로 로그인"
          bgColor="#ffffff"
          textColor="#1f1f1f"
          borderColor="#747775"
          rounded="rounded-[4px]"
          fontFamily="Roboto, system-ui, sans-serif"
          fontWeight="medium"
          gap="gap-3"
        />
        <SocialLoginButton
          imageUrl="/svg/kakaotalk.svg"
          imageSize={18}
          text="카카오 로그인"
          bgColor="#fee500"
          textColor="rgba(0, 0, 0, 0.85)"
          fontFamily='"Apple SD Gothic Neo", system-ui, sans-serif'
          fontWeight="semibold"
        />
      </div>

      {/* 둘러보기 버튼 */}
      <button className="absolute bottom-23.5 left-1/2 -translate-x-1/2 cursor-pointer px-2.5 text-[14px] font-medium tracking-[-0.025em] text-white">
        로그인 없이 둘러보기
      </button>
    </div>
  );
}
