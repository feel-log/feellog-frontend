import { Suspense } from 'react';
import ReportContent from '@/widgets/report/ReportContent';

export default function ReportPage() {
  return (
    <Suspense fallback={<div>로딩중...</div>}>
      <ReportContent />
    </Suspense>
  );
}
