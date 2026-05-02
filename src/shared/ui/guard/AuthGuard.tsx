"use client";

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useToken } from '@/shared/store';

interface IAuthGuard {
  children: React.ReactNode
}

export function AuthGuard({ children }: IAuthGuard) {
  const router = useRouter();
  const pathname = usePathname();
  const { getAccessToken, getRefreshToken } = useToken();

  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();

  useEffect(() => {
    if(!accessToken || !refreshToken) {
      router.replace('/login');
    }
    else {
      if(pathname === '/login') {
        router.replace('/');
      }
    }
  },[accessToken, refreshToken, pathname])

  return <>{children}</>
}