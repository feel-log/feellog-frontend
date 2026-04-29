'use client';

import { use, useMemo, useState } from 'react';
import PageHeader from '@/shared/ui/PageHeader';
import SortButton, { type SortType } from '@/shared/ui/SortButton';
import EmotionIcon from '@/shared/ui/EmotionIcon';
import {
  getCategoryDetail,
  type ExpenseItem,
  type ExpenseDateGroup,
  type EmotionBadge,
} from '@/shared/constants/categoryDetailMockData';

interface PageProps {
  params: Promise<{ categoryId: string }>;
}

interface FlatItem extends ExpenseItem {
  dateLabel: string;
  dateOrder: number;
}

function flattenGroups(month: number, groups: ExpenseDateGroup[]): FlatItem[] {
  return groups.flatMap((g) =>
    g.items.map((item) => ({
      ...item,
      dateLabel: `${month}월 ${g.date}`,
      dateOrder: parseInt(g.date.replace(/[^0-9]/g, ''), 10),
    })),
  );
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
    <div className="flex flex-col gap-1.25">
      {showDate && (
        <p className="text-[14px] font-medium leading-normal tracking-[-0.35px] text-[#474C52]">
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
                {item.emotions.map((emo: EmotionBadge) => (
                  <EmotionIcon key={emo.name} name={emo.name} size={20} />
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
          {item.memo ?? ''}
        </p>
        <p className="text-[16px] font-medium leading-normal tracking-[-0.4px] text-[#9FA4A8]">
          {item.payment}
        </p>
      </div>
    </div>
  );
}

export default function CategoryDetailPage({ params }: PageProps) {
  const { categoryId } = use(params);
  const decodedId = decodeURIComponent(categoryId);
  const detail = getCategoryDetail(decodedId)!;
  const [sortType, setSortType] = useState<SortType>('latest');

  const flatItems = useMemo(
    () => flattenGroups(detail.month, detail.groups),
    [detail],
  );
  const sortedItems = useMemo(() => sortFlatItems(flatItems, sortType), [flatItems, sortType]);
  const groupedItems = useMemo(() => regroupByDate(sortedItems), [sortedItems]);

  const isDateSort = sortType === 'latest' || sortType === 'oldest';

  return (
    <div className="flex flex-1 flex-col bg-white">
      <PageHeader title="카테고리별 지출 항목" />

      <div className="border-b-[5px] border-[#F7F8FA] px-4 pt-3 pb-5">
        <div className="flex items-center gap-4">
          <span className="flex h-18 w-12 items-center justify-center text-[48px] leading-[150%]">
            {detail.emoji}
          </span>
          <div className="flex flex-col gap-0.5">
            <span className="text-[18px] font-medium leading-normal tracking-[-0.45px] text-[#474C52]">
              {detail.name}
            </span>
            <span className="text-[24px] font-semibold leading-normal tracking-[-0.6px] text-[#030303]">
              {detail.totalAmount.toLocaleString()}원
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-end px-4 pt-4">
        <SortButton sortType={sortType} onSortChange={setSortType} />
      </div>

      {isDateSort ? (
        <div className="flex flex-col">
          {groupedItems.map((group) => (
            <div
              key={group.dateLabel}
              className="flex flex-col gap-3.75 border-b border-[#E5E5E5] px-4 py-7.5 last:border-b-0"
            >
              <p className="text-[14px] font-medium leading-normal tracking-[-0.35px] text-[#474C52]">
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
