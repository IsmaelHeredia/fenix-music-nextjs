function SkeletonRow({ wide = false }: { wide?: boolean }) {
  return (
    <div className="flex items-center gap-4 px-5 py-4" style={{ borderBottom: '1px solid var(--border-color)' }}>
      <div className="w-5 h-3 rounded animate-pulse shrink-0" style={{ background: 'var(--bg-hover)' }} />
      <div className={`h-3.5 rounded animate-pulse ${wide ? 'w-48' : 'w-32'}`} style={{ background: 'var(--bg-hover)' }} />
      <div className="flex-1" />
      <div className="w-20 h-3 rounded animate-pulse" style={{ background: 'var(--bg-card)' }} />
      <div className="w-14 h-3 rounded animate-pulse" style={{ background: 'var(--bg-card)' }} />
    </div>
  );
}

export function MyListsSkeleton() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="h-4 w-24 rounded animate-pulse" style={{ background: 'var(--bg-hover)' }} />
        <div className="h-8 w-28 rounded-lg animate-pulse" style={{ background: 'var(--bg-hover)' }} />
      </div>
      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border-color)' }}>
        {[60, 44, 52, 38, 56].map((w, i) => <SkeletonRow key={i} wide={w > 50} />)}
      </div>
    </div>
  );
}

export function LibrarySkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-4 w-24 rounded animate-pulse" style={{ background: 'var(--bg-hover)' }} />
      <div className="h-11 rounded-xl animate-pulse" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)' }} />
      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border-color)' }}>
        {[50, 70, 40, 60, 45, 65, 55].map((w, i) => <SkeletonRow key={i} wide={w > 55} />)}
      </div>
    </div>
  );
}

export function EditorSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-4 w-16 rounded animate-pulse" style={{ background: 'var(--bg-hover)' }} />
      <div className="h-11 rounded-xl animate-pulse" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)' }} />
      <div className="h-16 rounded-xl animate-pulse" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }} />
      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border-color)' }}>
        {[55, 42, 60, 48, 50].map((w, i) => <SkeletonRow key={i} wide={w > 50} />)}
      </div>
      <div className="h-12 rounded-xl animate-pulse" style={{ background: 'var(--bg-hover)' }} />
    </div>
  );
}

export function TrackSkeletonRow({ index }: { index: number }) {
  const widths = [48, 65, 40, 58, 52, 44, 62, 36, 50, 60];
  const w = widths[index % widths.length];
  return (
    <div className="flex items-center gap-4 px-6 py-4 border-b border-white/5 last:border-0">
      <div className="w-5 h-3 rounded bg-white/10 animate-pulse shrink-0" />
      <div className="flex-1 space-y-2 min-w-0">
        <div className="h-3.5 rounded bg-white/10 animate-pulse" style={{ width: `${w}%` }} />
        <div className="h-3 rounded bg-white/[0.06] animate-pulse w-28" />
      </div>
      <div className="w-6 h-6 rounded-full bg-white/[0.06] animate-pulse shrink-0" />
      <div className="w-10 h-3 rounded bg-white/[0.06] animate-pulse shrink-0" />
    </div>
  );
}

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