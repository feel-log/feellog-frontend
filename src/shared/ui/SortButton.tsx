'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useClickOutside } from '@/shared/hooks';

type SortType = 'latest' | 'expensive' | 'cheap';

interface SortButtonProps {
  sortType: SortType;
  onSortChange: (type: SortType) => void;
}

export default function SortButton({ sortType, onSortChange }: SortButtonProps) {
  const [showSortMenu, setShowSortMenu] = useState(false);
  const wrapperRef = useClickOutside<HTMLDivElement>(() => setShowSortMenu(false));

  const sortOptions: Array<{ value: SortType; label: string }> = [
    { value: 'latest', label: '최신순' },
    { value: 'expensive', label: '금액 높은 순' },
    { value: 'cheap', label: '금액 낮은 순' },
  ];

  const currentLabel =
    sortOptions.find((opt) => opt.value === sortType)?.label || '최신순';

  const handleSortChange = (type: SortType) => {
    onSortChange(type);
    setShowSortMenu(false);
  };

  return (
    <div className="relative mb-8 flex justify-end">
      <div
        ref={wrapperRef}
        className={cn(
          'button__wrapper relative w-33',
          showSortMenu ? 'rounded-t-[8px] border border-gray-200' : ''
        )}
      >
        <button
          onClick={() => setShowSortMenu(!showSortMenu)}
          className={cn(
            'flex w-full items-center justify-between px-2 py-2 text-[14px]',
            showSortMenu ? '' : 'rounded-[8px] border border-gray-200 bg-white'
          )}
        >
          {currentLabel}
          <Image
            src={'/svg/icon_arrow_bottom.svg'}
            alt={'icon__bottom'}
            width={14}
            height={14}
          />
        </button>

        {showSortMenu && (
          <>
            <div
              className={
                'shadow__div absolute top-0 -right-0.5 -left-px h-[calc(100%+114.65px)] rounded-[8px] shadow-[0px_2px_8px_rgba(98,98,98,0.22)]'
              }
            ></div>
            <div
              className={
                'show__sort__menu absolute top-full -right-px -left-px flex flex-col rounded-b-[8px] border border-gray-200 bg-white'
              }
            >
              {sortOptions.map((option, idx) => (
                <button
                  key={option.value}
                  onClick={() => handleSortChange(option.value)}
                  className={cn(
                    'cursor-pointer px-5 py-2 text-left text-[14px]',
                    idx < sortOptions.length - 1 ? 'border-b border-gray-200' : '',
                    {
                      'font-semibold text-blue-600': sortType === option.value,
                    }
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
