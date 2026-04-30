'use client';

import { usePathname } from 'next/navigation';
import { cn } from '@/shared/lib/utils';

export default function BackgroundProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const isLoginPage = pathname === '/login';

  return (
    <div
      className={cn(
        'min-h-screen w-full',
        isHomePage
          ? 'bg-linear-to-b from-[#ecf2fb] to-[#f3f8ff]' :
          isLoginPage ? 'bg-[#13278a]' : 'bg-white'
      )}
    >
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col">
        {children}
      </div>
    </div>
  );
}
