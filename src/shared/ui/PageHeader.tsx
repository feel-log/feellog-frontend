'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface PageHeaderProps {
  title: string;
  onBack?: () => void;
}

export default function PageHeader({ title, onBack }: PageHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <div className="relative flex items-center justify-between px-6 py-4">
      <button
        onClick={handleBack}
        className="cursor-pointer text-gray-700 hover:text-black"
      >
        <Image
          src={'/svg/icon_arrow_right.svg'}
          alt="back"
          width={24}
          height={24}
          className="rotate-180"
        />
      </button>
      <h1 className="absolute left-1/2 -translate-x-1/2 text-lg font-bold">{title}</h1>
    </div>
  );
}
