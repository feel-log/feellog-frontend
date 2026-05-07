'use client';

import Image from 'next/image';
import { cn } from '@/shared/lib/utils';

interface DateNavigatorProps {
  formattedDate: string;
  canGoPrev: boolean;
  canGoNext: boolean;
  onPrevDay: () => void;
  onNextDay: () => void;
  totalAmount: number;
}

export default function DateNavigator({
  formattedDate,
  canGoPrev,
  canGoNext,
  onPrevDay,
  onNextDay,
  totalAmount,
}: DateNavigatorProps) {
  return (
    <div className={cn('flex items-center gap-0.75', totalAmount === 0 ? 'mb-2' : 'mb-3')}>
      <button
        onClick={onPrevDay}
        disabled={!canGoPrev}
        className={`transition-opacity ${
          canGoPrev ? 'cursor-pointer' : 'cursor-not-allowed opacity-40'
        }`}
      >
        <Image
          src={'/svg/icon_arrow_left_fill.svg'}
          alt={'prev'}
          width={20}
          height={20}
          loading="lazy"
        />
      </button>
      <span className="text-[16px] font-medium tracking-[-0.025em] text-[#27282c]">
        {formattedDate}
      </span>
      <button
        onClick={onNextDay}
        disabled={!canGoNext}
        className={`transition-opacity ${
          canGoNext ? 'cursor-pointer' : 'cursor-not-allowed opacity-40'
        }`}
      >
        <Image
          src={'/svg/icon_arrow_left_fill.svg'}
          alt={'next'}
          width={20}
          height={20}
          className={'rotate-180'}
        />
      </button>
    </div>
  );
}
