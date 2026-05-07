'use client';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useToken } from '@/shared/store';
import {
  reportQueries,
  type MonthlyExpenseItem,
} from '@/entities/report';
import PageHeader from '@/shared/ui/PageHeader';
import Skeleton from '@/shared/ui/Skeleton';
import SortButton, { type SortType } from '@/shared/ui/SortButton';
import EmotionIcon from '@/shared/ui/EmotionIcon';

interface FlatItem extends MonthlyExpenseItem {
  dateLabel: string;
  dateOrder: number;
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'] as const;

function formatDateLabel(isoDate: string, dayOfWeek?: string): string {
  const [, m, d] = isoDate.split('-').map(Number);
  if (dayOfWeek) {
    return `${m}월 ${d}일 ${dayOfWeek}`;
  }
  const weekday = WEEKDAYS[new Date(isoDate).getDay()];
  return `${m}월 ${d}일 ${weekday}요일`;
}

function flattenExpenses(items: MonthlyExpenseItem[]): FlatItem[] {
  return items.map((item) => ({
    ...item,
    dateLabel: formatDateLabel(item.date, item.dayOfWeek),
    dateOrder: new Date(item.date).getTime(),
  }));
}

function sortFlatItems(items: FlatItem[], sortType: SortType): FlatItem[] {
  const sorted = [...items];
  switch (sortType) {
    case 'latest':
      return sorted.sort((a, b) => b.dateOrder - a.dateOrder);
    case 'oldest':
      return sorted.sort((a, b) => a.dateOrder - b.dateOrder);
    case 'expensive':
      return sorted.sort((a, b) => b.amount - a.amount);
    case 'cheap':
      return sorted.sort((a, b) => a.amount - b.amount);
    default:
      return sorted;
  }
}

interface DayGroup {
  dateLabel: string;
  items: FlatItem[];
}

function regroupByDate(items: FlatItem[]): DayGroup[] {
  const map = new Map<string, DayGroup>();
  items.forEach((item) => {
    if (!map.has(item.dateLabel)) {
      map.set(item.dateLabel, { dateLabel: item.dateLabel, items: [] });
    }
    map.get(item.dateLabel)!.items.push(item);
  });
  return Array.from(map.values());
}

function ExpenseItemRow({ item, showDate }: { item: FlatItem; showDate: boolean }) {
  return (
    <div className="flex flex-col gap-0.75">
      {showDate && (
        <p className="text-[14px] font-medium leading-normal tracking-[-0.35px] text-[#474C52]">
          {item.dateLabel}
        </p>
      )}

      <div className="flex items-center justify-between">
        <span className="text-[18px] font-semibold leading-normal tracking-[-0.45px] text-[#27282C]">
          {item.categoryName ?? ''}
        </span>
        <span className="text-[20px] font-semibold leading-normal tracking-[-0.5px] text-[#030303]">
          {item.amount.toLocaleString()}원
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            {item.situationTags.map((tag) => (
              <span
                key={tag.situationTagId}
                className="text-[16px] font-medium leading-normal tracking-[-0.4px] text-[#13278A]"
              >
                #{tag.situationName}
              </span>
            ))}
          </div>
          {item.emotions && item.emotions.length > 0 && (
            <>
              {item.situationTags.length > 0 && <span className="h-3.5 w-px bg-[#D9D9D9]" />}
              <div className="flex items-center gap-1.5">
                {item.emotions.map((emotion) => (
                  <EmotionIcon key={emotion.emotionId} name={emotion.emotionName} size={20} />
                ))}
              </div>
            </>
          )}
        </div>
        <span className="text-[16px] font-medium leading-normal tracking-[-0.4px] text-[#9FA4A8]">
          {item.paymentMethod}
        </span>
      </div>

      {item.memo && (
        <p className="text-[16px] font-medium leading-normal tracking-[-0.4px] text-[#9FA4A8]">
          {item.memo}
        </p>
      )}
    </div>
  );
}

export default function MonthlyExpenseContent() {
  const searchParams = useSearchParams();
  const today = new Date();
  const year = Number(searchParams?.get('year') ?? today.getFullYear());
  const month = Number(searchParams?.get('month') ?? today.getMonth() + 1);

  const { getAccessToken } = useToken();
  const token = getAccessToken();

  const [sortType, setSortType] = useState<SortType>('latest');

  const { data, isLoading } = useQuery({
    ...reportQueries.monthlyExpenseDetail(token || '', year, month),
    enabled: !!token,
  });

  const flatItems = useMemo(() => {
    const all = data?.dailyLogs.flatMap((log) => log.expenses) ?? [];
    return flattenExpenses(all);
  }, [data]);

  const sortedItems = useMemo(
    () => sortFlatItems(flatItems, sortType),
    [flatItems, sortType],
  );
  const groupedItems = useMemo(() => regroupByDate(sortedItems), [sortedItems]);

  const isDateSort = sortType === 'latest' || sortType === 'oldest';
  const totalAmount = data?.totalAmount ?? 0;

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col bg-white">
        <PageHeader title="이번 달 지출" />
        <div className="px-4 pt-3 pb-5">
          <Skeleton className="h-9 w-40 rounded-[8px]" />
        </div>
        <div className="flex flex-1 flex-col px-4 pt-3 pb-6">
          <Skeleton className="w-full flex-1 rounded-[12px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col bg-white">
      <PageHeader title="이번 달 지출" />

      <div className="border-b-[5px] border-[#F7F8FA] px-4 pt-3 pb-5">
        <p className="text-[24px] font-semibold leading-normal tracking-[-0.6px] text-[#030303]">
          {totalAmount.toLocaleString()}원
        </p>
      </div>

      <div className="flex justify-end px-4 pt-4">
        <SortButton sortType={sortType} onSortChange={setSortType} />
      </div>

      {sortedItems.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center py-20">
          <p className="text-[18px] font-semibold leading-normal tracking-[-0.45px] text-[#474C52]">
            아직 등록된 지출이 없어요
          </p>
          <p className="text-[14px] font-medium leading-normal tracking-[-0.35px] text-[#9FA4A8]">
            지출을 기록하면 이곳에 표시돼요
          </p>
        </div>
      ) : isDateSort ? (
        <div className="flex flex-col">
          {groupedItems.map((group) => (
            <div
              key={group.dateLabel}
              className="flex flex-col gap-1.25 border-b border-[#E5E5E5] px-4 py-6.25 last:border-b-0"
            >
              <p className="text-[14px] font-medium leading-normal tracking-[-0.35px] text-[#474C52]">
                {group.dateLabel}
              </p>
              <div className="flex flex-col gap-7.5">
                {group.items.map((item) => (
                  <ExpenseItemRow key={item.expenseId} item={item} showDate={false} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-7.5 px-4 py-6.25">
          {sortedItems.map((item) => (
            <ExpenseItemRow key={item.expenseId} item={item} showDate={true} />
          ))}
        </div>
      )}
    </div>
  );
}
