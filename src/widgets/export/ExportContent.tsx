'use client';

import { useRef, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import PageHeader from '@/shared/ui/PageHeader';
import SortButton from '@/shared/ui/SortButton';
import ConfirmModal from '@/shared/ui/ConfirmModal';
import { useFormattedDate } from '@/shared/hooks';
import { useDailyExpend } from '@/entities/daily-expend/model/useDailyExpend';
import { DailyExpendType } from '@/entities/daily-expend/model/daily-expend-type';
import { useMasterData } from '@/entities/master-data';
import { useDeleteExpense } from '@/features/delete-expense/model/useDeleteExpense';
import { Trash2 } from 'lucide-react';

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
  const router = useRouter();
  const [sortType, setSortType] = useState<SortType>('latest');
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [swipedId, setSwipedId] = useState<number | null>(null);

  const touchStartX = useRef(0);

  const selectedDate = searchParams?.get('date') || new Date().toISOString().split('T')[0];
  const [year, month, day] = selectedDate.split('-').map(Number);

  const { data = [], isLoading } = useDailyExpend(year, month, day);
  const deleteExpenseMutation = useDeleteExpense(year, month, day);

  const handlePointerDown = (e: React.PointerEvent) => {
    touchStartX.current = e.clientX;
  };

  const handlePointerUp = (e: React.PointerEvent, expenseId: number) => {
    const touchEndX = e.clientX;
    const diff = touchStartX.current - touchEndX;

    // 왼쪽으로 스와이프 (diff > 30)
    if (diff > 30) {
      setSwipedId(expenseId);
      e.preventDefault();
    }
    // 오른쪽으로 스와이프 또는 작은 이동 (diff < -30)
    else if (diff < -30) {
      setSwipedId(null);
    }
  };

  const handleExpenseClick = (e: React.MouseEvent, expenseId: number) => {
    const diff = Math.abs(touchStartX.current - e.clientX);
    // 스와이프 거리가 작을 때만 클릭 처리 (30px 이상 차이가 나면 스와이프로 간주)
    if (diff < 30) {
      router.push(
        `/record?expenseId=${expenseId}&date=${selectedDate}&mode=edit`
      );
    }
  };

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

      {/* 합계 섹션 */}
      <div className="border-b-[5px] border-[#f7f8fa] px-4 pt-5 pb-3.75">
        <p className="text-[18px] font-semibold tracking-[-0.025em] text-[#27282c]">지출</p>
        <p className="text-[28px] font-semibold tracking-[-0.025em] text-[#eb1c1c]">
          {totalAmount.toLocaleString()}원
        </p>
      </div>

      {/* 정렬 셀렉터 + 본문 */}
      <div className="overflow-y-auto px-4 pt-5 pb-12 h-118.5 relative">
        <div className="flex justify-end">
          <SortButton sortType={sortType} onSortChange={setSortType} />
        </div>

        {/* 날짜 라벨 */}
        <p className="mb-4 text-[14px] font-semibold tracking-[-0.025em] text-gray-500">
          {formattedDate}
        </p>

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
          <div>
            {/* 항목 리스트 */}
            <div className="flex flex-col gap-5">
              {expenses.map((expense) => (
                <div
                  key={expense.expenseId}
                  className="relative overflow-hidden rounded-lg"
                  onPointerDown={handlePointerDown}
                  onPointerUp={(e) => handlePointerUp(e, expense.expenseId)}
                  style={{ touchAction: 'pan-y' }}
                >
                  {/* 삭제 버튼 배경 */}
                  <div className="absolute inset-y-0 right-0 z-0 flex items-center justify-end pr-4">
                    <button
                      onClick={() => setDeleteTargetId(expense.expenseId)}
                      className="bg-[#eb1c1c] text-white w-10 h-10 flex justify-center items-center rounded-full"
                      aria-label="삭제"
                    >
                      <Trash2 size={24} />
                    </button>
                  </div>

                  {/* 컨텐츠 */}
                  <div
                    className={`relative z-10 bg-white transition-transform duration-300 cursor-pointer ${
                      swipedId === expense.expenseId ? 'translate-x-[-80px]' : ''
                    }`}
                    onClick={(e) => handleExpenseClick(e, expense.expenseId)}
                  >
                    <div className="flex flex-col gap-1.25 pb-3.75">
                      {/* 카테고리명 + 금액 */}
                      <div className="flex items-center justify-between">
                        <h4 className="text-[18px] font-semibold tracking-[-0.025em] text-[#27282c]">
                          {expense.name}
                        </h4>
                        <p className="text-[20px] font-semibold tracking-[-0.025em] text-[#030303]">
                          {expense.amount.toLocaleString()}원
                        </p>
                      </div>

                      {/* 태그 + 메모 */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1">
                          {expense.tag && expense.tag.length > 0 && (
                            <span className="text-[16px] font-medium tracking-[-0.025em] text-[#13278a]">
                              {expense.tag.join(', ')}
                            </span>
                          )}
                          {expense.tag && expense.tag.length > 0 && expense.memo && (
                            <span className="text-[16px] font-medium tracking-[-0.025em] text-[#9fa4a8]">
                              |
                            </span>
                          )}
                          {expense.memo && (
                            <span className="text-[16px] font-medium tracking-[-0.025em] text-[#9fa4a8]">
                              {expense.memo}
                            </span>
                          )}
                        </div>
                        <span className="text-[16px] font-medium tracking-[-0.025em] text-[#9fa4a8]">
                          {expense.paymentMethod}
                        </span>
                      </div>

                      {/* 감정 */}
                      {expense.emotions.length > 0 && (
                        <div className="flex items-center gap-1.5">
                          {expense.emotions.map((emotion, idx) => (
                            <span key={idx} className="flex items-center gap-1">
                              {emotion.emoji && (
                                <Image
                                  src={emotion.emoji}
                                  alt={emotion.label}
                                  width={18}
                                  height={18}
                                />
                              )}
                              <span className="text-[14px] font-medium tracking-[-0.025em] text-[#474c52]">
                                {emotion.label}
                              </span>
                              {idx < expense.emotions.length - 1 && (
                                <span className="text-[14px] text-[#9fa4a8]">,</span>
                              )}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 삭제 확인 모달 */}
      <ConfirmModal
        isOpen={deleteTargetId !== null}
        title="지출을 삭제하시겠어요?"
        message="이 작업은 되돌릴 수 없습니다."
        confirmText="삭제"
        cancelText="취소"
        isDangerous={true}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
}
