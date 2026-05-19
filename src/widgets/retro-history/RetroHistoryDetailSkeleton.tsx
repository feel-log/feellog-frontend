import Skeleton from '@/shared/ui/Skeleton';

export default function RetroHistoryDetailSkeleton() {
  return (
    <div className="flex flex-col gap-10 px-4 pt-5 pb-25">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-7 w-3/5" />
          <Skeleton className="h-7 w-4/5" />
        </div>
        <Skeleton className="h-[140px] w-full rounded-xl" />
      </div>

      <div className="flex w-full flex-col gap-3.75">
        <Skeleton className="h-6 w-2/5" />
        <Skeleton className="h-[100px] w-full rounded-xl" />
      </div>

      <div className="flex w-full flex-col gap-3.75">
        <Skeleton className="h-6 w-2/5" />
        <Skeleton className="h-[120px] w-full rounded-xl" />
      </div>
    </div>
  );
}
