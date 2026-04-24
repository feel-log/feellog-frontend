'use client';

import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function BackgroundProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <div
      className={cn(
        'mx-auto flex min-h-screen max-w-md flex-col',
        isHomePage
          ? 'bg-gradient-to-b from-[#ecf2fb] to-[#f3f8ff]'
          : 'bg-white'
      )}
    >
      {children}
    </div>
  );
}
