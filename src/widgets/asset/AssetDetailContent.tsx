'use client';

import { useState } from 'react';
import PageHeader from '@/shared/ui/PageHeader';
import Footer from '@/shared/ui/Footer';
import SortButton, { SortType } from '@/shared/ui/SortButton';
import { getAssetCategory } from '@/shared/constants/assetData';

interface AssetDetailContentProps {
  categoryId: string;
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'] as const;

function formatRecordDate(date: string): string {
  const [monthStr, dayStr] = date.split('.');
  const month = Number(monthStr);
  const day = Number(dayStr);
  if (Number.isNaN(month) || Number.isNaN(day)) return date;
  const year = new Date().getFullYear();
  const weekday = WEEKDAYS[new Date(year, month - 1, day).getDay()];
  return `${month}월 ${day}일 ${weekday}요일`;
}

export default function AssetDetailContent({ categoryId }: AssetDetailContentProps) {
  const category = getAssetCategory(categoryId);
  const [sortType, setSortType] = useState<SortType>('latest');

  if (!category) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-[14px] text-[#9FA4A8]">
          자산 카테고리를 찾을 수 없습니다. (categoryId: {categoryId})
        </p>
      </div>
    );
  }

  const getSortedRecords = () => {
    const records = [...category.records];
    switch (sortType) {
      case 'expensive':
        return records.sort((a, b) => b.amount - a.amount);
      case 'cheap':
        return records.sort((a, b) => a.amount - b.amount);
      case 'oldest':
        return records.reverse();
      case 'latest':
      default:
        return records;
    }
  };

  const records = getSortedRecords();

  return (
    <div className="flex min-h-screen flex-col bg-white pb-30">
      <PageHeader title="자산" backHref="/asset" />

      {/* 카테고리 합계 */}
      <div className="flex flex-col gap-1.25 border-b-[5px] border-[#F7F8FA] px-4 pb-3.75">
        <p className="text-[18px] font-semibold leading-normal tracking-[-0.45px] text-[#27282C]">
          {category.label}
        </p>
        <p className="text-[28px] font-semibold leading-normal tracking-[-0.7px] text-[#030303]">
          {category.total.toLocaleString()}원
        </p>
      </div>

      <div className="px-4 pt-5">
        <div className="flex justify-end">
          <SortButton sortType={sortType} onSortChange={setSortType} />
        </div>

        {records.length === 0 ? (
          <div className="flex flex-col items-center pt-44">
            <p className="text-[18px] font-semibold leading-normal tracking-[-0.45px] text-[#474C52]">
              아직 등록된 자산이 없어요
            </p>
            <p className="text-[14px] font-medium leading-normal tracking-[-0.35px] text-[#9FA4A8]">
              자산을 등록하고 한눈에 관리해보세요.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {records.map((record, idx) => (
              <div key={idx} className="flex flex-col gap-0.75">
                <div className="flex items-center justify-between">
                  <p className="text-[16px] font-medium leading-normal tracking-[-0.4px] text-[#474C52]">
                    {formatRecordDate(record.date)}
                  </p>
                  <p className="text-[20px] font-semibold leading-normal tracking-[-0.5px] text-[#030303]">
                    {record.amount.toLocaleString()}원
                  </p>
                </div>
                {record.memo && (
                  <p className="text-right text-[14px] font-medium leading-normal tracking-[-0.35px] text-[#9FA4A8]">
                    {record.memo}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
