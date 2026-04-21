'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { getDailyExpense } from '@/shared/constants/dailyExpense';

type SortType = 'latest' | 'expensive' | 'cheap';

const TODAY = '2026-04-21';

interface ExpenseItem {
  name: string;
  category: string;
  amount: number;
  emotions: Array<{ emoji: string; label: string }>;
  description?: string;
  paymentMethod: string;
}

export default function ExportContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sortType, setSortType] = useState<SortType>('latest');
  const [showSortMenu, setShowSortMenu] = useState(false);

  const selectedDate = searchParams?.get('date') || TODAY;
  const expenseData = getDailyExpense(selectedDate);
  const totalAmount = expenseData?.totalAmount ?? 0;

  const getExpenses = () => {
    if (!expenseData || expenseData.categories.length === 0) return [];

    const items: ExpenseItem[] = expenseData.categories.map((category, idx) => ({
      name: category.name,
      category: category.name,
      amount: category.amount,
      emotions: category.emotions,
      paymentMethod: idx % 2 === 0 ? '카드' : '현금',
    }));

    switch (sortType) {
      case 'expensive':
        return [...items].sort((a, b) => b.amount - a.amount);
      case 'cheap':
        return [...items].sort((a, b) => a.amount - b.amount);
      case 'latest':
      default:
        return items;
    }
  };

  const expenses = getExpenses();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 relative">
        <button
          onClick={() => router.back()}
          className="cursor-pointer text-gray-700 hover:text-black"
        >
          <Image src={'/svg/icon_arrow_right.svg'} alt="back" width={24} height={24} className={"rotate-180"} />
        </button>
        <h1 className="text-lg font-bold absolute left-1/2 -translate-x-1/2">오늘의 지출 비용</h1>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        {/* Amount Section */}
        <div className="mb-8 border-b border-gray-200">
          <p className="mb-2 text-sm text-gray-600">지출</p>
          <h2 className={`text-2xl font-bold pb-4 ${totalAmount > 0 ? 'text-red-600' : 'text-gray-800'}`}>
            {totalAmount.toLocaleString()}원
          </h2>
        </div>

        {/* Sort Button */}
        <div className="relative mb-8 flex justify-end">
          <button
            onClick={() => setShowSortMenu(!showSortMenu)}
            className="flex justify-center items-center w-25 gap-2 rounded-lg border border-gray-200 px-2 py-1 text-[13px] font-medium text-gray-500 hover:bg-gray-50"
          >
            전체
            <Image src={"/svg/icon_arrow_bottom.svg"} alt={"icon__bottom"} width={14} height={14} />
          </button>

          {showSortMenu && (
            <div className="absolute right-0 top-full mt-2 w-40 rounded-lg border border-gray-200 bg-white shadow-lg">
              <button
                onClick={() => {
                  setSortType('latest');
                  setShowSortMenu(false);
                }}
                className={`block w-full px-4 py-3 text-left text-sm ${
                  sortType === 'latest'
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                최신순
              </button>
              <button
                onClick={() => {
                  setSortType('expensive');
                  setShowSortMenu(false);
                }}
                className={`block w-full px-4 py-3 text-left text-sm ${
                  sortType === 'expensive'
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                금액 높은순
              </button>
              <button
                onClick={() => {
                  setSortType('cheap');
                  setShowSortMenu(false);
                }}
                className={`block w-full px-4 py-3 text-left text-sm ${
                  sortType === 'cheap'
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                금액 낮은순
              </button>
            </div>
          )}
        </div>

        {/* Expense List or Empty State */}
        {totalAmount === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <h3 className="mb-2 text-lg font-medium text-gray-800">지출 기록이 아직 없어요</h3>
            <p className="text-sm text-gray-500">오늘의 소비와 감정을 함께 기록해보세요</p>
          </div>
        ) : (
          <div className="space-y-6">
            {expenses.map((expense, idx) => (
              <div key={idx} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{expense.name}</h4>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {expense.emotions.map((emotion, emoIdx) => (
                        <span
                          key={emoIdx}
                          className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs"
                        >
                          <span>{emotion.emoji}</span>
                          <span className="text-gray-700">{emotion.label}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{expense.amount.toLocaleString()}원</p>
                    <p className="text-xs text-gray-500">{expense.paymentMethod}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
