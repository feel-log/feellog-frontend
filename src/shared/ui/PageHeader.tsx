'use client';

import { ReactNode } from 'react';
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
  rightAction?: ReactNode;
}

export default function PageHeader({
  title,
  showBack = true,
  onBack,
  backHref,
  showClose = false,
  onClose,
  closeHref,
  rightAction,
}: PageHeaderProps) {
  let router: ReturnType<typeof useRouter> | null = null;
  try {
    router = useRouter();
  } catch {
    router = null;
  }

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (backHref && router) {
      router.push(backHref);
    } else if (router) {
      router.back();
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else if (closeHref && router) {
      router.push(closeHref);
    } else if (router) {
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
            src="/svg/icon_arrow_left.svg"
            alt=""
            width={28}
            height={28}
            loading="lazy"
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
          <Image src="/svg/icon_X_dark.svg" alt="" width={28} height={28} loading="lazy" />
        </button>
      )}
      {rightAction && <div className="ml-auto">{rightAction}</div>}
    </header>
  );
}
