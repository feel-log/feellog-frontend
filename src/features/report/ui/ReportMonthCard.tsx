'use client';

import { useEffect, useRef, useState } from 'react';

interface ReportMonthCardProps {
  month: number;
  income: number;
  expense: number;
  onMonthChange: (month: number) => void;
}

const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

export default function ReportMonthCard({
  month,
  income,
  expense,
  onMonthChange,
}: ReportMonthCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (m: number) => {
    onMonthChange(m);
    setIsOpen(false);
  };

  const hasExpense = expense > 0;

  return (
    <div className="flex h-22 w-full items-center gap-3.75 rounded-[12px] border border-[#F0F0F0] bg-[#F7F8FA] px-4 py-3.5">

      <div ref={dropdownRef} className="relative">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex items-center gap-1.25"
          aria-expanded={isOpen}
        >
          <span className="text-[28px] font-semibold leading-normal tracking-[-0.7px] text-[#030303]">
            {month}월
          </span>
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
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

        {isOpen && (
          <ul className="absolute left-0 top-full z-20 mt-1 max-h-60 w-25 overflow-y-auto rounded-lg border border-[#E5E5E5] bg-white py-1 shadow-lg">
            {MONTHS.map((m) => (
              <li key={m}>
                <button
                  onClick={() => handleSelect(m)}
                  className={`w-full px-4 py-2 text-left text-[16px] font-medium tracking-[-0.4px] hover:bg-[#F7F8FA] ${
                    m === month
                      ? 'text-[#13278A] font-semibold'
                      : 'text-[#474C52]'
                  }`}
                >
                  {m}월
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex flex-1 items-center gap-5">
        <div className="h-11.25 w-0.5 bg-[#E5E5E5]" />

        <div className="flex flex-1 flex-col justify-between gap-0">
        <div className="flex items-center gap-3.75">
          <span className="w-7 text-center text-[16px] font-medium leading-normal tracking-[-0.4px] text-[#474C52]">
            수입
          </span>
          <span className="flex-1 text-right text-[20px] font-semibold leading-normal tracking-[-0.5px] text-[#030303]">
            {income.toLocaleString()}원
          </span>
        </div>
        <div className="flex items-center gap-3.75">
          <span className="w-7 text-center text-[16px] font-medium leading-normal tracking-[-0.4px] text-[#474C52]">
            지출
          </span>
          <span
            className={`flex-1 text-right text-[20px] font-semibold leading-normal tracking-[-0.5px] ${
              hasExpense ? 'text-[#EB1C1C]' : 'text-[#030303]'
            }`}
          >
            {expense.toLocaleString()}원
          </span>
        </div>
      </div>
      </div>
    </div>
  );
}
