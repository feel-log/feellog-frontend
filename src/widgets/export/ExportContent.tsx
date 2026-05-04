'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import PageHeader from '@/shared/ui/PageHeader';
import SortButton from '@/shared/ui/SortButton';
import BottomSheet from '@/shared/ui/BottomSheet';
import Button from '@/shared/ui/Button';
import { useFormattedDate } from '@/shared/hooks';
import { useDailyExpend } from '@/entities/daily-expend/model/useDailyExpend';
import { DailyExpendType } from '@/entities/daily-expend/model/daily-expend-type';
import { EXPENSE_CATEGORIES, EMOTIONS } from '@/widgets/record/RecordContent';
import { PAYMENT_METHODS, SITUATION_TAGS } from '@/widgets/record/RecordContent';
import { useDeleteExpense } from '@/features/delete-expense/model/useDeleteExpense';

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
  const router = useRouter();
  const [sortType, setSortType] = useState<SortType>('latest');
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  const selectedDate = searchParams?.get('date') || new Date().toISOString().split('T')[0];
  const [year, month, day] = selectedDate.split('-').map(Number);

  const { data = [], isLoading } = useDailyExpend(year, month, day);
  const deleteExpenseMutation = useDeleteExpense(year, month, day);

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

  const handleDeleteConfirm = () => {
    if (deleteTargetId !== null) {
      deleteExpenseMutation.mutate(deleteTargetId, {
        onSuccess: () => {
          setDeleteTargetId(null);
        },
      });
    }
  };

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
      <div className="px-4 pt-5 pb-12 overflow-y-auto">
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
                <div key={expense.expenseId} className="flex flex-col gap-1.25 pb-3.75 border-b border-[#e5e5e5]">
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

                  {/* 수정/삭제 버튼 */}
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() =>
                        router.push(
                          `/record?expenseId=${expense.expenseId}&date=${selectedDate}&mode=edit`
                        )
                      }
                      className="flex-1 px-3 py-2 text-[14px] font-medium text-[#13278a] bg-[#f0f3ff] rounded-lg hover:bg-[#e0e7ff] transition-colors"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => setDeleteTargetId(expense.expenseId)}
                      className="flex-1 px-3 py-2 text-[14px] font-medium text-[#eb1c1c] bg-[#ffe0e0] rounded-lg hover:bg-[#ffc0c0] transition-colors"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* 삭제 확인 BottomSheet */}
      <BottomSheet
        isOpen={deleteTargetId !== null}
        title="지출 삭제"
        onClose={() => setDeleteTargetId(null)}
        height={280}
      >
        <div className="flex flex-col gap-4 text-center py-4">
          <p className="text-[16px] font-semibold text-[#27282c]">정말 삭제하시겠어요?</p>
          <p className="text-[14px] text-[#9fa4a8]">이 작업은 되돌릴 수 없어요.</p>
        </div>
      </BottomSheet>

      {/* 삭제 확인 버튼 영역 */}
      {deleteTargetId !== null && (
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-50 px-4 pb-12 bg-white">
          <div className="flex gap-2">
            <button
              onClick={() => setDeleteTargetId(null)}
              className="flex-1 px-4 py-3 text-[16px] font-semibold text-[#9fa4a8] bg-[#f7f8fa] rounded-lg hover:bg-[#e5e5e5] transition-colors"
            >
              취소
            </button>
            <button
              onClick={handleDeleteConfirm}
              disabled={deleteExpenseMutation.isPending}
              className="flex-1 px-4 py-3 text-[16px] font-semibold text-white bg-[#eb1c1c] rounded-lg hover:bg-[#d41c1c] disabled:bg-[#ccc] transition-colors"
            >
              {deleteExpenseMutation.isPending ? '삭제 중...' : '삭제하기'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
