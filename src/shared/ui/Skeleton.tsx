import { cn } from '@/shared/lib/utils';

interface SkeletonProps {
  className?: string;
}

export default function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn('animate-pulse rounded bg-[#E5E5E5]', className)}
      aria-hidden
    />
  );
}
