'use client';

import BottomSheet from '@/shared/ui/BottomSheet';
import { cn } from '@/shared/lib/utils';

interface SituationTag {
  id: number;
  label: string;
}

interface SituationMemoBottomSheetProps {
  isOpen: boolean;
  situationTags: SituationTag[];
  tempTags: number[];
  tempMemo: string;
  isLoading: boolean;
  onTagToggle: (id: number) => void;
  onMemoChange: (memo: string) => void;
  onClose: () => void;
  onSave: () => void;
}

export default function SituationMemoBottomSheet({
  isOpen,
  situationTags,
  tempTags,
  tempMemo,
  isLoading,
  onTagToggle,
  onMemoChange,
  onClose,
  onSave,
}: SituationMemoBottomSheetProps) {
  return (
    <BottomSheet
      isOpen={isOpen}
      title="상황 태그 · 메모를 입력해주세요"
      subtitle="상황 태그는 두 가지만 선택할 수 있어요"
      onClose={onClose}
      onSave={onSave}
      height={650}
    >
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-3">
          <h3 className="text-[18px] font-semibold tracking-[-0.025em] text-[#27282c]">상황 태그</h3>
          <div className="flex flex-wrap gap-2.5">
            {isLoading ? (
              <div className="text-[#9fa4a8]">데이터를 불러오는 중입니다...</div>
            ) : situationTags.length === 0 ? (
              <div className="text-[#9fa4a8]">상황 태그 데이터를 불러올 수 없습니다.</div>
            ) : (
              situationTags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => onTagToggle(tag.id)}
                  className={cn(
                    'flex h-8 px-4 cursor-pointer items-center justify-center rounded-full border text-[14px] font-medium tracking-[-0.025em] transition-colors',
                    tempTags.includes(tag.id)
                      ? 'border-[#13278a] bg-[#ecf2fb] text-[#13278a]'
                      : 'border-[#e5e5e5] text-[#27282c]'
                  )}
                >
                  #{tag.label}
                </button>
              ))
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-[18px] font-semibold tracking-[-0.025em] text-[#27282c]">메모</h3>
          <textarea
            value={tempMemo}
            onChange={(e) => onMemoChange(e.target.value.slice(0, 50))}
            placeholder="50자 이내로 입력해주세요"
            className="h-25.25 w-full resize-none rounded-[10px] border border-[#e5e5e5] p-4 text-[16px] font-medium tracking-[-0.025em] text-[#27282c] placeholder:font-medium placeholder:text-[#9fa4a8] focus:border-[#13278a] focus:outline-none"
          />
          <div className="text-right text-[14px] font-medium tracking-[-0.025em] text-[#9fa4a8]">
            {tempMemo.length}/50
          </div>
        </div>
      </div>
    </BottomSheet>
  );
}
