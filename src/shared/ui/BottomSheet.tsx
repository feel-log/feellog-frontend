'use client';

import Image from 'next/image';
import Button from './Button';

interface BottomSheetProps {
  isOpen: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
  onSave?: () => void;
  isSaveDisabled?: boolean;
  height: number;
}

export default function BottomSheet({ isOpen, title, subtitle, onClose, children, onSave, isSaveDisabled, height }: BottomSheetProps) {
  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed left-0 right-0 max-w-md mx-auto inset-0 z-40 bg-black transition-opacity duration-200 ${
          isOpen ? 'opacity-50 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Bottom Sheet */}
      <div
        style={{ height: `${height}px` }}
        className={`fixed bottom-0 left-0 max-w-md mx-auto right-0 z-50 flex w-full flex-col overflow-hidden rounded-t-[20px] bg-white transition-transform duration-300 ease-out ${
          isOpen ? 'translate-y-0 pointer-events-auto' : 'translate-y-full pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="flex shrink-0 items-start justify-between bg-white px-4 pt-7.5 pb-7.5">
          <div className="flex flex-col">
            <h2 className="text-[20px] font-semibold leading-normal tracking-[-0.025em] text-[#030303]">{title}</h2>
            {subtitle && (
              <p className="text-[16px] font-medium leading-normal tracking-[-0.025em] text-[#73787e]">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer"
            aria-label="닫기"
          >
            <Image src={'/svg/icon_X.svg'} alt="close" width={28} height={28} loading="lazy" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 pt-2.5 pb-6">
          {children}
        </div>

        {/* Footer - Save Button */}
        {onSave && (
          <div className="shrink-0 bg-white px-4 pt-6 pb-12">
            <Button
              onClick={onSave}
              disabled={isSaveDisabled}
              size="lg"
            >
              확인
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
