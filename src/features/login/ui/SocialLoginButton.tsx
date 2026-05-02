"use client";

import Image from 'next/image';
import { useKakaoLogin, useGoogleLogin } from '@/features/login';


declare global {
  interface Window {
    Kakao: any;
  }
}

interface SocialLoginButtonProps {
  imageUrl: string;
  imageSize?: number;
  text: string;
  bgColor: string;
  textColor: string;
  borderColor?: string;
  rounded?: string;
  fontFamily?: string;
  fontWeight?: 'medium' | 'semibold';
  gap?: string;
  onClick?: () => void;
}

export function SocialLoginButton({ social,imageUrl, text, color, textColor }: { social:"kakao" | "google",imageUrl: string, text: string, color: string, textColor: string }) {
  const { mutate: loginKakao, isPending } = useKakaoLogin();
  const { mutate: loginGoogle } = useGoogleLogin();

  const handleLoginButton = () => {
    if (social === 'kakao') {
      if (!window.Kakao || !window.Kakao.isInitialized()) {
        console.error('카카오 SDK가 초기화되지 않았습니다');
        return;
      }
      window.Kakao.Auth.login({
        success: (authObj: { access_token: string }) => {
          loginKakao(authObj.access_token);
        },
        fail: (error: unknown) => {
          console.error('카카오 로그인 실패', error);
        },
      });
    } else if (social === 'google') {
      if (!window.google || !window.google.accounts || !window.google.accounts.id) {
        console.log('Google SDK not initialized');
        return;
      }
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        callback: (response) => {
          loginGoogle(response.credential);
        }
      })

      window.google.accounts.id.prompt();
    }
  }

  return (
    <button className={"w-3/4 py-4 px-5 rounded-[8px] flex items-center cursor-pointer"} style={{ backgroundColor: color}} onClick={handleLoginButton} disabled={isPending}>
      <Image src={imageUrl} alt={text} width={20} height={20} />
      <span className={"absolute left-1/2 -translate-x-1/2 text-[13px]"} style={{ color: textColor }}>{text}</span>
    </button>
  );
}