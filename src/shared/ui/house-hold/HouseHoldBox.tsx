import React from 'react';
import Link from 'next/link';
import { cn } from '@/shared/lib/utils';

export default function HouseHoldBox({ children, isAnchor, anchor, className } : { children: React.ReactNode, isAnchor?: boolean, anchor?: string, className?: string }) {
  return (
    <div
      className={cn(
        'house__hold__box mb-4 relative z-5 w-full rounded-[8px] bg-linear-30 from-white to-[#eaf5ff] px-4 py-4 shadow-[0px_0px_8px_0px_rgba(19,39,138,0.15)]'
        ,className
      )}
    >
      {isAnchor ? <Link href={anchor!}>{children}</Link> : children}
    </div>
  );
}