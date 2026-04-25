'use client';

import { Suspense } from 'react';
import ExportContent from '@/widgets/export/ExportContent';

function ExportPageContent() {
  return <ExportContent />;
}

export default function ExportPage() {
  return (
    <Suspense fallback={<div>로딩중...</div>}>
      <ExportPageContent />
    </Suspense>
  );
}
