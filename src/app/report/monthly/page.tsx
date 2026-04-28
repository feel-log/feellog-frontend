'use client';

import { useMemo, useState } from 'react';
import PageHeader from '@/shared/ui/PageHeader';
import SortButton, { type SortType } from '@/shared/ui/SortButton';
import EmotionIcon from '@/shared/ui/EmotionIcon';
import {
  monthlyExpenseMock,
  getMonthlyExpenseTotal,
  type MonthlyExpenseItem,
} from '@/features/report/mock/monthlyExpenseMockData';

interface DayGroup {
  date: string;
  dateLabel: string;
  items: MonthlyExpenseItem[];
}

function groupByDate(items: MonthlyExpenseItem[]): DayGroup[] {
  const map = new Map<string, DayGroup>();
  items.forEach((item) => {
    if (!map.has(item.date)) {
      map.set(item.date, {
        date: item.date,
        dateLabel: item.dateLabel,
        items: [],
      });
    }
    map.get(item.date)!.items.push(item);
  });
  return Array.from(map.values());
}

function sortItems(items: MonthlyExpenseItem[], sortType: SortType): MonthlyExpenseItem[] {
  const sorted = [...items];
  switch (sortType) {
    case 'latest':
      return sorted.sort((a, b) => b.date.localeCompare(a.date));
    case 'oldest':
      return sorted.sort((a, b) => a.date.localeCompare(b.date));
    case 'expensive':
      return sorted.sort((a, b) => b.amount - a.amount);
    case 'cheap':
      return sorted.sort((a, b) => a.amount - b.amount);
    default:
      return sorted;
  }
}

function ExpenseItemRow({ item, showDate }: { item: MonthlyExpenseItem; showDate: boolean }) {
  return (
    <div className="flex flex-col gap-1.25">
      {showDate && (
        <p className="text-[14px] font-medium leading-normal tracking-[-0.35px] text-[#73787E]">
          {item.dateLabel}
        </p>
      )}

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
          {item.emotions.length > 0 && (
            <>
              <span className="h-3.5 w-px bg-[#D9D9D9]" />
              <div className="flex items-center gap-1.5">
                {item.emotions.map((emotion) => (
                  <EmotionIcon key={emotion} name={emotion} size={20} />
                ))}
              </div>
            </>
          )}
        </div>
        <p className="text-[20px] font-semibold leading-normal tracking-[-0.5px] text-[#030303]">
          {item.amount.toLocaleString()}원
        </p>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-[16px] font-medium leading-normal tracking-[-0.4px] text-[#9FA4A8]">
          {item.name ?? ''}
        </p>
        <p className="text-[16px] font-medium leading-normal tracking-[-0.4px] text-[#9FA4A8]">
          {item.paymentMethod}
        </p>
      </div>
    </div>
  );
}

export default function MonthlyExpensePage() {
  const [sortType, setSortType] = useState<SortType>('latest');
  const totalAmount = getMonthlyExpenseTotal();

  const isDateSort = sortType === 'latest' || sortType === 'oldest';

  const sortedItems = useMemo(
    () => sortItems(monthlyExpenseMock, sortType),
    [sortType],
  );
  const groupedItems = useMemo(() => groupByDate(sortedItems), [sortedItems]);

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

      {isDateSort ? (
        <div className="flex flex-col">
          {groupedItems.map((group) => (
            <div
              key={group.date}
              className="flex flex-col gap-3.75 border-b border-[#E5E5E5] px-4 py-7.5 last:border-b-0"
            >
              <p className="text-[14px] font-medium leading-normal tracking-[-0.35px] text-[#73787E]">
                {group.dateLabel}
              </p>
              <div className="flex flex-col gap-5">
                {group.items.map((item) => (
                  <ExpenseItemRow key={item.id} item={item} showDate={false} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-7.5 px-4 pt-3.75 pb-7.5">
          {sortedItems.map((item) => (
            <ExpenseItemRow key={item.id} item={item} showDate={true} />
          ))}
        </div>
      )}
    </div>
  );
}
