export function HeaderSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-8">
      <div className="flex items-end gap-5">
        <div className="w-[88px] h-[88px] rounded-2xl bg-white/8 animate-pulse shrink-0" />
        <div className="space-y-2.5 pb-1">
          <div className="h-3 w-32 rounded bg-white/[0.06] animate-pulse" />
          <div className="h-7 w-56 rounded bg-white/10 animate-pulse" />
          <div className="h-3 w-44 rounded bg-white/[0.06] animate-pulse" />
        </div>
      </div>
      <div className="flex gap-3 pb-1">
        <div className="h-11 w-60 rounded-xl bg-white/5 border border-white/10 animate-pulse" />
        <div className="h-11 w-36 rounded-xl bg-white/5 border border-white/10 animate-pulse" />
      </div>
    </div>
  );
}