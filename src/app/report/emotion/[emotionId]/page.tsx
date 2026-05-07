import { Suspense } from 'react';
import EmotionDetailContent from '@/widgets/report/EmotionDetailContent';
import PageHeader from '@/shared/ui/PageHeader';

interface PageProps {
  params: Promise<{ emotionId: string }>;
}

export default async function EmotionDetailPage({ params }: PageProps) {
  const { emotionId } = await params;
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 flex-col bg-white">
          <PageHeader title="감정별 지출 항목" />
        </div>
      }
    >
      <EmotionDetailContent emotionId={emotionId} />
    </Suspense>
  );
}
