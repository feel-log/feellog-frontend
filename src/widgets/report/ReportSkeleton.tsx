import Skeleton from '@/shared/ui/Skeleton';
import PageHeader from '@/shared/ui/PageHeader';

export default function ReportSkeleton() {
  return (
    <div className="flex flex-1 flex-col bg-white">
      <PageHeader title="리포트" showBack={false} />
      <div className="flex flex-col gap-6.25 px-4 pt-5 pb-30">
        <Skeleton className="h-32 w-full rounded-[12px]" />
        <Skeleton className="h-40 w-full rounded-[12px]" />
        <Skeleton className="h-90 w-full rounded-[12px]" />
        <Skeleton className="h-60 w-full rounded-[12px]" />
        <Skeleton className="h-80 w-full rounded-[12px]" />
      </div>
    </div>
  );
}
