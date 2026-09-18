export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-surface-container rounded ${className}`} />;
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col bg-surface-container-lowest border border-slate-border rounded-lg overflow-hidden">
      <Skeleton className="aspect-[3/4] rounded-none" />
      <div className="flex flex-col gap-2 p-3">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/4" />
        <Skeleton className="h-5 w-1/2 mt-1" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-space-md">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}