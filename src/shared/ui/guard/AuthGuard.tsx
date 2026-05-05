"use client";

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useToken, useUser } from '@/shared/store';
import { useRefreshToken } from '@/features/refresh/model/useRefreshToken';
import ConfirmModal from '@/shared/ui/ConfirmModal';

interface IAuthGuard {
  children: React.ReactNode
}

export function AuthGuard({ children }: IAuthGuard) {
  const router = useRouter();
  const pathname = usePathname();
  const { getAccessToken, getRefreshToken, errorBox, setErrorBox, clearTokens } = useToken();
  const { mutate: refreshMutate } = useRefreshToken();

  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();

  const interval = () => {
    refreshMutate(refreshToken ?? '');
  };

  useEffect(() => {
    if(!accessToken || !refreshToken) {
      router.replace('/login');
    }
    else {
      if(pathname === '/login') {
        router.replace('/');
      }
    }
  },[accessToken, refreshToken, pathname]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if(pathname !== '/login') {
      intervalId = setInterval(interval, 10 * 60 * 1000)
    }

    return () => {
      if(intervalId) clearInterval(intervalId);
    }
  },[pathname])

  return (
    <>
      <ConfirmModal type={"loginCheck"} isOpen={errorBox} title={"로그인 후 이용 가능합니다."} secondary={"로그인 하시겠습니까?"} onCancel={() => { setErrorBox(false)}} onConfirm={() => { setErrorBox(false); router.push('/login'); clearTokens(); }} />
      {children}
    </>
  )
}