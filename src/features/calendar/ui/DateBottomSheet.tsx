'use client';

import { useEffect, useState } from 'react';

interface ExpenseItem {
  category: string;
  tags: string[];
  amount: number;
}

interface DayDetailSheetProps {
  date: number;
  month: number;
  year: number;
  income: number;
  expense: number;
  expenseItems: ExpenseItem[];
  onClose: () => void;
}

export default function DateBottomSheet({
  income,
  expense,
  expenseItems,
  onClose,
}: DayDetailSheetProps) {
  const [isClosing, setIsClosing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => setIsOpen(true));
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={handleClose}>
      <div className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`} />

      <div
        className={`relative flex w-full max-w-md h-[594px] flex-col rounded-t-[20px] bg-white px-4 pb-8 pt-5 transition-transform duration-300 ease-out ${isOpen && !isClosing ? 'translate-y-0' : 'translate-y-full'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex shrink-0 justify-end">
          <button onClick={handleClose}>
            <img src="/icons/icon_X.svg" alt="닫기" width={30} height={30} />
          </button>
        </div>

        <div className="overflow-y-auto">

        {/* 수입/지출 금액 (임시 값 출력) */}
        <div className="mb-4">
          <p className="text-[14px] font-medium leading-normal tracking-[-0.35px] text-[#27282C]">
            수입
          </p>
          <p className="text-[22px] font-bold leading-normal tracking-[-0.55px] text-[#030303]">
            {income.toLocaleString()}원
          </p>
        </div>

        <div className="mb-4">
          <p className="text-[14px] font-medium leading-normal tracking-[-0.35px] text-[#27282C]">
            지출
          </p>
          <p className="text-[22px] font-bold leading-normal tracking-[-0.55px] text-[#EB1C1C]">
            {expense.toLocaleString()}원
          </p>
        </div>

        <div className="mb-2 border-t border-[#E5E5E5]" />

        {/* 지출 항목 리스트 (임시 데이터 출력) */}
        <div className="flex flex-col">
          {expenseItems.map((item, index) => (
            <div
              key={index}
              className="flex items-start justify-between py-3"
            >
              <div>
                <p className="text-[14px] font-medium leading-normal tracking-[-0.35px] text-[#1C1D1F]">
                  {item.category}
                </p>
                <div className="mt-1 flex items-center gap-1.5">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[12px] font-medium leading-normal tracking-[-0.3px] text-[#73787E]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-[14px] font-medium leading-normal tracking-[-0.35px] text-[#1C1D1F]">
                {item.amount.toLocaleString()}원
              </p>
            </div>
          ))}
        </div>
        </div>
      </div>
    </div>
  );
}
