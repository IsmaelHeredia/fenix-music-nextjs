const GRID_CLASSES = 'grid-cols-[2rem_1fr_2.5rem] sm:grid-cols-[2rem_1fr_2.5rem_5rem] md:grid-cols-[2rem_1fr_9rem_2.5rem_5rem]';

const SHIMMER = 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)';

function Bar({ className = '', style, strong = false, delay = 0 }: { className?: string; style?: React.CSSProperties; strong?: boolean; delay?: number }) {
  return (
    <div
      className={`relative overflow-hidden animate-pulse ${className}`}
      style={{ background: strong ? 'var(--bg-active)' : 'var(--bg-hover)', ...style }}
    >
      <div
        className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite]"
        style={{ background: SHIMMER, animationDelay: `${delay}s` }}
      />
    </div>
  );
}

export function TrackSkeletonRow({ index }: { index: number }) {
  const titleWidths = [45, 62, 38, 55, 50, 42, 58, 35, 48, 56];
  const artistWidths = [22, 30, 26, 34, 20, 28, 24, 32, 27, 21];
  const pillWidths = [70, 90, 60, 80, 100, 64, 84, 72, 94, 66];

  const tw = titleWidths[index % titleWidths.length];
  const aw = artistWidths[index % artistWidths.length];
  const pw = pillWidths[index % pillWidths.length];
  const delay = (index % 6) * 0.12;

  return (
    <div
      className={`grid ${GRID_CLASSES} items-center gap-2 sm:gap-4 px-4 sm:px-6 py-3`}
      style={{ borderBottom: '1px solid var(--border-color)' }}
    >
      <Bar className="w-4 h-3 rounded mx-auto" delay={delay} />

      <div className="min-w-0 space-y-2">
        <Bar strong className="h-4 rounded" style={{ width: `${tw}%` }} delay={delay} />
        <Bar className="h-3 rounded" style={{ width: `${aw}%` }} delay={delay} />
      </div>

      <div className="hidden md:flex justify-center">
        <Bar strong className="h-8 rounded-lg" style={{ width: `${pw}px`, maxWidth: '100%' }} delay={delay} />
      </div>

      <div className="flex justify-center">
        <Bar className="w-6 h-6 rounded-full" delay={delay} />
      </div>

      <div className="hidden sm:flex justify-center">
        <Bar className="w-10 h-3 rounded" delay={delay} />
      </div>
    </div>
  );
}