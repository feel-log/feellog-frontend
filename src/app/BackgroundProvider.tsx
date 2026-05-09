'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/shared/lib/utils';

function getEdgeColor(pathname: string): string {
  if (pathname === '/') return '#cce1ff';
  if (pathname === '/login') return '#13278a';
  return '#ffffff';
}

export default function BackgroundProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const isLoginPage = pathname === '/login';

  useEffect(() => {
    const color = getEdgeColor(pathname || '/');
    let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'theme-color';
      document.head.appendChild(meta);
    }
    meta.content = color;

    // 모바일에서는 status bar/swipe 영역 색을 페이지 색과 맞춤
    // PC에서는 외부 wrapper(gray-100)와 일치시켜 화면 가장자리 색 튐 방지
    const isDesktop = window.matchMedia('(min-width: 768px)').matches;
    document.body.style.backgroundColor = isDesktop ? '#f3f4f6' : color;
  }, [pathname]);

  return (
    <div className="min-h-dvh w-full bg-gray-100 md:flex md:items-center md:justify-center">
      <div
        className={cn(
          'mx-auto flex min-h-dvh w-full max-w-md flex-col md:min-h-0 md:h-dvh md:w-[390px] md:max-w-[390px] md:max-h-[792px]',
          isHomePage
            ? 'bg-[linear-gradient(180deg,#cce1ff_8.65%,#f3f8ff_100%)]' :
            isLoginPage ? 'bg-[#13278a]' : 'bg-white'
        )}
      >
        {children}
      </div>
    </div>
  );
}
