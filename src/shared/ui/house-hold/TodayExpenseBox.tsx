'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useFormattedDate } from '@/shared/hooks';
import Image from 'next/image';
import { cn } from '@/shared/lib/utils';
import { useMonthExpendStore } from '@/shared/store/month-expend-store';
import { useTodayExpend } from '@/entities/today-expenditure/model/useTodayExpend';
import { useMasterData } from '@/entities/master-data';
import { useToken, useUser } from '@/shared/store';
import ConfirmModal from '@/shared/ui/ConfirmModal';

interface TodayExpenseBoxProps {
  emotions: any[];
  expenseCategories: any[];
}

export default function TodayExpenseBox({ emotions, expenseCategories }: TodayExpenseBoxProps) {
  const router = useRouter();
  const [TODAY] = useState(() => new Date());
  const MIN_DATE = useMemo(() => {
    const date = new Date(TODAY);
    date.setMonth(date.getMonth() - 1);
    return date;
  }, [TODAY]);
  const [selectedDate, setSelectedDate] = useState<Date>(TODAY);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { getUser } = useUser();
  const { setErrorBox } = useToken();
  const user = getUser();

  const canGoPrev = selectedDate > MIN_DATE;
  const canGoNext = selectedDate < TODAY;

  useTodayExpend(
    Number(selectedDate.getFullYear()),
    Number(selectedDate.getMonth() + 1)
  );

  const handlePrevDay = () => {
    if (canGoPrev) {
      const newDate = new Date(selectedDate);
      newDate.setDate(newDate.getDate() - 1);
      setSelectedDate(newDate);
    }
  };

  const handleNextDay = () => {
    if (canGoNext) {
      const newDate = new Date(selectedDate);
      newDate.setDate(newDate.getDate() + 1);
      setSelectedDate(newDate);
    }
  };

  const { data: monthData } = useMonthExpendStore();
  const dateString = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;

  const handleExportClick = () => {
    if (!user?.nickname || user?.nickname.startsWith('guest')) {
      setShowLoginModal(true);
      return;
    }
    router?.push(`/export?date=${dateString}`);
  };

  // 선택된 날짜와 일치하는 지출 데이터만 필터링
  const dailyExpenseList = useMemo(() => {
    return monthData.filter((item) => item.expenseDate === dateString);
  }, [monthData, dateString]);

  // 카테고리별로 그룹핑
  const expenseData = useMemo(() => {
    const categoryMap = new Map<number, { name: string; amount: number; emotions: any[] }>();

    dailyExpenseList.forEach((expense) => {
      if (!categoryMap.has(expense.categoryId)) {
        const categoryLabel = expenseCategories && Array.isArray(expenseCategories)
          ? expenseCategories.flatMap((g) => g.items).find((item) => item.id === expense.categoryId)?.label || '기타'
          : '기타';

        categoryMap.set(expense.categoryId, {
          name: categoryLabel,
          amount: 0,
          emotions: [],
        });
      }
      const category = categoryMap.get(expense.categoryId)!;
      category.amount += expense.amount;

      // emotionIds를 사용해서 emotion 정보 추가
      if (expense.emotionIds && expense.emotionIds.length > 0) {
        expense.emotionIds.forEach((emotionId) => {
          const emotion = emotions && Array.isArray(emotions)
            ? emotions.flatMap((g) => g.items).find((item) => item.id === emotionId)
            : undefined;
          if (emotion && !category.emotions.find((e) => e.id === emotion.id)) {
            category.emotions.push(emotion);
          }
        });
      }
    });

    return {
      totalAmount: dailyExpenseList.reduce((sum, item) => sum + item.amount, 0),
      categories: Array.from(categoryMap.values()),
    };
  }, [dailyExpenseList, emotions, expenseCategories]);

  const formattedDate = useFormattedDate(selectedDate.toISOString(), {
    year: undefined,
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  const totalAmount = expenseData?.totalAmount ?? 0;


  return (
    <div className="relative mb-2 w-full rounded-[12px] bg-white px-4 pt-4 pb-5.5 shadow-[0px_0px_8px_0px_rgba(19,39,138,0.15)]">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[16px] font-medium tracking-[-0.025em] text-[#73787e]">
            오늘의 지출 비용
          </span>
          <span className="text-[24px] font-semibold tracking-[-0.025em] text-[#030303]">
            {totalAmount.toLocaleString()}원
          </span>
        </div>
        <button
          className={'cursor-pointer'}
          onClick={handleExportClick}
        >
          <Image
            src={'/svg/icon_arrow_right.svg'}
            alt={'right-arrow'}
            width={24}
            height={24}
            loading="lazy"
          />
        </button>
      </div>

      <div className={cn('flex items-center gap-0.75', totalAmount === 0 ? 'mb-2' : 'mb-3')}>
        <button
          onClick={handlePrevDay}
          disabled={!canGoPrev}
          className={`transition-opacity ${
            canGoPrev ? 'cursor-pointer' : 'cursor-not-allowed opacity-40'
          }`}
        >
          <Image
            src={'/svg/icon_arrow_left_fill.svg'}
            alt={'prev'}
            width={20}
            height={20}
            loading="lazy"
          />
        </button>
        <span className="text-[16px] font-medium tracking-[-0.025em] text-[#27282c]">
          {formattedDate}
        </span>
        <button
          onClick={handleNextDay}
          disabled={!canGoNext}
          className={`transition-opacity ${
            canGoNext ? 'cursor-pointer' : 'cursor-not-allowed opacity-40'
          }`}
        >
          <Image
            src={'/svg/icon_arrow_left_fill.svg'}
            alt={'next'}
            width={20}
            height={20}
            className={'rotate-180'}
          />
        </button>
      </div>

      {totalAmount === 0 ? (
        <div className="flex flex-col items-center justify-center">
          <p className="mb-4 self-start text-[16px] font-medium text-gray-500">
            아직 지출이 없어요
          </p>
          <button
            onClick={() => {
              if(!user?.nickname || user?.nickname.startsWith('guest')) {
                setErrorBox(true);
                return;
              }
              router?.push(`/record?date=${dateString}`);
            }}
            className="w-full rounded-[10px] border border-[#e5e5e5] py-3 text-center text-[16px] font-medium text-[#27282c] transition-colors hover:bg-gray-50"
          >
            오늘의 지출 기록하러가기
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-5">
            {expenseData?.categories.slice(0, 3).map((category, idx) => (
              <div key={idx}>
                <div className="mb-1.25 flex items-center justify-between">
                  <span className="text-[16px] font-medium tracking-[-0.025em] text-[#27282c]">
                    {category.name}
                  </span>
                  <span className="text-[18px] font-semibold tracking-[-0.025em] text-[#030303]">
                    {category.amount.toLocaleString()}원
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.25">
                  {category.emotions.map((emotion, emoIdx) => (
                    <span
                      key={emoIdx}
                      className="inline-flex items-center gap-1.25 rounded-full bg-[#f0f4f5] px-2.5 py-0.75 text-[12px] font-medium tracking-[-0.025em] text-[#474c52]"
                    >
                      {emotion.emoji && (
                        <Image
                          src={emotion.emoji}
                          alt={emotion.label}
                          width={14}
                          height={14}
                          loading="lazy"
                        />
                      )}
                      <span>{emotion.label}</span>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleExportClick}
            className="mt-6 w-full cursor-pointer rounded-[10px] border border-[#e5e5e5] px-2.5 py-3 text-center text-[16px] font-medium tracking-[-0.025em] text-[#27282c] transition-colors hover:bg-gray-50"
          >
            더보기
          </button>
        </>
      )}

      <ConfirmModal
        isOpen={showLoginModal}
        type="loginCheck"
        title="로그인 후 이용 가능합니다."
        secondary="로그인 하시겠습니까?"
        onCancel={() => setShowLoginModal(false)}
        onConfirm={() => {
          setShowLoginModal(false);
          router.push('/login');
        }}
      />
    </div>
  );
}
