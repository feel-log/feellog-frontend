'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { getDailyExpense } from '@/shared/constants/dailyExpense';
import PageHeader from '@/shared/ui/PageHeader';
import SortButton from '@/shared/ui/SortButton';
import { useFormattedDate } from '@/shared/hooks';

type SortType = 'latest' | 'oldest' | 'expensive' | 'cheap';

const TODAY = '2026-04-21';

interface ExpenseItem {
  name: string;
  category: string;
  amount: number;
  emotions: Array<{ emoji: string; label: string }>;
  memo?: string;
  paymentMethod: string;
  tag: string[];
}

export default function ExportContent() {
  const searchParams = useSearchParams();
  const [sortType, setSortType] = useState<SortType>('latest');

  const selectedDate = searchParams?.get('date') || TODAY;
  const expenseData = getDailyExpense(selectedDate);
  const totalAmount = expenseData?.totalAmount ?? 0;

  const formattedDate = useFormattedDate(selectedDate, {
    year: undefined,
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  const getExpenses = (): ExpenseItem[] => {
    if (!expenseData || expenseData.categories.length === 0) return [];

    const items: ExpenseItem[] = expenseData.categories.map((category, idx) => ({
      name: category.name,
      category: category.name,
      amount: category.amount,
      emotions: category.emotions,
      tag: category.tag,
      memo: category.memo,
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
      <PageHeader title="오늘의 지출 비용" />

      {/* 합계 섹션 */}
      <div className="border-b-[5px] border-[#f7f8fa] px-4 pt-5 pb-3.75">
        <p className="text-[18px] font-semibold tracking-[-0.025em] text-[#27282c]">지출</p>
        <p className="text-[28px] font-semibold tracking-[-0.025em] text-[#eb1c1c]">
          {totalAmount.toLocaleString()}원
        </p>
      </div>

      {/* 정렬 셀렉터 + 본문 */}
      <div className="px-4 pt-5">
        <div className="flex justify-end">
          <SortButton sortType={sortType} onSortChange={setSortType} />
        </div>

        {totalAmount === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <h3 className="mb-1 text-[18px] font-semibold tracking-[-0.025em] text-[#474c52]">
              지출 기록이 아직 없어요
            </h3>
            <p className="text-[14px] font-medium tracking-[-0.025em] text-[#9fa4a8]">
              오늘의 소비와 감정을 함께 기록해보세요
            </p>
          </div>
        ) : (
          <>
            {/* 날짜 라벨 */}
            <p className="mb-2.5 text-[14px] font-medium tracking-[-0.025em] text-[#474c52]">
              {formattedDate}
            </p>

            {/* 항목 리스트 */}
            <div className="flex flex-col gap-5">
              {expenses.map((expense, idx) => (
                <div key={idx} className="flex flex-col gap-1.25">
                  {/* 카테고리명 + 금액 */}
                  <div className="flex items-center justify-between">
                    <h4 className="text-[18px] font-semibold tracking-[-0.025em] text-[#27282c]">
                      {expense.name}
                    </h4>
                    <p className="text-[20px] font-semibold tracking-[-0.025em] text-[#030303]">
                      {expense.amount.toLocaleString()}원
                    </p>
                  </div>

                  {/* 태그 + 감정 + 결제수단 */}
                  <div className="flex items-center justify-between gap-1.25">
                    <div className="flex items-center gap-2">
                      {expense.tag && expense.tag.length > 0 && (
                        <div className="flex items-center gap-1.5">
                          {expense.tag.map((tag, tagIdx) => (
                            <span
                              key={tagIdx}
                              className="text-[16px] font-medium tracking-[-0.025em] text-[#13278a]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      {expense.emotions.length > 0 && (
                        <>
                          <span className="h-3.5 w-px shrink-0 bg-[#e5e5e5]" />
                          <div className="flex items-center gap-1.5">
                            {expense.emotions.map((emotion) => (
                              <Image
                                key={emotion.label}
                                src={emotion.emoji}
                                alt={emotion.label}
                                width={20}
                                height={20}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                    <span className="text-[16px] font-medium tracking-[-0.025em] text-[#9fa4a8]">
                      {expense.paymentMethod}
                    </span>
                  </div>

                  {/* 메모 */}
                  {expense.memo && (
                    <span className="text-[16px] font-medium tracking-[-0.025em] text-[#9fa4a8]">
                      {expense.memo}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
