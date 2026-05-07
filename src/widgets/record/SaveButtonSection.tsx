'use client';

import Button from '@/shared/ui/Button';
import KeyBoardUserExperience from '@/shared/ui/record/KeyBoardUserExperience';

interface SaveButtonSectionProps {
  isAmountEditing: boolean;
  isFormValid: boolean;
  onSubmit: () => void;
  onAmountChange: (value: string) => void;
}

export default function SaveButtonSection({
  isAmountEditing,
  isFormValid,
  onSubmit,
  onAmountChange,
}: SaveButtonSectionProps) {
  return (
    <div className="fixed right-0 bottom-0 left-0 mx-auto max-w-md bg-white" onClick={(e) => e.stopPropagation()}>
      {!isAmountEditing && (
        <div className="px-4 pt-6 pb-12">
          <Button size="lg" onClick={onSubmit} disabled={!isFormValid}>
            저장
          </Button>
        </div>
      )}
      {isAmountEditing && <KeyBoardUserExperience changeAmount={onAmountChange} />}
    </div>
  );
}
