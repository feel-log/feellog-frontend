"use client";

import React, { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useToken, useUser } from '@/shared/store';
import { useRefreshToken } from '@/features/refresh/model/useRefreshToken';
import { notificationTestApi } from '@/features/notification-test/api/notification-test-api';
import ConfirmModal from '@/shared/ui/ConfirmModal';

interface IAuthGuard {
  children: React.ReactNode
}

export function AuthGuard({ children }: IAuthGuard) {
  const router = useRouter();
  const pathname = usePathname();
  const { getAccessToken, getRefreshToken, errorBox, setErrorBox, clearTokens } = useToken();
  const { mutate: refreshMutate } = useRefreshToken();
  const notificationTestCalled = useRef(false);

  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();

  const interval = () => {
    if (refreshToken) {
      refreshMutate(refreshToken);
    }
  };

  // 토큰 상태 감시 - 토큰이 없으면 로그인 페이지로 이동
  useEffect(() => {
    if (!accessToken || !refreshToken) {
      clearTokens();
      router.replace('/login');
    } else if (pathname === '/login') {
      router.replace('/');
    }
  }, [accessToken, refreshToken, pathname]);

  // 테스트 API는 '/' 라우트에서만 한 번 호출
  useEffect(() => {
    if (pathname === '/' && accessToken && refreshToken && !notificationTestCalled.current) {
      const isPushEnabled =
        typeof window !== 'undefined' &&
        localStorage.getItem('isPushNotificationEnabled') === 'true';

      if (isPushEnabled) {
        notificationTestCalled.current = true;
        notificationTestApi().catch((error) => {
          console.debug('Notification test API:', error?.message);
        });
      }
    }
  }, [pathname, accessToken, refreshToken]);

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