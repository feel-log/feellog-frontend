'use client';

import { useState } from 'react';
import PageHeader from '@/shared/ui/PageHeader';
import Footer from '@/shared/ui/Footer';
import SortButton, { SortType } from '@/shared/ui/SortButton';
import { ASSET_CATEGORIES } from '@/shared/constants/assetData';
import { useGetAssets } from '@/entities/get-assets/useGetAssets';

interface AssetDetailContentProps {
  categoryId: string;
}

const CATEGORY_ID_MAP: Record<string, number> = {
  salary: 1,
  allowance: 2,
  side: 3,
  bonus: 4,
  finance: 5,
  etc: 6,
};

const SORT_MAPPING: Record<SortType, 'LATEST' | 'AMOUNT_ASC' | 'AMOUNT_DESC'> = {
  latest: 'LATEST',
  expensive: 'AMOUNT_DESC',
  cheap: 'AMOUNT_ASC',
  oldest: 'LATEST',
};

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'] as const;

function formatRecordDate(date: string): string {
  const [year, month, day] = date.split('-').map(Number);
  const weekday = WEEKDAYS[new Date(year, month - 1, day).getDay()];
  return `${month}월 ${day}일 ${weekday}요일`;
}

export default function AssetDetailContent({ categoryId }: AssetDetailContentProps) {
  const category = ASSET_CATEGORIES.find(cat => cat.id === categoryId);
  const apiCategoryId = CATEGORY_ID_MAP[categoryId];
  const [sortType, setSortType] = useState<SortType>('latest');

  const { data: assetsData, isLoading } = useGetAssets({
    categoryId: apiCategoryId,
    sort: SORT_MAPPING[sortType],
    page: 0,
    size: 100,
  });

  if (!category) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-[14px] text-[#9FA4A8]">
          자산 카테고리를 찾을 수 없습니다. (categoryId: {categoryId})
        </p>
      </div>
    );
  }

  const records = assetsData?.data ?? [];
  const totalAmount = assetsData?.totalAmount ?? 0;

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-white pb-30">
        <PageHeader title="자산" backHref="/asset" />

        <div className="flex flex-col gap-1.25 border-b-[5px] border-[#F7F8FA] px-4 pb-3.75">
          <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
          <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mt-2" />
        </div>

        <div className="px-4 pt-5">
          <div className="h-8 w-20 bg-gray-200 rounded animate-pulse mb-8" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between mb-5">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
              <div className="h-6 w-28 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white pb-30">
      <PageHeader title="자산" backHref="/asset" />

      {/* 카테고리 합계 */}
      <div className="flex flex-col gap-1.25 border-b-[5px] border-[#F7F8FA] px-4 pb-3.75">
        <p className="text-[18px] font-semibold leading-normal tracking-[-0.45px] text-[#27282C]">
          {category.label}
        </p>
        <p className="text-[28px] font-semibold leading-normal tracking-[-0.7px] text-[#030303]">
          {totalAmount.toLocaleString()}원
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
          <div className="flex flex-col gap-5 mt-4">
            {records.map((record, idx) => (
              <div key={idx} className="flex flex-col gap-0.75">
                <div className="flex items-center justify-between">
                  <p className="text-[16px] font-medium leading-normal tracking-[-0.4px] text-[#474C52]">
                    {formatRecordDate(record.assetDate)}
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
