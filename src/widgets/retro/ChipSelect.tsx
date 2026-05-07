'use client';

interface ChipSelectProps {
  options: string[];
  selected: string | null;
  onChange: (selected: string | null) => void;
}

export default function ChipSelect({
  options,
  selected,
  onChange,
}: ChipSelectProps) {
  const handleClick = (option: string) => {
    onChange(selected === option ? null : option);
  };

  return (
    <div className="mx-auto grid w-fit grid-cols-4 gap-1.5">
      {options.map((option) => {
        const isSelected = selected === option;
        return (
          <button
            key={option}
            onClick={() => handleClick(option)}
            className={`flex h-8 w-21 items-center justify-center rounded-full border text-[14px] font-medium leading-normal tracking-[-0.35px] ${
              isSelected
                ? 'border-[#13278A] bg-[#ECF2FB] text-[#13278A]'
                : 'border-[#E5E5E5] bg-white text-[#27282C]'
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
