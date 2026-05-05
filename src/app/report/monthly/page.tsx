import { Suspense } from 'react';
import MonthlyExpenseContent from '@/widgets/report/MonthlyExpenseContent';

export default function MonthlyExpensePage() {
  return (
    <Suspense fallback={<div>로딩중...</div>}>
      <MonthlyExpenseContent />
    </Suspense>
  );
}
