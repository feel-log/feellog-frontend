import { Suspense } from 'react';
import EmotionDetailContent from '@/widgets/report/EmotionDetailContent';

interface PageProps {
  params: Promise<{ emotionId: string }>;
}

export default async function EmotionDetailPage({ params }: PageProps) {
  const { emotionId } = await params;
  return (
    <Suspense fallback={<div>로딩중...</div>}>
      <EmotionDetailContent emotionId={emotionId} />
    </Suspense>
  );
}
