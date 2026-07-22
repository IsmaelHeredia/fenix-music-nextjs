export function HeaderSkeleton() {
  return (
    <div className="mb-8 space-y-6">
      <div className="flex items-center gap-2">
        <div className="h-3 w-16 rounded bg-white/[0.06] animate-pulse" />
        <div className="h-3 w-2 rounded bg-white/[0.04] animate-pulse" />
        <div className="h-3 w-16 rounded bg-white/[0.06] animate-pulse" />
        <div className="h-3 w-2 rounded bg-white/[0.04] animate-pulse" />
        <div className="h-3 w-24 rounded bg-white/10 animate-pulse" />
      </div>
      <div className="flex items-end justify-between gap-5">
        <div className="flex items-end gap-5">
          <div className="w-[88px] h-[88px] rounded-2xl bg-white/8 animate-pulse shrink-0" />
          <div className="space-y-2.5 pb-1">
            <div className="h-3 w-28 rounded bg-white/[0.06] animate-pulse" />
            <div className="h-7 w-52 rounded bg-white/10 animate-pulse" />
            <div className="h-3 w-36 rounded bg-white/[0.06] animate-pulse" />
          </div>
        </div>
        <div className="h-11 w-56 rounded-xl bg-white/5 border border-white/10 animate-pulse" />
      </div>
    </div>
  );
}