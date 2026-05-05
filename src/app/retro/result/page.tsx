import { Suspense } from 'react';
import RetroResultContent from '@/widgets/retro/RetroResultContent';

export default function RetroResultPage() {
  return (
    <Suspense fallback={<div>로딩중...</div>}>
      <RetroResultContent />
    </Suspense>
  );
}
