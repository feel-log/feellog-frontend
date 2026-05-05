import { Suspense } from 'react';
import CategoryDetailContent from '@/widgets/report/CategoryDetailContent';

interface PageProps {
  params: Promise<{ categoryId: string }>;
}

export default async function CategoryDetailPage({ params }: PageProps) {
  const { categoryId } = await params;
  return (
    <Suspense fallback={<div>로딩중...</div>}>
      <CategoryDetailContent categoryId={categoryId} />
    </Suspense>
  );
}
