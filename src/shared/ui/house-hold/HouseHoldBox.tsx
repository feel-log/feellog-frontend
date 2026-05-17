import React from 'react';
import Link from 'next/link';
import { cn } from '@/shared/lib/utils';

/**
 * Renders a styled container that can optionally act as a link or clickable button.
 *
 * @param children - Content to render inside the box.
 * @param isAnchor - When true, wraps content for navigation (as a Link or button depending on `onClick`).
 * @param anchor - Destination URL used when `isAnchor` is true.
 * @param onClick - Click handler; if provided together with `isAnchor`, the box renders as a button and invokes this handler.
 * @param className - Additional CSS classes applied to the outer container.
 * @param isBoxOn - When true (or when `secondBoxOn` is true), applies stacking and disables pointer events to the container.
 * @param secondBoxOn - When true (or when `isBoxOn` is true), applies stacking and disables pointer events to the container.
 * @returns The rendered container element with children wrapped according to `isAnchor` and `onClick`.
 */
export default function HouseHoldBox({
  children,
  isAnchor,
  anchor,
  className,
  onClick,
  isBoxOn,
  secondBoxOn
} : {
  children: React.ReactNode,
  isAnchor?: boolean,
  anchor?: string,
  className?: string,
  onClick?: () => void
  isBoxOn?: boolean,
  secondBoxOn?: boolean
}) {
  console.log(isBoxOn);

  return (
    <div
      className={cn(
        'house__hold__box mb-2 relative w-full rounded-[12px] bg-white px-4 py-4 shadow-[0px_0px_8px_0px_rgba(19,39,138,0.15)]',
        (isBoxOn || secondBoxOn) ? 'z-[120] pointer-events-none' : 'z-5'
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