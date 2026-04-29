'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/shared/lib/utils';
import PageHeader from '@/shared/ui/PageHeader';
import Footer from '@/shared/ui/Footer';
import { getAssetCategory, AssetRecord } from '@/shared/constants/assetData';

type SortType = 'latest' | 'expensive' | 'cheap';

interface AssetDetailContentProps {
  categoryId: string;
}

export default function AssetDetailContent({ categoryId }: AssetDetailContentProps) {
  const category = getAssetCategory(categoryId);
  const [sortType, setSortType] = useState<SortType>('latest');
  const [showSortMenu, setShowSortMenu] = useState(false);

  if (!category) {
    console.log('Category not found. CategoryId:', categoryId);
    console.log('Available categories:', ['savings', 'investment', 'insurance', 'etc']);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">자산 카테고리를 찾을 수 없습니다. (categoryId: {categoryId})</p>
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
      case 'latest':
      default:
        return records;
    }
  };

  const records = getSortedRecords();

  return (
    <div className="min-h-screen flex flex-col pb-32 bg-white">
      {/* Header */}
      <PageHeader title="자산" />

      {/* Category Info */}
      <div className="px-6 py-6 border-b border-gray-200">
        <p className="mb-2 text-sm text-gray-600">{category.label}</p>
        <h2 className="text-2xl font-bold text-gray-800">
          {category.total.toLocaleString()}원
        </h2>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-6">
        {/* Sort Button */}
        <div className="relative mb-8 flex justify-end">
          <div
            className={cn(
              'button__wrapper w-33 relative',
              showSortMenu ? 'rounded-[8px] border border-gray-200' : ''
            )}
          >
            <button
              onClick={() => setShowSortMenu(!showSortMenu)}
              className={cn(
                'flex w-full items-center justify-between px-2 py-2 text-[14px] bg-white',
                showSortMenu ? 'border-b border-gray-200' : 'rounded-[8px] border border-gray-200'
              )}
            >
              {sortType === 'latest' ? '최신순' : sortType === 'expensive' ? '금액 높은 순' : '금액 낮은 순'}
              <Image
                src={'/svg/icon_arrow_bottom.svg'}
                alt={'icon__bottom'}
                width={14}
                height={14}
              />
            </button>

            {showSortMenu && (
              <div className={'show__sort__menu flex flex-col absolute left-0 right-0 top-full bg-white z-10'}>
                <button
                  onClick={() => {
                    setSortType('latest');
                    setShowSortMenu(false);
                  }}
                  className={cn('text-[14px] py-2 px-5 border-b border-gray-200 text-left', {
                    'text-blue-600 font-semibold': sortType === 'latest',
                  })}
                >
                  최신순
                </button>
                <button
                  onClick={() => {
                    setSortType('expensive');
                    setShowSortMenu(false);
                  }}
                  className={cn('text-[14px] py-2 px-5 border-b border-gray-200 text-left', {
                    'text-blue-600 font-semibold': sortType === 'expensive',
                  })}
                >
                  금액 높은 순
                </button>
                <button
                  onClick={() => {
                    setSortType('cheap');
                    setShowSortMenu(false);
                  }}
                  className={cn('text-[14px] py-2 px-5 text-left', {
                    'text-blue-600 font-semibold': sortType === 'cheap',
                  })}
                >
                  금액 낮은 순
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Records List or Empty State */}
        {records.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <h3 className="mb-2 text-lg font-medium text-gray-800">등록된 거래가 없어요</h3>
            <p className="text-sm text-gray-500">거래를 추가해보세요</p>
          </div>
        ) : (
          <div className="space-y-6">
            {records.map((record, idx) => (
              <div key={idx} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-700">{record.date}</p>
                    {record.memo && (
                      <p className="mt-1 text-xs text-gray-500">{record.memo}</p>
                    )}
                  </div>
                  <p className="font-bold text-gray-900">{record.amount.toLocaleString()}원</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
