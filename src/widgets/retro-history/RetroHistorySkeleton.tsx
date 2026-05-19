import PageHeader from '@/shared/ui/PageHeader';
import Skeleton from '@/shared/ui/Skeleton';

export default function RetroHistorySkeleton() {
  return (
    <div className="flex flex-1 flex-col">
      <PageHeader title="회고록" />
      <div className="px-4 pt-4 pb-3">
        <Skeleton className="h-7 w-20 rounded-[6px]" />
      </div>
      <div className="flex flex-1 flex-col px-4 pb-6">
        <Skeleton className="w-full flex-1 rounded-[12px]" />
      </div>
    </div>
  );
}
