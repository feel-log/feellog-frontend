'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import PageHeader from '@/shared/ui/PageHeader';
import SortButton from '@/shared/ui/SortButton';
import { useFormattedDate } from '@/shared/hooks';
import { useDailyExpend } from '@/entities/daily-expend/model/useDailyExpend';
import { DailyExpendType } from '@/entities/daily-expend/model/daily-expend-type';
import { EXPENSE_CATEGORIES, EMOTIONS } from '@/widgets/record/RecordContent';
import { PAYMENT_METHODS, SITUATION_TAGS } from '@/widgets/record/RecordContent';

type SortType = 'latest' | 'oldest' | 'expensive' | 'cheap';

interface ExpenseItem {
  expenseId: number;
  name: string;
  category: string;
  amount: number;
  emotions: Array<{ emoji: string; label: string }>;
  memo?: string;
  paymentMethod: string;
  tag: string[];
  expenseTime: string;
}

export default function ExportContent() {
  const searchParams = useSearchParams();
  const [sortType, setSortType] = useState<SortType>('latest');

  const selectedDate = searchParams?.get('date') || new Date().toISOString().split('T')[0];
  const [year, month, day] = selectedDate.split('-').map(Number);

  const { data = [], isLoading } = useDailyExpend(year, month, day);

  const formattedDate = useFormattedDate(selectedDate, {
    year: undefined,
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  const convertToExpenseItem = (expense: DailyExpendType): ExpenseItem => {
    const category = EXPENSE_CATEGORIES.flatMap((g) => g.items).find(
      (item) => item.id === expense.categoryId
    )?.label || '';

    const paymentMethod =
      PAYMENT_METHODS.find((m) => m.id === expense.paymentMethodId)?.name || '';

    const emotions = EMOTIONS.flatMap((g) => g.items)
      .filter((e) => expense.emotionIds.includes(e.id))
      .map((e) => ({ emoji: e.emoji, label: e.label }));

    const tags = SITUATION_TAGS.filter((t) => expense.situationTagIds.includes(t.id)).map(
      (t) => '#' + t.label
    );

    return {
      expenseId: expense.expenseId,
      name: category,
      category,
      amount: expense.amount,
      emotions,
      tag: tags,
      memo: expense.memo,
      paymentMethod,
      expenseTime: expense.expenseTime,
    };
  };

  const getExpenses = (): ExpenseItem[] => {
    const items = data.map(convertToExpenseItem);

    switch (sortType) {
      case 'expensive':
        return [...items].sort((a, b) => b.amount - a.amount);
      case 'cheap':
        return [...items].sort((a, b) => a.amount - b.amount);
      case 'oldest':
        return [...items].sort((a, b) => a.expenseTime.localeCompare(b.expenseTime));
      case 'latest':
      default:
        return [...items].sort((a, b) => b.expenseTime.localeCompare(a.expenseTime));
    }
  };

  const totalAmount = data.reduce((sum, item) => sum + item.amount, 0);
  const expenses = getExpenses();

  if (isLoading) {
    return (
      <div>
        <PageHeader title="오늘의 지출 비용" />
        <div className="flex justify-center items-center py-20">
          <div className="text-[16px] text-[#9fa4a8]">로딩 중...</div>
        </div>
      </div>
    );
  }

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
              {expenses.map((expense) => (
                <div key={expense.expenseId} className="flex flex-col gap-1.25">
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
