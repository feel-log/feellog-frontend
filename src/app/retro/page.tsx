import { Suspense } from 'react';
import RetroContent from '@/widgets/retro/RetroContent';

export default function RetroPage() {
  return (
    <Suspense fallback={<div>로딩중...</div>}>
      <RetroContent />
    </Suspense>
  );
}
