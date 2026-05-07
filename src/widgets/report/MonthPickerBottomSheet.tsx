'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Picker from 'react-mobile-picker';

const ITEM_HEIGHT = 40;
const VISIBLE_BUFFER = 3;
const CONTAINER_HEIGHT = ITEM_HEIGHT * (VISIBLE_BUFFER * 2 + 1);
const ANIMATION_DURATION = 300;
const START_YEAR = 2023;
const START_MONTH = 1;

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
  return {
    currentYear: today.getFullYear(),
    currentMonth: today.getMonth() + 1,
    startYear: START_YEAR,
    startMonth: START_MONTH,
  };
}

function isYearMonthDisabled(year: number, month: number): boolean {
  const { currentYear, currentMonth, startYear, startMonth } = getRange();
  if (year < startYear || year > currentYear) return true;
  if (year === currentYear && month > currentMonth) return true;
  if (year === startYear && month < startMonth) return true;
  return false;
}

function getStyleByDistance(distance: number): string {
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
}

export default function MonthPickerBottomSheet({
  isOpen,
  selectedYear,
  selectedMonth,
  onChange,
  onConfirm,
  onClose,
}: MonthPickerBottomSheetProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isShowing, setIsShowing] = useState(false);

  const yearList = useMemo(() => {
    const { startYear, currentYear } = getRange();
    const result: number[] = [];
    for (let y = startYear; y <= currentYear; y++) result.push(y);
    return result;
  }, []);

  const monthList = useMemo(
    () => Array.from({ length: 12 }, (_, i) => i + 1),
    [],
  );

  const selectedYearIdx = yearList.indexOf(selectedYear);
  const selectedMonthIdx = monthList.indexOf(selectedMonth);

  const pickerValue = {
    year: String(selectedYear),
    month: String(selectedMonth),
  };

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      requestAnimationFrame(() => setIsShowing(true));
      document.body.style.overflow = 'hidden';
    } else if (isMounted) {
      setIsShowing(false);
      const timer = setTimeout(() => {
        setIsMounted(false);
      }, ANIMATION_DURATION);
      document.body.style.overflow = '';
      return () => clearTimeout(timer);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, isMounted]);

  const handleClose = () => {
    setIsShowing(false);
    setTimeout(() => onClose(), ANIMATION_DURATION);
  };

  const handlePickerChange = (newValue: { year: string; month: string }) => {
    onChange({
      year: Number(newValue.year),
      month: Number(newValue.month),
    });
  };

  const handleConfirm = () => {
    if (isYearMonthDisabled(selectedYear, selectedMonth)) return;
    setIsShowing(false);
    setTimeout(() => onConfirm(), ANIMATION_DURATION);
  };

  const isConfirmDisabled = isYearMonthDisabled(selectedYear, selectedMonth);

  if (!isMounted) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div
        className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${
          isShowing ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />

      <div
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
          <div className="pointer-events-none absolute left-0 right-0 top-1/2 h-8.75 -translate-y-1/2 rounded-[50px] bg-[#ECF2FB]" />

          <Picker
            value={pickerValue}
            onChange={handlePickerChange}
            wheelMode="natural"
            height={CONTAINER_HEIGHT}
            itemHeight={ITEM_HEIGHT}
            className="picker-no-divider bg-transparent!"
          >
            <Picker.Column name="year">
              {yearList.map((y, idx) => {
                const distance = Math.abs(idx - selectedYearIdx);
                return (
                  <Picker.Item key={y} value={String(y)}>
                    <span className={`select-none ${getStyleByDistance(distance)}`}>
                      {y}년
                    </span>
                  </Picker.Item>
                );
              })}
            </Picker.Column>
            <Picker.Column name="month">
              {monthList.map((m, idx) => {
                const distance = Math.abs(idx - selectedMonthIdx);
                return (
                  <Picker.Item key={m} value={String(m)}>
                    <span className={`select-none ${getStyleByDistance(distance)}`}>
                      {m}월
                    </span>
                  </Picker.Item>
                );
              })}
            </Picker.Column>
          </Picker>
        </div>

        <div className="px-4.25 pt-6 pb-9">
          <button
            onClick={handleConfirm}
            disabled={isConfirmDisabled}
            className={`flex h-13.5 w-full items-center justify-center rounded-[10px] ${
              isConfirmDisabled ? 'bg-[#CACDD2]' : 'bg-[#13278A]'
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
