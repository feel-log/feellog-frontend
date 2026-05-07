'use client';

import ExpenseItemCard from './ExpenseItemCard';

interface Emotion {
  emoji: string;
  label: string;
}

interface ExpenseItem {
  expenseId: number;
  name: string;
  amount: number;
  emotions: Emotion[];
  tag: string[];
  memo?: string;
  paymentMethod: string;
}

interface ExpenseListProps {
  expenses: ExpenseItem[];
  selectedDate: string;
  swipedId: number | null;
  onSwipe: (id: number | null) => void;
  onDelete: (id: number) => void;
}

export default function ExpenseList({
  expenses,
  selectedDate,
  swipedId,
  onSwipe,
  onDelete,
}: ExpenseListProps) {
  return (
    <div className="flex flex-col gap-5">
      {expenses.map((expense) => (
        <ExpenseItemCard
          key={expense.expenseId}
          expenseId={expense.expenseId}
          name={expense.name}
          amount={expense.amount}
          emotions={expense.emotions}
          tag={expense.tag}
          memo={expense.memo}
          paymentMethod={expense.paymentMethod}
          selectedDate={selectedDate}
          swipedId={swipedId}
          onSwipe={onSwipe}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
