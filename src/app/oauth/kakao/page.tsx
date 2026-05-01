"use client";

import { useSearchParams } from 'next/navigation';
import { useLoginKakao } from '@/features/login';
import { useEffect } from 'react';

export default function KakaoCallbackPage() {
  const searchParams = useSearchParams();
  const code = searchParams.get('code'); // URL에서 인가 코드 추출
  const { mutate: loginKakao } = useLoginKakao();

  useEffect(() => {
    if(code) {
      loginKakao(code);
    }
  },[])

  return <div className={"h-[calc(100vh-60.99px)] flex flex-col justify-center items-center text-gray-500"}>
    <span className={"text-[20px] text-gray-400 block mb-2"}>로그인 처리중입니다.</span>
    <span>잠시만 기다려주세요..</span>
  </div>
}