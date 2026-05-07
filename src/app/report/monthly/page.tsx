import { Suspense } from 'react';
import MonthlyExpenseContent from '@/widgets/report/MonthlyExpenseContent';
import PageHeader from '@/shared/ui/PageHeader';

export default function MonthlyExpensePage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 flex-col bg-white">
          <PageHeader title="이번 달 지출" />
        </div>
      }
    >
      <MonthlyExpenseContent />
    </Suspense>
  );
}
