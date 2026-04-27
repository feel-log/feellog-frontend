'use client';

import { useEffect, useState } from 'react';

interface ExpenseItem {
  category: string;
  tags: string[];
  amount: number;
  paymentMethod: string;
  memo?: string;
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
  const dateLabel = `${month + 1}월 ${date}일 ${dayOfWeek}요일`;
  const isEmpty = expenseItems.length === 0 && income === 0 && expense === 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      onClick={handleClose}
    >
      <div
        className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
      />

      <div
        className={`relative flex w-full max-w-md flex-col rounded-t-[20px] bg-white px-4 pt-10 transition-transform duration-300 ease-out ${
          isEmpty ? 'h-107.25' : 'max-h-[calc(100dvh-89px)] pb-10'
        } ${isOpen && !isClosing ? 'translate-y-0' : 'translate-y-full'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <p className="text-[18px] font-medium leading-normal tracking-[-0.45px] text-[#27282C]">
            {dateLabel}
          </p>
          <button onClick={handleClose} className="size-7" aria-label="닫기">
            <img src="/icons/icon_X.svg" alt="" width={28} height={28} />
          </button>
        </div>

        {isEmpty ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-0 pb-10">
            <p className="text-[18px] font-semibold leading-normal tracking-[-0.45px] text-[#474C52]">
              지출 기록이 아직 없어요
            </p>
            <p className="text-[14px] font-medium leading-normal tracking-[-0.35px] text-[#9FA4A8]">
              오늘의 소비와 감정을 함께 기록해보세요
            </p>
          </div>
        ) : (
          <div className="mt-5 flex flex-col gap-5 overflow-y-auto">
            <div className="flex flex-col gap-1.25">
              <p className="text-[18px] font-semibold leading-normal tracking-[-0.45px] text-[#27282C]">
                수입
              </p>
              <p className="text-[24px] font-semibold leading-normal tracking-[-0.6px] text-[#030303]">
                {income.toLocaleString()}원
              </p>
            </div>

            <div className="flex flex-col gap-1.25">
              <p className="text-[18px] font-semibold leading-normal tracking-[-0.45px] text-[#27282C]">
                지출
              </p>
              <div className="flex items-center border-b border-[#E5E5E5] pb-3.75">
                <p className="text-[24px] font-semibold leading-normal tracking-[-0.6px] text-[#EB1C1C]">
                  {expense.toLocaleString()}원
                </p>
              </div>
            </div>

            {/* 지출 항목 리스트 */}
            <div className="flex flex-col gap-5">
              {expenseItems.map((item, index) => (
                <div key={index} className="flex flex-col gap-0.75">
                  <div className="flex items-center justify-between">
                    <p className="text-[18px] font-semibold leading-normal tracking-[-0.45px] text-[#27282C]">
                      {item.category}
                    </p>
                    <p className="text-[20px] font-semibold leading-normal tracking-[-0.5px] text-[#030303]">
                      {item.amount.toLocaleString()}원
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[16px] font-medium leading-normal tracking-[-0.4px] text-[#13278A]"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <p className="text-[16px] font-medium leading-normal tracking-[-0.4px] text-[#9FA4A8]">
                      {item.paymentMethod}
                    </p>
                  </div>
                  {item.memo && (
                    <p className="text-[16px] font-medium leading-normal tracking-[-0.4px] text-[#9FA4A8]">
                      {item.memo}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
