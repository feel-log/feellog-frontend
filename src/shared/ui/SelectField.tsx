'use client';

import Image from 'next/image';
import { cn } from '@/shared/lib/utils';

interface SelectFieldProps {
  label: string;
  value: string;
  placeholder: string;
  onClick: () => void;
}

export default function SelectField({
  label,
  value,
  placeholder,
  onClick,
}: SelectFieldProps) {
  return (
    <div className="mb-8">
      <h3 className="mb-2 text-[18px] font-bold text-gray-600">{label}</h3>
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between py-3 text-left hover:border-gray-300 cursor-pointer"
      >
        <span
          className={cn(
            'transition-colors',
            value ? 'text-[#13278A] font-semilight' : 'text-gray-400 font-semilight',
          )}
        >
          {value || placeholder}
        </span>
        <Image
          src="/svg/icon_arrow_right.svg"
          alt="select"
          width={20}
          height={20}
        />
      </button>
    </div>
  );
}
