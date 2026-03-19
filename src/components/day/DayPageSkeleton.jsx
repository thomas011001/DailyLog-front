/** Skeleton loader shown while the day data is fetching. */

const Sk = ({ className = "" }) => (
  <div className={`animate-pulse rounded bg-muted ${className}`} />
);

export const DayPageSkeleton = () => (
  <div className="flex flex-col h-full">
    <div className="px-6 md:px-10 pt-8 md:pt-10 pb-8 border-b border-border">
      <Sk className="h-3 w-24 mb-4" />
      <Sk className="h-10 md:h-14 w-48 md:w-64 mb-2" />
      <Sk className="h-2 w-full mt-4 rounded-full" />
    </div>

    <div className="flex flex-col md:flex-row flex-1 md:divide-x divide-border overflow-hidden">
      {/* Tasks skeleton */}
      <div className="flex-1 px-6 md:px-10 py-6 md:py-8 flex flex-col gap-3 border-b md:border-b-0 border-border">
        <Sk className="h-3 w-20 mb-2" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3 py-2">
            <Sk className="h-5 w-5 shrink-0 rounded-full" />
            <Sk className="h-3 flex-1" />
            <Sk className="h-4 w-12 rounded-full" />
          </div>
        ))}
      </div>

      {/* Notes skeleton */}
      <div className="flex-1 px-6 md:px-10 py-6 md:py-8 flex flex-col gap-3">
        <Sk className="h-3 w-20 mb-2" />
        {[1, 2].map((i) => (
          <Sk key={i} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    </div>
  </div>
);
