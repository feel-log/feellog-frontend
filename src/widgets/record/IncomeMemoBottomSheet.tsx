'use client';

import BottomSheet from '@/shared/ui/BottomSheet';

interface IncomeMemoBottomSheetProps {
  isOpen: boolean;
  memoInput: string;
  onMemoChange: (memo: string) => void;
  onClose: () => void;
  onSave: () => void;
}

export default function IncomeMemoBottomSheet({
  isOpen,
  memoInput,
  onMemoChange,
  onClose,
  onSave,
}: IncomeMemoBottomSheetProps) {
  return (
    <BottomSheet
      isOpen={isOpen}
      title="메모를 입력해주세요"
      onClose={onClose}
      onSave={onSave}
      height={429}
    >
      <textarea
        value={memoInput}
        onChange={(e) => onMemoChange(e.target.value.slice(0, 50))}
        placeholder="50자 이내로 입력해주세요"
        autoFocus
        className="h-25.25 w-full resize-none rounded-[10px] border border-[#e5e5e5] p-4 text-[16px] font-medium tracking-[-0.025em] text-[#27282c] placeholder:font-medium placeholder:text-[#9fa4a8] focus:border-[#13278a] focus:outline-none"
      />
      <div className="mt-2 text-right text-[14px] font-medium tracking-[-0.025em] text-[#9fa4a8]">
        {memoInput.length}/50
      </div>
    </BottomSheet>
  );
}
