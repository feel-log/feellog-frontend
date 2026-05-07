'use client';

import Image from 'next/image';

interface SelectFieldProps {
  label: string;
  value: React.ReactNode;
  placeholder: string;
  onClick: () => void;
  isDefault?: boolean;
}

export default function SelectField({
  label,
  value,
  placeholder,
  onClick,
  isDefault = false,
}: SelectFieldProps) {
  const hasValue = typeof value === 'string' ? value !== '' : !!value;

  return (
    <div className="mb-6.25">
      <h3 className="mb-2 text-[17px] font-semibold tracking-[-0.025em] text-[#27282c]">{label}</h3>
      <button
        onClick={onClick}
        className="flex w-full cursor-pointer items-center justify-between text-left"
      >
        {hasValue ? (
          typeof value === 'string' ? (
            <span className={`text-[17px] font-semibold tracking-[-0.025em] transition-colors ${
              isDefault ? 'text-[#9fa4a8]' : 'text-[#13278a]'
            }`}>
              {value}
            </span>
          ) : (
            value
          )
        ) : (
          <span className="text-[16px] font-medium tracking-[-0.025em] text-[#9fa4a8] transition-colors">
            {placeholder}
          </span>
        )}
        <Image
          src="/svg/icon_arrow_right.svg"
          alt="select"
          width={30}
          height={30}
        />
      </button>
    </div>
  );
}
