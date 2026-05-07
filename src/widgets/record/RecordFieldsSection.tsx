'use client';

import SelectField from '@/shared/ui/SelectField';
import { formatDateDisplay, RecordState } from '@/shared/utils/record';

interface IncomeCategory {
  id: number;
  label: string;
}

interface PaymentMethod {
  id: number;
  label: string;
}

interface CategoryGroup {
  group: string;
  items: Array<{ id: number; label: string; emoji?: string }>;
}

interface SituationTag {
  id: number;
  label: string;
}

interface EmotionGroup {
  group: string;
  items: Array<{ id: number; label: string; emoji: string }>;
}

interface RecordFieldsSectionProps {
  record: RecordState;
  isAssetMode: boolean;
  expenseCategories: CategoryGroup[];
  incomeCategories: IncomeCategory[];
  assetCategories: IncomeCategory[];
  paymentMethods: PaymentMethod[];
  emotions: EmotionGroup[];
  situationTags: SituationTag[];
  isDateSelected: boolean;
  onDateClick: () => void;
  onPaymentClick: () => void;
  onCategoryClick: () => void;
  onEmotionClick: () => void;
  onSituationClick: () => void;
  onMemoClick?: () => void;
}

export default function RecordFieldsSection({
  record,
  isAssetMode,
  expenseCategories,
  incomeCategories,
  assetCategories,
  paymentMethods,
  emotions,
  situationTags,
  isDateSelected,
  onDateClick,
  onPaymentClick,
  onCategoryClick,
  onEmotionClick,
  onSituationClick,
  onMemoClick,
}: RecordFieldsSectionProps) {
  return (
    <div className="flex flex-col gap-5">
      {/* Date Section */}
      <SelectField
        label="날짜"
        value={formatDateDisplay(record.date)}
        placeholder="날짜를 선택하세요"
        isDefault={!isDateSelected}
        onClick={onDateClick}
      />

      {/* Payment Method Section (Expense Only) */}
      {record.type === 'expense' && (
        <SelectField
          label="결제 수단"
          value={record.paymentMethodId ? paymentMethods.find(m => m.id === record.paymentMethodId)?.label ?? null : null}
          placeholder="결제 수단을 선택하세요"
          onClick={onPaymentClick}
        />
      )}

      {/* Category Section */}
      <SelectField
        label="카테고리"
        value={
          isAssetMode
            ? assetCategories.find((c) => c.id === record.categoryId)?.label ?? ''
            : record.type === 'income'
            ? incomeCategories.find((c) => c.id === record.categoryId)?.label ?? ''
            : expenseCategories
              .flatMap((g) => g.items)
              .find((item) => item.id === record.categoryId)?.label ?? ''
        }
        placeholder="카테고리를 선택하세요"
        onClick={onCategoryClick}
      />

      {/* Emotion Section (Expense Only) */}
      {record.type === 'expense' && (
        <SelectField
          label="감정"
          value={
            record.emotionIds && record.emotionIds.length > 0
              ? record.emotionIds
                .map((emotionId: number) => {
                  const emotion = emotions.flatMap((g) => g.items).find((item) => item.id === emotionId);
                  return emotion ? `${emotion.label}` : '';
                })
                .filter(Boolean)
                .join(', ')
              : ''
          }
          placeholder="감정을 선택하세요"
          onClick={onEmotionClick}
        />
      )}

      {/* Situation Tags & Memo (Expense Only) or Memo (Income) */}
      {record.type === 'expense' ? (
        <SelectField
          label="상황 태그 · 메모"
          value={
            `${
              record.situationTagIds && record.situationTagIds.length > 0
                ? record.situationTagIds
                  .map((tagId: number) => {
                    return situationTags.find((item) => item.id === tagId)?.label;
                  })
                  .filter(Boolean)
                  .join(', ')
                : ''
            }${record.situationTagIds && record.situationTagIds.length > 0 && record.memo ? ' / ' : ''}${record.memo ?? ''}`
          }
          placeholder="상황 태그·메모를 입력하세요"
          onClick={onSituationClick}
        />
      ) : (
        <SelectField
          label="메모"
          value={record.memo}
          placeholder="내용을 입력하세요"
          onClick={onMemoClick}
        />
      )}
    </div>
  );
}
