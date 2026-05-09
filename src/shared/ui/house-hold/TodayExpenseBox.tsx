'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useFormattedDate } from '@/shared/hooks';
import Image from 'next/image';
import { useMonthExpendStore } from '@/shared/store/month-expend-store';
import { useTodayExpend } from '@/entities/today-expenditure/model/useTodayExpend';
import { useToken, useUser } from '@/shared/store';
import ConfirmModal from '@/shared/ui/ConfirmModal';
import DateNavigator from './DateNavigator';
import EmptyExpenseState from './EmptyExpenseState';
import ExpenseCategoryItem from './ExpenseCategoryItem';

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
  const { getAccessToken } = useToken();
  const user = getUser();
  const accessToken = getAccessToken();

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
    if (!accessToken || user?.nickname?.startsWith('guest')) {
      setShowLoginModal(true);
      return;
    }
    router?.push(`/export?date=${dateString}`);
  };

  // 선택된 날짜와 일치하는 지출 데이터만 필터링
  const dailyExpenseList = useMemo(() => {
    return monthData.filter((item) => item.expenseDate === dateString);
  }, [monthData, dateString]);

  // 개별 지출 항목으로 매핑 (같은 카테고리도 합산하지 않고 각각 표시)
  const expenseData = useMemo(() => {
    const items = dailyExpenseList.map((expense) => {
      const categoryLabel = expenseCategories && Array.isArray(expenseCategories)
        ? expenseCategories.flatMap((g) => g.items).find((item) => item.id === expense.categoryId)?.label || '기타'
        : '기타';

      const expenseEmotions: any[] = [];
      if (expense.emotionIds && expense.emotionIds.length > 0) {
        expense.emotionIds.forEach((emotionId) => {
          const emotion = emotions && Array.isArray(emotions)
            ? emotions.flatMap((g) => g.items).find((item) => item.id === emotionId)
            : undefined;
          if (emotion && !expenseEmotions.find((e) => e.id === emotion.id)) {
            expenseEmotions.push(emotion);
          }
        });
      }

      return {
        name: categoryLabel,
        amount: expense.amount,
        emotions: expenseEmotions,
      };
    });

    return {
      totalAmount: dailyExpenseList.reduce((sum, item) => sum + item.amount, 0),
      categories: items,
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

      <DateNavigator
        formattedDate={formattedDate}
        canGoPrev={canGoPrev}
        canGoNext={canGoNext}
        onPrevDay={handlePrevDay}
        onNextDay={handleNextDay}
        totalAmount={totalAmount}
      />

      {totalAmount === 0 ? (
        <EmptyExpenseState dateString={dateString} />
      ) : (
        <>
          <div className="space-y-5">
            {expenseData?.categories.slice(0, 3).map((category, idx) => (
              <ExpenseCategoryItem
                key={idx}
                name={category.name}
                amount={category.amount}
                emotions={category.emotions}
              />
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
