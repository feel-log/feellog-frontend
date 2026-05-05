'use client';

import Dropdown, { DropdownOption } from './Dropdown';

export type SortType = 'latest' | 'oldest' | 'expensive' | 'cheap';

interface SortButtonProps {
  sortType: SortType;
  onSortChange: (type: SortType) => void;
}

const sortOptions: DropdownOption<SortType>[] = [
  { value: 'latest', label: '최신순' },
  { value: 'oldest', label: '오래된순' },
  { value: 'expensive', label: '금액 높은순' },
  { value: 'cheap', label: '금액 낮은순' },
];

export default function SortButton({ sortType, onSortChange }: SortButtonProps) {
  return (
    <div className="relative flex justify-end">
      <Dropdown options={sortOptions} value={sortType} onChange={onSortChange} />
    </div>
  );
}
