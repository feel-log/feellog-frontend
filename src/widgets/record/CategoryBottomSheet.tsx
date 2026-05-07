'use client';

import Image from 'next/image';
import BottomSheet from '@/shared/ui/BottomSheet';
import { cn } from '@/shared/lib/utils';

interface CategoryGroup {
  group: string;
  items: Array<{ id: number; label: string; emoji?: string }>;
}

interface IncomeCategory {
  id: number;
  name: string;
}

interface CategoryBottomSheetProps {
  isOpen: boolean;
  recordType: 'income' | 'expense';
  isAssetMode: boolean;
  expenseCategories: CategoryGroup[];
  incomeCategories: IncomeCategory[];
  assetCategories: IncomeCategory[];
  selectedCategoryId: number | null;
  onCategorySelect: (id: number) => void;
  onClose: () => void;
  onSave: () => void;
}

export default function CategoryBottomSheet({
  isOpen,
  recordType,
  isAssetMode,
  expenseCategories,
  incomeCategories,
  assetCategories,
  selectedCategoryId,
  onCategorySelect,
  onClose,
  onSave,
}: CategoryBottomSheetProps) {
  return (
    <BottomSheet
      isOpen={isOpen}
      title="카테고리를 선택해주세요"
      subtitle={recordType === 'expense' ? '한 가지만 선택할 수 있어요' : undefined}
      onClose={() => {
        onClose();
      }}
      onSave={onSave}
      isSaveDisabled={selectedCategoryId === null}
      height={recordType === 'expense' ? 636 : 492}
    >
      {isAssetMode ? (
        <div className="flex flex-wrap gap-2.5">
          {assetCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategorySelect(category.id)}
              className={cn(
                'flex h-8 px-4 cursor-pointer items-center justify-center rounded-full border text-[14px] font-medium tracking-[-0.025em] transition-colors',
                selectedCategoryId === category.id
                  ? 'border-[#13278a] bg-[#ecf2fb] text-[#13278a]'
                  : 'border-[#e5e5e5] text-[#474c52]'
              )}
            >
              {category.name}
            </button>
          ))}
        </div>
      ) : recordType === 'income' ? (
        <div className="flex flex-wrap gap-2.5">
          {incomeCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategorySelect(category.id)}
              className={cn(
                'flex h-8 px-4 cursor-pointer items-center justify-center rounded-full border text-[14px] font-medium tracking-[-0.025em] transition-colors',
                selectedCategoryId === category.id
                  ? 'border-[#13278a] bg-[#ecf2fb] text-[#13278a]'
                  : 'border-[#e5e5e5] text-[#474c52]'
              )}
            >
              {category.name}
            </button>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-10">
          {expenseCategories.map((group) => (
            <div key={group.group} className="flex flex-col gap-3">
              <h3 className="text-[18px] font-semibold tracking-[-0.025em] text-[#27282c]">{group.group}</h3>
              <div className="flex flex-wrap gap-2.5">
                {group.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onCategorySelect(item.id)}
                    className={cn(
                      'flex h-8 px-4 cursor-pointer items-center justify-center gap-1.5 rounded-full border text-[14px] font-medium tracking-[-0.025em] transition-colors',
                      selectedCategoryId === item.id
                        ? 'border-[#13278a] bg-[#ecf2fb] text-[#13278a]'
                        : 'border-[#e5e5e5] text-[#474c52]'
                    )}
                  >
                    <span>{item.emoji}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </BottomSheet>
  );
}
