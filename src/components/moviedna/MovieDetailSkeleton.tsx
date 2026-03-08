import { Skeleton } from "@/components/ui/skeleton";

export function MovieDetailSkeleton() {
  return (
    <div className="container px-3 sm:px-4 lg:px-8 space-y-4 sm:space-y-6 pb-6 sm:pb-10 pt-16 sm:pt-20">
      <section className="grid gap-3 sm:gap-5 grid-cols-[100px_1fr] sm:grid-cols-[160px_1fr] lg:grid-cols-[240px_1fr]">
        <div className="space-y-2">
          <Skeleton className="w-full aspect-[2/3] rounded-lg" />
          <Skeleton className="h-7 w-full rounded-md" />
        </div>
        <div className="space-y-3 sm:space-y-4">
          <div>
            <Skeleton className="h-3 w-16 mb-1" />
            <Skeleton className="h-6 sm:h-8 w-3/4 mb-1" />
            <Skeleton className="h-3 w-1/2 mb-2" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-5 sm:h-7 w-14 sm:w-20 rounded" />
            ))}
          </div>
          <div className="flex flex-wrap gap-1">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-5 w-16 rounded-full" />
            ))}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-12 sm:h-14 rounded-md" />
            ))}
          </div>
          <div className="grid gap-1.5 sm:gap-2 grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-9 sm:h-11 rounded-md" />
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-2">
        <Skeleton className="h-5 w-32" />
        <div className="flex gap-2 overflow-hidden">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="shrink-0 h-12 w-[140px] sm:w-[180px] rounded-md" />
          ))}
        </div>
      </section>
    </div>
  );
}
