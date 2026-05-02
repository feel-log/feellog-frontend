'use client';

import { usePathname } from 'next/navigation';
import { cn } from '@/shared/lib/utils';

export default function BackgroundProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const isLoginPage = pathname === '/login';

  return (
    <div className="min-h-screen w-full bg-gray-100">
      <div
        className={cn(
          'mx-auto flex min-h-screen w-full max-w-md flex-col',
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
