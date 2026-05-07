'use client';

import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import EmotionDisplay from './EmotionDisplay';

interface Emotion {
  emoji: string;
  label: string;
}

interface ExpenseItemCardProps {
  expenseId: number;
  name: string;
  amount: number;
  emotions: Emotion[];
  tag: string[];
  memo?: string;
  paymentMethod: string;
  selectedDate: string;
  swipedId: number | null;
  onSwipe: (id: number | null) => void;
  onDelete: (id: number) => void;
}

export default function ExpenseItemCard({
  expenseId,
  name,
  amount,
  emotions,
  tag,
  memo,
  paymentMethod,
  selectedDate,
  swipedId,
  onSwipe,
  onDelete,
}: ExpenseItemCardProps) {
  const router = useRouter();
  const touchStartX = useRef(0);

  const handlePointerDown = (e: React.PointerEvent) => {
    touchStartX.current = e.clientX;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    const touchEndX = e.clientX;
    const diff = touchStartX.current - touchEndX;

    if (diff > 30) {
      onSwipe(expenseId);
      e.preventDefault();
    } else if (diff < -30) {
      onSwipe(null);
    }
  };

  const handleExpenseClick = (e: React.MouseEvent) => {
    const diff = Math.abs(touchStartX.current - e.clientX);
    if (diff < 30) {
      router.push(
        `/record?expenseId=${expenseId}&date=${selectedDate}&mode=edit`
      );
    }
  };

  return (
    <div
      className="relative overflow-hidden rounded-lg"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      style={{ touchAction: 'pan-y' }}
    >
      {/* 삭제 버튼 배경 */}
      <div className="absolute inset-y-0 right-0 z-0 flex items-center justify-end pr-4">
        <button
          onClick={() => onDelete(expenseId)}
          className="bg-[#eb1c1c] text-white w-10 h-10 flex justify-center items-center rounded-full"
          aria-label="삭제"
        >
          <Trash2 size={24} />
        </button>
      </div>

      {/* 컨텐츠 */}
      <div
        className={`relative z-10 bg-white transition-transform duration-300 cursor-pointer ${
          swipedId === expenseId ? 'translate-x-[-80px]' : ''
        }`}
        onClick={handleExpenseClick}
      >
        <div className="flex flex-col gap-1.25 pb-3.75">
          {/* 카테고리명 + 금액 */}
          <div className="flex items-center justify-between">
            <h4 className="text-[18px] font-semibold tracking-[-0.025em] text-[#27282c]">
              {name}
            </h4>
            <p className="text-[20px] font-semibold tracking-[-0.025em] text-[#030303]">
              {amount.toLocaleString()}원
            </p>
          </div>

          {/* 태그 + 메모 */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              {tag && tag.length > 0 && (
                <span className="text-[16px] font-medium tracking-[-0.025em] text-[#13278a]">
                  {tag.join(', ')}
                </span>
              )}
              {tag && tag.length > 0 && memo && (
                <span className="text-[16px] font-medium tracking-[-0.025em] text-[#9fa4a8]">
                  |
                </span>
              )}
              {memo && (
                <span className="text-[16px] font-medium tracking-[-0.025em] text-[#9fa4a8]">
                  {memo}
                </span>
              )}
            </div>
            <span className="text-[16px] font-medium tracking-[-0.025em] text-[#9fa4a8]">
              {paymentMethod}
            </span>
          </div>

          {/* 감정 */}
          <EmotionDisplay emotions={emotions} />
        </div>
      </div>
    </div>
  );
}
