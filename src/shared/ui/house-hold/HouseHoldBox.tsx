import React from 'react';
import Link from 'next/link';
import { cn } from '@/shared/lib/utils';

export default function HouseHoldBox({
  children,
  isAnchor,
  anchor,
  className,
  onClick
} : {
  children: React.ReactNode,
  isAnchor?: boolean,
  anchor?: string,
  className?: string,
  onClick?: () => void
}) {
  return (
    <div
      className={cn(
        'house__hold__box mb-2 relative z-5 w-full rounded-[12px] bg-white px-4 py-4 shadow-[0px_0px_8px_0px_rgba(19,39,138,0.15)]'
        ,className
      )}
    >
      {isAnchor && onClick ? (
        <button onClick={onClick} className="block w-full text-left">{children}</button>
      ) : isAnchor ? (
        <Link href={anchor!} className="block w-full">{children}</Link>
      ) : (
        children
      )}
    </div>
  );
}