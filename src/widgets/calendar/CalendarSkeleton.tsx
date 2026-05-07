import Skeleton from '@/shared/ui/Skeleton';
import PageHeader from '@/shared/ui/PageHeader';

export default function CalendarSkeleton() {
  return (
    <div className="flex flex-1 flex-col">
      <PageHeader title="캘린더" backHref="/" />
      <div className="px-4 pt-5">
        <Skeleton className="h-24 w-full rounded-[12px]" />
      </div>
      <div className="flex flex-1 flex-col px-4 pt-3 pb-6">
        <Skeleton className="w-full flex-1 rounded-[12px]" />
      </div>
    </div>
  );
}
