'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/shared/lib/utils';
import { useClickOutside } from '@/shared/hooks';

export interface DropdownOption<T extends string> {
  value: T;
  label: string;
}

interface DropdownProps<T extends string> {
  options: DropdownOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export default function Dropdown<T extends string>({
  options,
  value,
  onChange,
  className,
}: DropdownProps<T>) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useClickOutside<HTMLDivElement>(() => setOpen(false));

  const currentLabel = options.find((o) => o.value === value)?.label ?? options[0].label;
  const otherOptions = options.filter((o) => o.value !== value);

  const handleSelect = (next: T) => {
    onChange(next);
    setOpen(false);
  };

  const itemBaseClass =
    'flex h-[33px] w-full items-center whitespace-nowrap border border-[#e5e5e5] bg-white px-[15px] py-1.5 text-[14px] font-medium tracking-[-0.025em] text-[#474c52] cursor-pointer';

  return (
    <div
      ref={wrapperRef}
      className={cn(
        'relative w-27.25 z-50',
        open && 'filter drop-shadow-[0px_2px_8px_rgba(98,98,98,0.22)]',
        className
      )}
    >
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          itemBaseClass,
          'justify-between gap-1.5',
          open ? 'rounded-t-[8px]' : 'rounded-[8px]'
        )}
      >
        {currentLabel}
        <Image
          src={open ? '/svg/icon_arrow_top.svg' : '/svg/icon_arrow_bottom.svg'}
          alt={open ? 'collapse' : 'expand'}
          width={20}
          height={20}
        />
      </button>

      {open && (
        <div className="absolute top-full right-0 left-0 z-50 flex flex-col">
          {otherOptions.map((option, idx) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={cn(
                itemBaseClass,
                'border-t-0 hover:bg-gray-50',
                idx === otherOptions.length - 1 ? 'rounded-b-[8px]' : ''
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
