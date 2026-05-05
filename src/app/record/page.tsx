'use client';

import dynamic from 'next/dynamic';
import FullScreenLoader from '@/shared/ui/FullScreenLoader';
import { useIsMounted } from '@/shared/hooks';
import { AuthGuard } from '@/shared/ui/guard/AuthGuard';

const RecordContent = dynamic(() => import('@/widgets/record/RecordContent'), {
  loading: () => (
    <div className="flex flex-col gap-4 p-4">
      <div className="h-12 bg-gray-200 rounded animate-pulse" />
      <div className="h-40 bg-gray-200 rounded animate-pulse" />
      <div className="h-32 bg-gray-200 rounded animate-pulse" />
    </div>
  ),
});

export default function RecordPage() {
  const isMounted = useIsMounted();

  return (
    <AuthGuard>
      <FullScreenLoader isLoading={!isMounted} />
      <div className={!isMounted ? 'pointer-events-none' : ''}>
        <RecordContent />
      </div>
    </AuthGuard>
  );
}
