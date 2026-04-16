import React from 'react';
import Link from 'next/link';

export default function HouseHoldBox({ children, isAnchor, anchor } : { children: React.ReactNode, isAnchor?: boolean, anchor?: string }) {
  return (
    <div className={"house__hold__box w-full px-4 py-2 rounded-[8px] bg-linear-30 from-white to-[#eaf5ff] relative z-5 shadow-[0_0_8_0_rgba(19,39,138,0.15)] mb-4"}>
      {
        isAnchor ? <Link href={anchor!}>{children}</Link> : children
      }
    </div>
  )
}