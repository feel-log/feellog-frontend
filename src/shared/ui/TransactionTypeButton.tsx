'use client';

import Dropdown, { DropdownOption } from './Dropdown';

export type TransactionType = 'income' | 'expense';

interface TransactionTypeButtonProps {
  type: TransactionType;
  onTypeChange: (type: TransactionType) => void;
}

const transactionOptions: DropdownOption<TransactionType>[] = [
  { value: 'income', label: '수입' },
  { value: 'expense', label: '지출' },
];

export default function TransactionTypeButton({ type, onTypeChange }: TransactionTypeButtonProps) {
  return (
    <div className="flex justify-end">
      <Dropdown options={transactionOptions} value={type} onChange={onTypeChange} />
    </div>
  );
}