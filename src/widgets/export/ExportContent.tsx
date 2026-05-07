'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import PageHeader from '@/shared/ui/PageHeader';
import SortButton from '@/shared/ui/SortButton';
import ConfirmModal from '@/shared/ui/ConfirmModal';
import { useFormattedDate } from '@/shared/hooks';
import { useDailyExpend } from '@/entities/daily-expend/model/useDailyExpend';
import { DailyExpendType } from '@/entities/daily-expend/model/daily-expend-type';
import { useMasterData } from '@/entities/master-data';
import { useDeleteExpense } from '@/features/delete-expense/model/useDeleteExpense';
import { todayKST } from '@/shared/utils/date';
import TotalAmountSection from './TotalAmountSection';
import EmptyStateMessage from './EmptyStateMessage';
import ExpenseList from './ExpenseList';

type SortType = 'latest' | 'oldest' | 'expensive' | 'cheap';

const PAYMENT_METHODS = [
  { name: '카드', id: 1 },
  { name: '현금', id: 2 },
  { name: '계좌', id: 3 },
  { name: '기타', id: 4 },
];

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
  const { expenseCategories, emotions, situationTags } = useMasterData();
  const searchParams = useSearchParams();
  const [sortType, setSortType] = useState<SortType>('latest');
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [swipedId, setSwipedId] = useState<number | null>(null);

  const selectedDate = searchParams?.get('date') || todayKST();
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
    const category =
      expenseCategories
        .flatMap((g) => g.items)
        .find((item) => item.id === expense.categoryId)?.label || '';

    const paymentMethod =
      PAYMENT_METHODS.find((m) => m.id === expense.paymentMethodId)?.name || '';

    const emotionList = emotions
      .flatMap((g) => g.items)
      .filter((e) => expense.emotionIds.includes(e.id))
      .map((e) => ({ emoji: e.emoji, label: e.label }));

    const tags = situationTags
      .filter((t) => expense.situationTagIds.includes(t.id))
      .map((t) => '#' + t.label);

    return {
      expenseId: expense.expenseId,
      name: category,
      category,
      amount: expense.amount,
      emotions: emotionList,
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

      <TotalAmountSection totalAmount={totalAmount} />

      <div className="overflow-y-auto px-4 pt-5 pb-12 h-157.75 relative">
        <div className="flex justify-end">
          <SortButton sortType={sortType} onSortChange={setSortType} />
        </div>

        <p className="mb-4 text-[14px] font-semibold tracking-[-0.025em] text-gray-500">
          {formattedDate}
        </p>

        {totalAmount === 0 ? (
          <EmptyStateMessage />
        ) : (
          <ExpenseList
            expenses={expenses}
            selectedDate={selectedDate}
            swipedId={swipedId}
            onSwipe={setSwipedId}
            onDelete={setDeleteTargetId}
          />
        )}
      </div>

      <ConfirmModal
        isOpen={deleteTargetId !== null}
        type="deleteCheck"
        title="지출을 삭제하시겠어요?"
        secondary="이 작업은 되돌릴 수 없습니다."
        confirmText="삭제"
        cancelText="취소"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
}
