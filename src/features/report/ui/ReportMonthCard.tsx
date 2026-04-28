'use client';

import { useState } from 'react';
import MonthPickerBottomSheet, { type YearMonth } from './MonthPickerBottomSheet';

interface ReportMonthCardProps {
  year: number;
  month: number;
  income: number;
  expense: number;
  onYearMonthChange: (yearMonth: YearMonth) => void;
  onExpenseDetailClick?: () => void;
}

export default function ReportMonthCard({
  year,
  month,
  income,
  expense,
  onYearMonthChange,
  onExpenseDetailClick,
}: ReportMonthCardProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [pendingYear, setPendingYear] = useState(year);
  const [pendingMonth, setPendingMonth] = useState(month);

  const hasExpense = expense > 0;
  const isEmpty = income === 0 && expense === 0;
  const currentSystemYear = new Date().getFullYear();
  const monthLabel =
    year === currentSystemYear ? `${month}월` : `${year}년 ${month}월`;

  const handleOpenPicker = () => {
    setPendingYear(year);
    setPendingMonth(month);
    setIsPickerOpen(true);
  };

  const handleChange = (ym: YearMonth) => {
    setPendingYear(ym.year);
    setPendingMonth(ym.month);
  };

  const handleConfirm = () => {
    onYearMonthChange({ year: pendingYear, month: pendingMonth });
    setIsPickerOpen(false);
  };

  return (
    <>
      <div className="flex flex-col gap-3">
        <button
          onClick={handleOpenPicker}
          className="flex w-fit items-center gap-0.5"
          aria-expanded={isPickerOpen}
        >
          <span className="text-[20px] font-semibold leading-normal tracking-[-0.5px] text-[#030303]">
            {monthLabel}
          </span>
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            className={`transition-transform ${isPickerOpen ? 'rotate-180' : ''}`}
          >
            <path
              d="M5 7.5L10 12.5L15 7.5"
              stroke="#73787E"
              strokeWidth="1.33"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div className="flex flex-col gap-4.5 rounded-[12px] border border-[#F0F0F0] bg-[#F7F8FA] p-4">
          <div className="flex flex-col">
            <div className="flex items-center justify-between">
              <span className="text-[18px] font-medium leading-normal tracking-[-0.45px] text-[#474C52]">
                수입
              </span>
              <span className="text-[24px] font-semibold leading-normal tracking-[-0.6px] text-[#030303]">
                {income.toLocaleString()}원
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[18px] font-medium leading-normal tracking-[-0.45px] text-[#474C52]">
                지출
              </span>
              <span
                className={`text-[24px] font-semibold leading-normal tracking-[-0.6px] ${
                  hasExpense ? 'text-[#EB1C1C]' : 'text-[#030303]'
                }`}
              >
                {expense.toLocaleString()}원
              </span>
            </div>
          </div>

          <button
            onClick={onExpenseDetailClick}
            className="flex h-11 w-full items-center justify-center rounded-[8px] bg-white shadow-[0px_0px_4px_rgba(19,39,138,0.08)]"
          >
            <span className="text-[16px] font-medium leading-normal tracking-[-0.4px] text-[#27282C]">
              {isEmpty ? '지출 기록하기' : '이번 달 지출 확인하기'}
            </span>
          </button>
        </div>
      </div>

      <MonthPickerBottomSheet
        isOpen={isPickerOpen}
        selectedYear={pendingYear}
        selectedMonth={pendingMonth}
        onChange={handleChange}
        onConfirm={handleConfirm}
        onClose={() => setIsPickerOpen(false)}
      />
    </>
  );
}
