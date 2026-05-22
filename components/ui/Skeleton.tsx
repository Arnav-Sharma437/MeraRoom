import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn('skeleton-shimmer', className)} />;
}

export function RoomCardSkeleton({ list = false }: { list?: boolean }) {
  if (list) {
    return (
      <div className="hidden md:flex gap-4 bg-white dark:bg-[#111A11] rounded-2xl overflow-hidden border border-gray-100 dark:border-[#1F2E1F] p-3">
        <Skeleton className="w-56 h-40 rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-3 py-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-8 w-full max-w-xs" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="md:hidden flex gap-3 bg-white dark:bg-[#111A11] rounded-2xl p-3 border border-gray-100 dark:border-[#1F2E1F]">
        <Skeleton className="w-32 h-32 rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-2 py-1">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-6 w-1/3" />
        </div>
      </div>
      <div className="hidden md:block bg-white dark:bg-[#111A11] rounded-2xl overflow-hidden border border-gray-100 dark:border-[#1F2E1F]">
        <Skeleton className="h-48 w-full" />
        <div className="p-4 space-y-3">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-14 rounded-full" />
            <Skeleton className="h-6 w-14 rounded-full" />
          </div>
          <Skeleton className="h-10 w-full mt-2" />
        </div>
      </div>
    </>
  );
}

export default Skeleton;
