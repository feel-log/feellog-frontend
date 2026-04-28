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

function generateAllMonths(): YearMonth[] {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;

  const startDate = new Date(currentYear, currentMonth - 1 - (SELECTABLE_MONTHS - 1), 1);
  const startYear = startDate.getFullYear();
  const startMonth = startDate.getMonth() + 1;

  const result: YearMonth[] = [];
  let y = startYear;
  let m = startMonth;
  while (y < currentYear || (y === currentYear && m <= 12)) {
    result.push({ year: y, month: m });
    if (m === 12) {
      m = 1;
      y++;
    } else {
      m++;
    }
  }
  return result;
}

function isMonthDisabled(ym: YearMonth): boolean {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;
  return (
    ym.year > currentYear ||
    (ym.year === currentYear && ym.month > currentMonth)
  );
}

export default function MonthPickerBottomSheet({
  isOpen,
  selectedYear,
  selectedMonth,
  onChange,
  onConfirm,
  onClose,
}: MonthPickerBottomSheetProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isProgrammaticScroll = useRef(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [centeredIndex, setCenteredIndex] = useState(0);

  const months = useMemo(() => generateAllMonths(), []);
  const currentSystemYear = new Date().getFullYear();

  const selectedIndex = useMemo(
    () => months.findIndex((m) => m.year === selectedYear && m.month === selectedMonth),
    [months, selectedYear, selectedMonth],
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
    if (!isOpen || !scrollRef.current || selectedIndex < 0) return;
    isProgrammaticScroll.current = true;
    scrollRef.current.scrollTop = selectedIndex * ITEM_HEIGHT;
    setCenteredIndex(selectedIndex);
    setTimeout(() => {
      isProgrammaticScroll.current = false;
    }, 100);
  }, [isOpen, selectedIndex]);

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

  const handleScroll = () => {
    if (!scrollRef.current || isProgrammaticScroll.current) return;
    const scrollTop = scrollRef.current.scrollTop;
    const index = Math.round(scrollTop / ITEM_HEIGHT);
    const newYM = months[index];
    if (!newYM) return;
    setCenteredIndex(index);
    if (
      !isMonthDisabled(newYM) &&
      (newYM.year !== selectedYear || newYM.month !== selectedMonth)
    ) {
      onChange(newYM);
    }
  };

  const getColorByDistance = (distance: number, disabled: boolean): string => {
    if (disabled) return 'text-[#E5E5E5]';
    if (distance === 0) return 'text-[#1C1D1F]';
    if (distance === 1) return 'text-[#474C52]';
    if (distance === 2) return 'text-[#9FA4A8]';
    if (distance === 3) return 'text-[#CACDD2]';
    return 'text-transparent';
  };

  if (!isOpen) return null;

  const isShowing = isVisible && !isClosing;
  const centeredYM = months[centeredIndex];
  const isCenteredDisabled = centeredYM ? isMonthDisabled(centeredYM) : false;

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
          <h2 className="text-[18px] font-medium leading-normal tracking-[-0.45px] text-[#27282C]">
            월 설정
          </h2>
          <button onClick={handleClose} aria-label="닫기">
            <Image src="/icons/icon_X.svg" alt="" width={28} height={28} />
          </button>
        </div>

        <div className="relative mx-4 mt-13.5">
          <div
            className="pointer-events-none absolute left-0 right-0 top-1/2 -translate-y-1/2 rounded-[41px] bg-[#F7F8FA]"
            style={{ height: ITEM_HEIGHT }}
          />

          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="relative overflow-y-scroll snap-y snap-mandatory [&::-webkit-scrollbar]:hidden"
            style={{
              height: CONTAINER_HEIGHT,
              scrollbarWidth: 'none',
            }}
          >
            <div style={{ height: SPACER_HEIGHT }} />

            {months.map((ym, i) => {
              const distance = Math.abs(i - centeredIndex);
              const disabled = isMonthDisabled(ym);
              const isSelected = distance === 0;
              const showYear = ym.year !== currentSystemYear;
              const label = showYear ? `${ym.year}년 ${ym.month}월` : `${ym.month}월`;
              return (
                <div
                  key={`${ym.year}-${ym.month}`}
                  className={`flex snap-center items-center justify-center ${getColorByDistance(distance, disabled)} ${
                    isSelected
                      ? 'text-[20px] font-semibold tracking-[-0.5px]'
                      : 'text-[18px] font-medium tracking-[-0.45px]'
                  } leading-normal`}
                  style={{ height: ITEM_HEIGHT }}
                >
                  {label}
                </div>
              );
            })}

            <div style={{ height: SPACER_HEIGHT }} />
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
