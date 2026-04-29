'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { dailyExpenses, getDailyExpense } from '@/shared/constants/dailyExpense';
import { cn } from '@/shared/lib/utils';
import PageHeader from '@/shared/ui/PageHeader';
import SortButton from '@/shared/ui/SortButton';

type SortType = 'latest' | 'oldest' | 'expensive' | 'cheap';

const TODAY = '2026-04-21';

interface ExpenseItem {
  name: string;
  category: string;
  amount: number;
  emotions: Array<{ emoji: string; label: string }>;
  description?: string;
  paymentMethod: string;
  tag: string[];
}

export default function ExportContent() {
  const searchParams = useSearchParams();
  const [sortType, setSortType] = useState<SortType>('latest');

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
      tag: category.tag,
      paymentMethod: idx % 2 === 0 ? '카드' : '현금',
    }));

    switch (sortType) {
      case 'expensive':
        return [...items].sort((a, b) => b.amount - a.amount);
      case 'cheap':
        return [...items].sort((a, b) => a.amount - b.amount);
      case 'oldest':
        return [...items].reverse();
      case 'latest':
      default:
        return items;
    }
  };

  const expenses = getExpenses();

  return (
    <div>
      {/* Header */}
      <PageHeader title="오늘의 지출 비용" />

      {/* Content */}
      <div className="px-6 py-6">
        {/* Amount Section */}
        <div className="mb-8 border-b border-gray-200">
          <p className="mb-2 text-sm text-gray-600">지출</p>
          <h2
            className={`pb-4 text-2xl font-bold ${totalAmount > 0 ? 'text-red-600' : 'text-gray-800'}`}
          >
            {totalAmount.toLocaleString()}원
          </h2>
        </div>

        {/* Sort Button */}
        <SortButton sortType={sortType} onSortChange={setSortType} />

        {/* Expense List or Empty State */}
        {totalAmount === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <h3 className="mb-1 text-[16px] font-medium text-gray-800">지출 기록이 아직 없어요</h3>
            <p className="mb-6 text-[12px] text-gray-500">오늘의 소비와 감정을 함께 기록해보세요</p>
          </div>
        ) : (
          <div className="space-y-6">
            {expenses.map((expense, idx) => (
              <div key={idx} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{expense.name}</h4>
                    <div className={"flex items-center"}>
                      <div className="mt-2 flex flex-wrap gap-3 pr-2 relative after:content-[''] after:absolute after:top-0 after:bottom-0 after:right-0 after:my-auto after:w-0.5 after:h-3.5 after:bg-gray-200">
                        {expense.tag?.map((tag, tagIdx) => (
                          <span
                            key={tagIdx}
                            className="inline-flex items-center py-1 text-[16px] text-[#13278a]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className={"mt-2 pl-2 flex items-center gap-1.5"}>
                        {expense.emotions.map((emotion, emoIdx) => (
                            <Image key={emotion.label} src={emotion.emoji} alt={emotion.label} width={24} height={24} />
                          ))}
                      </div>
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
