'use client';

import Image from 'next/image';
import Button from './Button';
import { cn } from '@/shared/lib/utils';

interface BottomSheetProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  onSave?: () => void;
  isSaveDisabled?: boolean;
}

export default function BottomSheet({ isOpen, title, onClose, children, onSave, isSaveDisabled }: BottomSheetProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed left-0 right-0 max-w-md mx-auto inset-0 z-40 bg-black opacity-50 animate-fade-in"
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div className="fixed bottom-0 left-0 max-w-md mx-auto right-0 z-50 max-h-[80vh] w-full overflow-y-auto rounded-t-2xl bg-white animate-slide-up">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between bg-white p-6">
          <h2 className="text-[16px] font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="cursor-pointer text-gray-500 hover:text-gray-700"
          >
            <Image src={'/svg/icon_X.svg'} alt="close" width={24} height={24} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {children}
        </div>

        {/* Footer - Save Button */}
        {onSave && (
          <div className="sticky bottom-0 px-6 py-4">
            <Button
              onClick={onSave}
              disabled={isSaveDisabled}
              size="lg"
            >
              저장
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
