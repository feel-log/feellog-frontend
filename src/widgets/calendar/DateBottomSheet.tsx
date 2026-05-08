'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import EmotionIcon from '@/shared/ui/EmotionIcon';
import ConfirmModal from '@/shared/ui/ConfirmModal';
import TransactionTypeButton, { TransactionType } from '@/shared/ui/TransactionTypeButton';
import { useDeleteExpense } from '@/features/delete-expense/model/useDeleteExpense';
import { useDeleteIncome } from '@/features/delete-income/model/useDeleteIncome';

interface ExpenseItem {
  id: number;
  category: string;
  tags: string[];
  amount: number;
  paymentMethod: string;
  memo?: string;
  emotions?: string[];
}

interface IncomeItem {
  id: number;
  category: string;
  amount: number;
  memo?: string;
}

type DeleteTarget = { type: 'expense' | 'income'; id: number } | null;
type SwipedTarget = { type: 'expense' | 'income'; id: number } | null;

function EmptyRecord({ type }: { type: TransactionType }) {
  const isIncome = type === 'income';
  return (
    <>
      <p className="text-[18px] font-semibold leading-normal tracking-[-0.45px] text-[#474C52]">
        {isIncome ? '수입 기록이 아직 없어요' : '지출 기록이 아직 없어요'}
      </p>
      <p className="text-[14px] font-medium leading-normal tracking-[-0.35px] text-[#9FA4A8]">
        {isIncome ? '수입이 있다면 지금 기록해보세요' : '오늘의 소비와 감정을 함께 기록해보세요'}
      </p>
    </>
  );
}

interface DayDetailSheetProps {
  date: number;
  month: number;
  year: number;
  income: number;
  expense: number;
  expenseItems: ExpenseItem[];
  incomeItems: IncomeItem[];
  onClose: () => void;
}

export default function DateBottomSheet({
  date,
  month,
  year,
  income,
  expense,
  expenseItems,
  incomeItems,
  onClose,
}: DayDetailSheetProps) {
  const router = useRouter();
  const [isClosing, setIsClosing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<TransactionType>('expense');
  const [swipedTarget, setSwipedTarget] = useState<SwipedTarget>(null);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null);
  const touchStartX = useRef(0);

  const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;

  const deleteExpenseMutation = useDeleteExpense(year, month + 1, date);
  const deleteIncomeMutation = useDeleteIncome(year, month + 1);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => setIsOpen(true));
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    touchStartX.current = e.clientX;
  };

  const handlePointerUp = (
    e: React.PointerEvent,
    type: 'expense' | 'income',
    id: number,
  ) => {
    const diff = touchStartX.current - e.clientX;
    if (diff > 30) {
      setSwipedTarget({ type, id });
      e.preventDefault();
    } else if (diff < -30) {
      setSwipedTarget(null);
    }
  };

  const handleItemClick = (
    e: React.MouseEvent,
    type: 'expense' | 'income',
    id: number,
  ) => {
    const diff = Math.abs(touchStartX.current - e.clientX);
    if (diff >= 30) return;
    if (type === 'expense') {
      router.push(`/record?expenseId=${id}&date=${dateString}&mode=edit`);
    } else {
      router.push(`/record?incomeId=${id}&date=${dateString}&mode=edit`);
    }
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    const reset = () => {
      setDeleteTarget(null);
      setSwipedTarget(null);
    };
    if (deleteTarget.type === 'expense') {
      deleteExpenseMutation.mutate(deleteTarget.id, { onSuccess: reset });
    } else {
      deleteIncomeMutation.mutate(deleteTarget.id, { onSuccess: reset });
    }
  };

  const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][
    new Date(year, month, date).getDay()
  ];
  const dateLabel = `${month + 1}월 ${date}일 ${dayOfWeek}요일`;
  const isEmpty = expenseItems.length === 0 && income === 0 && expense === 0;

  const isSwiped = (type: 'expense' | 'income', id: number) =>
    swipedTarget?.type === type && swipedTarget.id === id;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      onClick={handleClose}
    >
      <div
        className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
      />

      <div
        className={`relative flex w-full max-w-md flex-col rounded-t-[20px] bg-white pb-10 transition-transform duration-300 ease-out ${
          isEmpty ? 'h-107.25' : 'max-h-[calc(100dvh-113px)] pt-10'
        } ${isOpen && !isClosing ? 'translate-y-0' : 'translate-y-full'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {isEmpty ? (
          <>
            <div className="flex items-center justify-between px-4 pt-7.25">
              <p className="text-[16px] font-medium leading-normal tracking-[-0.4px] text-[#27282C]">
                {dateLabel}
              </p>
              <button onClick={handleClose} aria-label="닫기">
                <img src="/svg/icon_X_dark.svg" alt="" width={28} height={28} />
              </button>
            </div>

            <div className="px-4 pt-3">
              <TransactionTypeButton type={transactionType} onTypeChange={setTransactionType} />
            </div>

            <div className="flex flex-1 flex-col items-center justify-center pb-10">
              <EmptyRecord type={transactionType} />
            </div>
          </>
        ) : (
          <>
            <button
              onClick={handleClose}
              className="absolute right-4 top-3.5"
              aria-label="닫기"
            >
              <img src="/svg/icon_X_dark.svg" alt="" width={28} height={28} />
            </button>
            <div className="flex flex-col gap-5 overflow-y-auto">
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.25 px-4">
                  <p className="text-[18px] font-semibold leading-normal tracking-[-0.45px] text-[#27282C]">
                    수입
                  </p>
                  <p className="text-[24px] font-semibold leading-normal tracking-[-0.6px] text-[#030303]">
                    {income.toLocaleString()}원
                  </p>
                </div>

                <div className="flex flex-col gap-1.25 border-b border-[#E5E5E5] px-4 pb-3.75">
                  <p className="text-[18px] font-semibold leading-normal tracking-[-0.45px] text-[#27282C]">
                    지출
                  </p>
                  <p className="text-[24px] font-semibold leading-normal tracking-[-0.6px] text-[#EB1C1C]">
                    {expense.toLocaleString()}원
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2.5 px-4">
                <TransactionTypeButton type={transactionType} onTypeChange={setTransactionType} />
                <p className="text-[14px] font-medium leading-normal tracking-[-0.35px] text-[#73787E]">
                  {dateLabel}
                </p>
                {transactionType === 'income' ? (
                  incomeItems.length === 0 ? (
                    <div className="flex flex-1 flex-col items-center justify-center py-20">
                      <EmptyRecord type="income" />
                    </div>
                  ) : (
                    <div className="flex flex-col gap-5">
                      {incomeItems.map((item) => (
                        <div
                          key={item.id}
                          className="relative overflow-hidden rounded-lg"
                          onPointerDown={handlePointerDown}
                          onPointerUp={(e) => handlePointerUp(e, 'income', item.id)}
                          style={{ touchAction: 'pan-y' }}
                        >
                          <div className="absolute inset-y-0 right-0 z-0 flex items-center justify-end pr-4">
                            <button
                              onClick={() => setDeleteTarget({ type: 'income', id: item.id })}
                              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EB1C1C] text-white"
                              aria-label="삭제"
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>
                          <div
                            role="button"
                            tabIndex={0}
                            onClick={(e) => handleItemClick(e, 'income', item.id)}
                            className={`relative z-10 flex min-h-12 cursor-pointer flex-col justify-center gap-0.75 bg-white transition-transform duration-300 ${
                              isSwiped('income', item.id) ? 'translate-x-[-80px]' : ''
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <p className="text-[18px] font-semibold leading-normal tracking-[-0.45px] text-[#27282C]">
                                {item.category}
                              </p>
                              <p className="text-[20px] font-semibold leading-normal tracking-[-0.5px] text-[#030303]">
                                {item.amount.toLocaleString()}원
                              </p>
                            </div>
                            {item.memo && (
                              <p className="text-[16px] font-medium leading-normal tracking-[-0.4px] text-[#9FA4A8]">
                                {item.memo}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                ) : expenseItems.length === 0 ? (
                  <div className="flex flex-1 flex-col items-center justify-center py-20">
                    <EmptyRecord type="expense" />
                  </div>
                ) : (
                  <div className="flex flex-col gap-5">
                    {expenseItems.map((item) => (
                      <div
                        key={item.id}
                        className="relative overflow-hidden rounded-lg"
                        onPointerDown={handlePointerDown}
                        onPointerUp={(e) => handlePointerUp(e, 'expense', item.id)}
                        style={{ touchAction: 'pan-y' }}
                      >
                        <div className="absolute inset-y-0 right-0 z-0 flex items-center justify-end pr-4">
                          <button
                            onClick={() => setDeleteTarget({ type: 'expense', id: item.id })}
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EB1C1C] text-white"
                            aria-label="삭제"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={(e) => handleItemClick(e, 'expense', item.id)}
                          className={`relative z-10 flex cursor-pointer flex-col gap-0.75 bg-white transition-transform duration-300 ${
                            isSwiped('expense', item.id) ? 'translate-x-[-80px]' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <p className="text-[18px] font-semibold leading-normal tracking-[-0.45px] text-[#27282C]">
                              {item.category}
                            </p>
                            <p className="text-[20px] font-semibold leading-normal tracking-[-0.5px] text-[#030303]">
                              {item.amount.toLocaleString()}원
                            </p>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1.5">
                                {item.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="text-[16px] font-medium leading-normal tracking-[-0.4px] text-[#13278A]"
                                  >
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                              {item.emotions && item.emotions.length > 0 && (
                                <>
                                  <span className="h-3.5 w-px bg-[#E5E5E5]" />
                                  <div className="flex items-center gap-1.5">
                                    {item.emotions.map((emotion) => (
                                      <EmotionIcon key={emotion} name={emotion} size={24} />
                                    ))}
                                  </div>
                                </>
                              )}
                            </div>
                            <p className="text-[16px] font-medium leading-normal tracking-[-0.4px] text-[#9FA4A8]">
                              {item.paymentMethod}
                            </p>
                          </div>

                          {item.memo && (
                            <p className="text-[16px] font-medium leading-normal tracking-[-0.4px] text-[#9FA4A8]">
                              {item.memo}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      <ConfirmModal
        isOpen={deleteTarget !== null}
        title={deleteTarget?.type === 'income' ? '수입을 삭제하시겠어요?' : '지출을 삭제하시겠어요?'}
        message="이 작업은 되돌릴 수 없습니다."
        confirmText="삭제"
        cancelText="취소"
        isDangerous
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
