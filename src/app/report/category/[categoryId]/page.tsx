import { Suspense } from 'react';
import CategoryDetailContent from '@/widgets/report/CategoryDetailContent';
import PageHeader from '@/shared/ui/PageHeader';

interface PageProps {
  params: Promise<{ categoryId: string }>;
}

export default async function CategoryDetailPage({ params }: PageProps) {
  const { categoryId } = await params;
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 flex-col bg-white">
          <PageHeader title="카테고리별 지출 항목" />
        </div>
      }
    >
      <CategoryDetailContent categoryId={categoryId} />
    </Suspense>
  );
}
