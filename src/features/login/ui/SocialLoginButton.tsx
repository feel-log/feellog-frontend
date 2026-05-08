"use client";

import Image from 'next/image';
import { useKakaoLogin, useGoogleLogin } from '@/features/login';

declare global {
  interface Window {
    Kakao: any;
  }
}

interface SocialLoginButtonProps {
  social: 'kakao' | 'google';
  imageUrl: string;
  text: string;
  isPriority?: boolean;
}

export function SocialLoginButton({ social, imageUrl, text, isPriority = false }: SocialLoginButtonProps) {
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

  if (social === 'google') {
    return (
      <button
        type="button"
        onClick={handleLoginButton}
        disabled={isPending}
        className="flex h-11 w-[300px] cursor-pointer items-center justify-center gap-3 rounded-[4px] border border-[#747775] bg-white px-4"
      >
        <Image src={imageUrl} alt={text} width={20} height={20} priority={isPriority} unoptimized />
        <span
          className="text-[15px] font-medium leading-[150%] tracking-normal text-[#1F1F1F]"
          style={{ fontFamily: 'Roboto, sans-serif' }}
        >
          {text}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleLoginButton}
      disabled={isPending}
      className="flex h-[45px] w-[300px] cursor-pointer items-center justify-center gap-2 rounded-[6px] bg-[#FEE500] px-[14px]"
    >
      <Image src={imageUrl} alt={text} width={18} height={18} priority={isPriority} unoptimized />
      <span
        className="text-[15px] font-semibold leading-[150%] tracking-normal text-black/85"
        style={{ fontFamily: '"Apple SD Gothic Neo", sans-serif' }}
      >
        {text}
      </span>
    </button>
  );
}
