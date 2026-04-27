'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface PageHeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  backHref?: string;
  showClose?: boolean;
  onClose?: () => void;
  closeHref?: string;
}

export default function PageHeader({
  title,
  showBack = true,
  onBack,
  backHref,
  showClose = false,
  onClose,
  closeHref,
}: PageHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (backHref) {
      router.push(backHref);
    } else {
      router.back();
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else if (closeHref) {
      router.push(closeHref);
    } else {
      router.back();
    }
  };

  return (
    <header className="relative flex h-14 items-center px-4">
      {showBack && !showClose && (
        <button
          onClick={handleBack}
          aria-label="뒤로가기"
          className="cursor-pointer"
        >
          <Image
            src="/icons/icon_arrow_left.svg"
            alt=""
            width={28}
            height={28}
          />
        </button>
      )}
      <h1 className="absolute left-1/2 -translate-x-1/2 text-[20px] font-semibold leading-normal tracking-[-0.5px] text-[#030303]">
        {title}
      </h1>
      {showClose && (
        <button
          onClick={handleClose}
          aria-label="닫기"
          className="ml-auto cursor-pointer"
        >
          <Image src="/icons/icon_X.svg" alt="" width={28} height={28} />
        </button>
      )}
    </header>
  );
}
