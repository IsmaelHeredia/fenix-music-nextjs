export function TrackSkeletonRow({ index }: { index: number }) {
  const widths = [45, 62, 38, 55, 50, 42, 58, 35, 48, 56];
  const w = widths[index % widths.length];
  return (
    <div className="flex items-center gap-4 px-6 py-4 border-b border-white/5 last:border-0">
      <div className="w-5 h-3 rounded bg-white/10 animate-pulse shrink-0" />
      <div className="flex-1 space-y-2 min-w-0">
        <div className="h-3.5 rounded bg-white/10 animate-pulse" style={{ width: `${w}%` }} />
        <div className="h-3 rounded bg-white/[0.06] animate-pulse w-28" />
      </div>
      <div className="w-20 h-7 rounded-lg bg-white/[0.06] animate-pulse hidden md:block shrink-0" />
      <div className="w-6 h-6 rounded-full bg-white/[0.06] animate-pulse shrink-0" />
      <div className="w-12 h-3 rounded bg-white/[0.06] animate-pulse shrink-0" />
    </div>
  );
}