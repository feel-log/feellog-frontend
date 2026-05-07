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
    document.body.style.backgroundColor = color;
  }, [pathname]);

  return (
    <div className="min-h-screen w-full bg-gray-100">
      <div
        className={cn(
          'mx-auto flex min-h-dvh w-full max-w-md flex-col',
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
