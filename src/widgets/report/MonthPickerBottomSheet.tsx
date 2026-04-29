'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';

const ITEM_HEIGHT = 40;
const VISIBLE_BUFFER = 3;
const SPACER_HEIGHT = ITEM_HEIGHT * VISIBLE_BUFFER;
const CONTAINER_HEIGHT = ITEM_HEIGHT * (VISIBLE_BUFFER * 2 + 1);
const ANIMATION_DURATION = 300;
const SELECTABLE_MONTHS = 36;

export interface YearMonth {
  year: number;
  month: number;
}

interface MonthPickerBottomSheetProps {
  isOpen: boolean;
  selectedYear: number;
  selectedMonth: number;
  onChange: (yearMonth: YearMonth) => void;
  onConfirm: () => void;
  onClose: () => void;
}

function getRange() {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;
  const startDate = new Date(currentYear, currentMonth - 1 - (SELECTABLE_MONTHS - 1), 1);
  return {
    currentYear,
    currentMonth,
    startYear: startDate.getFullYear(),
    startMonth: startDate.getMonth() + 1,
  };
}

function generateYearList(): number[] {
  const { currentYear, startYear } = getRange();
  const result: number[] = [];
  for (let y = startYear; y <= currentYear; y++) result.push(y);
  return result;
}

function isYearMonthDisabled(year: number, month: number): boolean {
  const { currentYear, currentMonth, startYear, startMonth } = getRange();
  if (year < startYear || year > currentYear) return true;
  if (year === currentYear && month > currentMonth) return true;
  if (year === startYear && month < startMonth) return true;
  return false;
}

export default function MonthPickerBottomSheet({
  isOpen,
  selectedYear,
  selectedMonth,
  onChange,
  onConfirm,
  onClose,
}: MonthPickerBottomSheetProps) {
  const yearScrollRef = useRef<HTMLDivElement>(null);
  const monthScrollRef = useRef<HTMLDivElement>(null);
  const isProgrammaticYearScroll = useRef(false);
  const isProgrammaticMonthScroll = useRef(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [yearIndex, setYearIndex] = useState(0);
  const [monthIndex, setMonthIndex] = useState(0);

  const yearList = useMemo(() => generateYearList(), []);
  const monthList = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);

  const initialYearIndex = useMemo(
    () => Math.max(0, yearList.indexOf(selectedYear)),
    [yearList, selectedYear],
  );
  const initialMonthIndex = useMemo(
    () => Math.max(0, monthList.indexOf(selectedMonth)),
    [monthList, selectedMonth],
  );

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => setIsVisible(true));
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    if (yearScrollRef.current) {
      isProgrammaticYearScroll.current = true;
      yearScrollRef.current.scrollTop = initialYearIndex * ITEM_HEIGHT;
      setYearIndex(initialYearIndex);
      setTimeout(() => {
        isProgrammaticYearScroll.current = false;
      }, 100);
    }
    if (monthScrollRef.current) {
      isProgrammaticMonthScroll.current = true;
      monthScrollRef.current.scrollTop = initialMonthIndex * ITEM_HEIGHT;
      setMonthIndex(initialMonthIndex);
      setTimeout(() => {
        isProgrammaticMonthScroll.current = false;
      }, 100);
    }
  }, [isOpen, initialYearIndex, initialMonthIndex]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
      onClose();
    }, ANIMATION_DURATION);
  };

  const handleConfirm = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
      onConfirm();
    }, ANIMATION_DURATION);
  };

  const handleYearScroll = () => {
    if (!yearScrollRef.current || isProgrammaticYearScroll.current) return;
    const idx = Math.round(yearScrollRef.current.scrollTop / ITEM_HEIGHT);
    if (idx < 0 || idx >= yearList.length) return;
    setYearIndex(idx);
    const newYear = yearList[idx];
    const newMonth = monthList[monthIndex];
    if (!isYearMonthDisabled(newYear, newMonth)) {
      onChange({ year: newYear, month: newMonth });
    }
  };

  const handleMonthScroll = () => {
    if (!monthScrollRef.current || isProgrammaticMonthScroll.current) return;
    const idx = Math.round(monthScrollRef.current.scrollTop / ITEM_HEIGHT);
    if (idx < 0 || idx >= monthList.length) return;
    setMonthIndex(idx);
    const newYear = yearList[yearIndex];
    const newMonth = monthList[idx];
    if (!isYearMonthDisabled(newYear, newMonth)) {
      onChange({ year: newYear, month: newMonth });
    }
  };

  const getStyleByDistance = (distance: number): string => {
    const sizeClass =
      distance === 0
        ? 'text-[22px] font-semibold tracking-[-0.55px]'
        : distance === 1
          ? 'text-[20px] font-semibold tracking-[-0.5px]'
          : 'text-[18px] font-medium tracking-[-0.45px]';

    const colorClass =
      distance === 0
        ? 'text-[#1C1D1F]'
        : distance === 1
          ? 'text-[#474C52]'
          : distance === 2
            ? 'text-[#9FA4A8]'
            : distance === 3
              ? 'text-[#CACDD2]'
              : 'text-transparent';

    return `${colorClass} ${sizeClass}`;
  };

  if (!isOpen) return null;

  const isShowing = isVisible && !isClosing;
  const centeredYear = yearList[yearIndex];
  const centeredMonth = monthList[monthIndex];
  const isCenteredDisabled =
    centeredYear === undefined ||
    centeredMonth === undefined ||
    isYearMonthDisabled(centeredYear, centeredMonth);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      onClick={handleClose}
    >
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
          isShowing ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative flex w-full max-w-md flex-col rounded-t-[20px] bg-white transition-transform duration-300 ease-out ${
          isShowing ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="flex items-center justify-between px-4 pt-10 pb-2">
          <h2 className="text-[20px] font-semibold leading-normal tracking-[-0.5px] text-[#27282C]">
            날짜 설정
          </h2>
          <button onClick={handleClose} aria-label="닫기">
            <Image src="/svg/icon_X_dark.svg" alt="" width={28} height={28} />
          </button>
        </div>

        <div className="relative mx-4 mt-13.5">
          <div
            className="pointer-events-none absolute left-0 right-0 top-1/2 h-8.75 -translate-y-1/2 rounded-[50px] bg-[#ECF2FB]"
          />

          <div className="relative flex justify-center gap-9.75">
            <div
              ref={yearScrollRef}
              onScroll={handleYearScroll}
              className="overflow-y-scroll snap-y snap-mandatory [&::-webkit-scrollbar]:hidden"
              style={{
                height: CONTAINER_HEIGHT,
                scrollbarWidth: 'none',
              }}
            >
              <div style={{ height: SPACER_HEIGHT }} />
              {yearList.map((y, i) => {
                const distance = Math.abs(i - yearIndex);
                return (
                  <div
                    key={y}
                    className={`flex w-18 snap-center items-center justify-center leading-normal ${getStyleByDistance(distance)}`}
                    style={{ height: ITEM_HEIGHT }}
                  >
                    {y}년
                  </div>
                );
              })}
              <div style={{ height: SPACER_HEIGHT }} />
            </div>

            <div
              ref={monthScrollRef}
              onScroll={handleMonthScroll}
              className="overflow-y-scroll snap-y snap-mandatory [&::-webkit-scrollbar]:hidden"
              style={{
                height: CONTAINER_HEIGHT,
                scrollbarWidth: 'none',
              }}
            >
              <div style={{ height: SPACER_HEIGHT }} />
              {monthList.map((m, i) => {
                const distance = Math.abs(i - monthIndex);
                return (
                  <div
                    key={m}
                    className={`flex w-13 snap-center items-center justify-center leading-normal ${getStyleByDistance(distance)}`}
                    style={{ height: ITEM_HEIGHT }}
                  >
                    {m}월
                  </div>
                );
              })}
              <div style={{ height: SPACER_HEIGHT }} />
            </div>
          </div>
        </div>

        <div className="px-4.25 pt-6 pb-9">
          <button
            onClick={handleConfirm}
            disabled={isCenteredDisabled}
            className={`flex h-13.5 w-full items-center justify-center rounded-[10px] ${
              isCenteredDisabled ? 'bg-[#CACDD2]' : 'bg-[#13278A]'
            }`}
          >
            <span className="text-[20px] font-semibold leading-normal tracking-[-0.5px] text-white">
              확인
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
