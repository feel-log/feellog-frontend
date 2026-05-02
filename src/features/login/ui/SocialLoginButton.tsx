"use client";

import Image from 'next/image';
import { useLoginKakao } from '@/features/login';

declare global {
  interface Window {
    Kakao: any;
  }
}

export function SocialLoginButton({ social,imageUrl, text, color, textColor }: { social:"kakao" | "google",imageUrl: string, text: string, color: string, textColor: string }) {
  const { mutate: loginKakao, isPending } = useLoginKakao();

  const handleLoginButton = () => {
    if (social === 'kakao') {
      if (!window.Kakao || !window.Kakao.isInitialized()) {
        console.error('카카오 SDK가 초기화되지 않았습니다');
        return;
      }

      // 팝업 방식 — 리다이렉트 없이 팝업으로 처리
      window.Kakao.Auth.login({
        success: (authObj: { access_token: string }) => {
          // 팝업에서 바로 access_token 받음
          loginKakao(authObj.access_token);
        },
        fail: (error: unknown) => {
          console.error('카카오 로그인 실패', error);
        },
      });
    }
  }

  return (
    <button className={"w-3/4 py-4 px-5 rounded-[8px] flex items-center cursor-pointer"} style={{ backgroundColor: color}} onClick={handleLoginButton} disabled={isPending}>
      <Image src={imageUrl} alt={text} width={20} height={20} />
      <span className={"absolute left-1/2 -translate-x-1/2 text-[13px]"} style={{ color: textColor }}>{text}</span>
    </button>
  )
}