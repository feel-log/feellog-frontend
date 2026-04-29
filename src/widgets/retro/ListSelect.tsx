'use client';

interface ListSelectProps {
  options: string[];
  selected: string | null;
  onChange: (selected: string | null) => void;
}

export default function ListSelect({
  options,
  selected,
  onChange,
}: ListSelectProps) {
  return (
    <div className="flex flex-col gap-2.5 px-4">
      {options.map((option) => {
        const isSelected = selected === option;
        return (
          <button
            key={option}
            onClick={() => onChange(selected === option ? null : option)}
            className={`flex h-13 items-center rounded-[10px] border px-4.5 text-[16px] font-medium leading-normal tracking-[-0.4px] ${
              isSelected
                ? 'border-[#13278A] bg-[#ECF2FB] text-[#13278A]'
                : 'border-[#CACDD2] bg-white text-[#27282C]'
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
