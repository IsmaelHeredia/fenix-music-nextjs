export function PlaylistGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-4 p-4">
          <div className="w-full aspect-square rounded-xl bg-white/5 animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 bg-white/10 rounded animate-pulse w-3/4" />
            <div className="h-3 bg-white/[0.06] rounded animate-pulse w-1/2" />
            <div className="pt-2.5 mt-1 space-y-1.5">
              <div className="h-2.5 bg-white/[0.06] rounded animate-pulse w-16" />
              <div className="h-2 bg-white/[0.06] rounded animate-pulse w-12" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}