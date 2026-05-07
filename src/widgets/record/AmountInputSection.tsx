'use client';

import { cn } from '@/shared/lib/utils';

interface AmountInputSectionProps {
  displayAmount: number;
  isAmountEditing: boolean;
  onAmountEditStart: () => void;
}

export default function AmountInputSection({
  displayAmount,
  isAmountEditing,
  onAmountEditStart,
}: AmountInputSectionProps) {
  return (
    <div className="mb-7 flex items-end justify-between gap-2">
      <div className="flex flex-col">
        <span className="text-[16px] font-medium tracking-[-0.025em] text-[#73787e]">금액</span>
        <div
          onClick={onAmountEditStart}
          className={cn(
            'cursor-pointer rounded-[10px] border px-4 py-3 text-[28px] font-semibold tracking-[-0.025em] text-[#030303] transition-colors',
            isAmountEditing
              ? 'border-[#13278a] bg-[#ecf2fb]'
              : 'border-[#e5e5e5] hover:bg-gray-50'
          )}
        >
          {displayAmount.toLocaleString()}
        </div>
      </div>
      <span className="text-[28px] font-semibold tracking-[-0.025em] text-[#030303] pb-3">
        원
      </span>
    </div>
  );
}
