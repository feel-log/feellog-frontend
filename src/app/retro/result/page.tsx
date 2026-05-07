import { Suspense } from 'react';
import RetroResultContent from '@/widgets/retro/RetroResultContent';
import PageHeader from '@/shared/ui/PageHeader';

export default function RetroResultPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 flex-col">
          <PageHeader title="회고 결과" showBack={false} showClose closeHref="/retro" />
        </div>
      }
    >
      <RetroResultContent />
    </Suspense>
  );
}
