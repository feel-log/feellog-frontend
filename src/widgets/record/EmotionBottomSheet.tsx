'use client';

import Image from 'next/image';
import BottomSheet from '@/shared/ui/BottomSheet';
import { cn } from '@/shared/lib/utils';

interface EmotionGroup {
  group: string;
  items: Array<{ id: number; label: string; emoji: string }>;
}

interface EmotionBottomSheetProps {
  isOpen: boolean;
  emotions: EmotionGroup[];
  selectedEmotions: number[];
  isLoading: boolean;
  onEmotionToggle: (id: number) => void;
  onClose: () => void;
  onSave: () => void;
}

export default function EmotionBottomSheet({
  isOpen,
  emotions,
  selectedEmotions,
  isLoading,
  onEmotionToggle,
  onClose,
  onSave,
}: EmotionBottomSheetProps) {
  return (
    <BottomSheet
      isOpen={isOpen}
      title="지출할 때의 감정을 선택해주세요"
      subtitle="세 가지까지 선택할 수 있어요"
      onClose={() => {
        onClose();
      }}
      onSave={onSave}
      isSaveDisabled={false}
      height={636}
    >
      <div className="flex flex-col gap-10">
        {isLoading ? (
          <div className="text-center py-10 text-[#9fa4a8]">데이터를 불러오는 중입니다...</div>
        ) : emotions.length === 0 ? (
          <div className="text-center py-10 text-[#9fa4a8]">감정 데이터를 불러올 수 없습니다.</div>
        ) : (
          emotions.map((group) => (
            <div key={group.group} className="flex flex-col gap-3">
              <h3 className="text-[18px] font-semibold tracking-[-0.025em] text-[#27282c]">{group.group}</h3>
              <div className="flex flex-wrap gap-2.5">
                {group.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onEmotionToggle(item.id)}
                    className={cn(
                      'flex h-8 px-4 cursor-pointer items-center justify-center gap-1.5 rounded-full border text-[14px] font-medium tracking-[-0.025em] transition-colors',
                      selectedEmotions.includes(item.id)
                        ? 'border-[#13278a] bg-[#ecf2fb] text-[#13278a]'
                        : 'border-[#e5e5e5] text-[#27282c]'
                    )}
                  >
                    {item.emoji && <Image src={item.emoji} alt={item.label} width={18} height={18} />}
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </BottomSheet>
  );
}
