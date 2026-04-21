'use client';

import { useEffect, useState } from 'react';

interface ExpenseItem {
  category: string;
  tags: string[];
  amount: number;
  paymentMethod: string;
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
  date,
  month,
  year,
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

  const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][
    new Date(year, month, date).getDay()
  ];
  const dateLabel = `${month + 1}월 ${date}일 (${dayOfWeek})`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      onClick={handleClose}
    >
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
      />

      <div
        className={`relative flex w-full max-w-md h-[calc(100dvh-89px)] flex-col rounded-t-[20px] bg-white px-4 py-10 transition-transform duration-300 ease-out ${isOpen && !isClosing ? 'translate-y-0' : 'translate-y-full'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 날짜 + 닫기 버튼 */}
        <div className="flex items-center justify-between">
          <p className="text-[18px] font-medium leading-[1.5] tracking-[-0.45px] text-[#27282C]">
            {dateLabel}
          </p>
          <button onClick={handleClose} className="size-7" aria-label="닫기">
            <img src="/icons/icon_X.svg" alt="" width={28} height={28} />
          </button>
        </div>

        <div className="mt-5 flex flex-col gap-5 overflow-y-auto">
          {/* 수입 */}
          <div className="flex flex-col gap-[5px]">
            <p className="text-[18px] font-semibold leading-[1.5] tracking-[-0.45px] text-[#27282C]">
              수입
            </p>
            <p className="text-[24px] font-semibold leading-[1.5] tracking-[-0.6px] text-[#030303]">
              {income.toLocaleString()}원
            </p>
          </div>

          {/* 지출 */}
          <div className="flex flex-col gap-[5px]">
            <p className="text-[18px] font-semibold leading-[1.5] tracking-[-0.45px] text-[#27282C]">
              지출
            </p>
            <div className="flex items-center border-b border-[#E5E5E5] pb-[15px]">
              <p className="text-[24px] font-semibold leading-[1.5] tracking-[-0.6px] text-[#EB1C1C]">
                {expense.toLocaleString()}원
              </p>
            </div>
          </div>

          {/* 지출 항목 리스트 */}
          <div className="flex flex-col gap-5">
            {expenseItems.map((item, index) => (
              <div key={index} className="flex flex-col gap-[5px]">
                <div className="flex items-center justify-between">
                  <p className="text-[18px] font-semibold leading-[1.5] tracking-[-0.45px] text-[#27282C]">
                    {item.category}
                  </p>
                  <p className="text-[20px] font-semibold leading-[1.5] tracking-[-0.5px] text-[#030303]">
                    {item.amount.toLocaleString()}원
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[16px] font-medium leading-[1.5] tracking-[-0.4px] text-[#13278A]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-[12px] font-medium leading-[1.5] tracking-[-0.3px] text-[#9FA4A8]">
                    {item.paymentMethod}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
