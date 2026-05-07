import Skeleton from '@/shared/ui/Skeleton';

export default function RetroSkeleton() {
  return (
    <div className="flex w-full flex-col gap-5">
      <Skeleton className="h-90 w-full rounded-[12px]" />
      <Skeleton className="h-21.25 w-full rounded-[12px]" />
    </div>
  );
}
