'use client';

import { Suspense } from 'react';
import RecordContent from '@/widgets/record/RecordContent';

function RecordPageContent() {
  return <RecordContent />;
}

export default function RecordPage() {
  return (
    <Suspense fallback={<div>로딩중...</div>}>
      <RecordPageContent />
    </Suspense>
  );
}
