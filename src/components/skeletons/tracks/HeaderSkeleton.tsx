const SHIMMER = 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)';

function Bar({ className = '', strong = false, style }: { className?: string; strong?: boolean; style?: React.CSSProperties }) {
  return (
    <div
      className={`relative overflow-hidden animate-pulse ${className}`}
      style={{ background: strong ? 'var(--bg-active)' : 'var(--bg-hover)', ...style }}
    >
      <div
        className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite]"
        style={{ background: SHIMMER }}
      />
    </div>
  );
}

export function HeaderSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-8">
      <div className="flex items-end gap-4 sm:gap-5">
        <Bar strong className="w-16 h-16 sm:w-[88px] sm:h-[88px] rounded-2xl shrink-0" />
        <div className="space-y-2.5 pb-1">
          <Bar className="h-3 w-32 rounded" />
          <Bar strong className="h-7 w-56 rounded" />
          <Bar className="h-3 w-44 rounded" />
        </div>
      </div>
      <div className="flex gap-3 pb-1">
        <div
          className="h-11 w-60 rounded-xl overflow-hidden relative"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
        >
          <Bar className="absolute inset-0 rounded-xl" />
        </div>
        <div
          className="h-11 w-36 rounded-xl overflow-hidden relative"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
        >
          <Bar className="absolute inset-0 rounded-xl" />
        </div>
      </div>
    </div>
  );
}