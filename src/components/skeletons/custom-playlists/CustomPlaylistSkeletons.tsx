import { Bar } from '@/components/skeletons/Bar';

const GRID_CLASSES = 'grid-cols-[2rem_1fr] sm:grid-cols-[2rem_1fr_5rem] md:grid-cols-[2rem_1fr_10rem_5rem]';

const nameWidths = [55, 40, 62, 48, 36, 58, 44, 52];
const subWidths = [30, 22, 34, 26, 20, 32, 24, 28];
const pillWidths = [90, 120, 80, 110, 100, 130, 84, 104];

const cardBorder = { border: '1px solid var(--border-color)' };

function MyListRow({ index }: { index: number }) {
  const delay = (index % 6) * 0.12;
  return (
    <div
      className="flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3"
      style={{ borderBottom: '1px solid var(--border-color)' }}
    >
      <Bar className="w-6 h-3 rounded shrink-0 hidden sm:block" delay={delay} />
      <div className="flex-1 min-w-0">
        <Bar strong className="h-4 rounded" style={{ width: `${nameWidths[index % nameWidths.length]}%` }} delay={delay} />
      </div>
      <div className="hidden sm:flex items-center gap-3 shrink-0">
        <Bar className="h-3 w-24 rounded" delay={delay} />
        <Bar className="h-3 w-12 rounded" delay={delay} />
      </div>
      <Bar strong className="w-9 h-9 rounded-full shrink-0" delay={delay} />
      <Bar className="h-8 w-14 sm:w-16 rounded-lg shrink-0" delay={delay} />
      <Bar className="h-8 w-16 sm:w-20 rounded-lg shrink-0" delay={delay} />
    </div>
  );
}

function LibraryRow({ index }: { index: number }) {
  const delay = (index % 6) * 0.12;
  return (
    <div
      className="flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3"
      style={{ borderBottom: '1px solid var(--border-color)' }}
    >
      <Bar strong className="w-4 h-4 rounded shrink-0" delay={delay} />
      <div className="flex-1 min-w-0">
        <Bar strong className="h-4 rounded" style={{ width: `${nameWidths[index % nameWidths.length]}%` }} delay={delay} />
      </div>
      <div className="hidden sm:flex items-center gap-3 shrink-0">
        <Bar className="h-3 w-24 rounded" delay={delay} />
        <Bar className="h-3 w-12 rounded" delay={delay} />
      </div>
      <Bar className="w-8 h-8 rounded shrink-0" delay={delay} />
    </div>
  );
}

function EditorRow({ index }: { index: number }) {
  const delay = (index % 6) * 0.12;
  return (
    <div
      className="flex items-center gap-3 px-6 py-3"
      style={{ borderBottom: '1px solid var(--border-color)' }}
    >
      <Bar className="w-7 h-3 rounded shrink-0" delay={delay} />
      <div className="flex-1 min-w-0 space-y-2">
        <Bar strong className="h-4 rounded" style={{ width: `${nameWidths[index % nameWidths.length]}%` }} delay={delay} />
        <Bar className="h-3 rounded" style={{ width: `${subWidths[index % subWidths.length]}%` }} delay={delay} />
      </div>
      <Bar className="h-3 w-10 rounded shrink-0 hidden sm:block" delay={delay} />
      <Bar className="w-8 h-8 rounded-lg shrink-0" delay={delay} />
      <div className="hidden sm:flex gap-1 shrink-0">
        {[0, 1, 2, 3].map(i => (
          <Bar key={i} className="w-9 h-9 rounded-lg" delay={delay} />
        ))}
      </div>
    </div>
  );
}

export function MyListsSkeleton() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <Bar strong className="h-5 w-24 rounded" />
        <Bar strong className="h-10 w-32 rounded-lg" delay={0.1} />
      </div>
      <div className="rounded-2xl overflow-hidden" style={cardBorder}>
        {Array.from({ length: 8 }).map((_, i) => <MyListRow key={i} index={i} />)}
      </div>
    </div>
  );
}

export function LibrarySkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <Bar strong className="h-5 w-28 rounded" />
      </div>
      <div
        className="h-11 rounded-xl overflow-hidden relative"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
      >
        <Bar className="absolute inset-0 rounded-xl" delay={0.1} />
      </div>
      <div className="rounded-2xl overflow-hidden" style={cardBorder}>
        {Array.from({ length: 10 }).map((_, i) => <LibraryRow key={i} index={i} />)}
      </div>
    </div>
  );
}

export function EditorSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <Bar strong className="h-5 w-32 rounded" />
        <Bar className="h-8 w-36 rounded-lg" delay={0.1} />
      </div>

      <div className="space-y-2">
        <Bar className="h-3.5 w-32 rounded" />
        <div
          className="h-11 rounded-xl overflow-hidden relative"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
        >
          <Bar className="absolute inset-0 rounded-xl" delay={0.1} />
        </div>
      </div>

      <Bar strong className="h-4 w-64 max-w-full rounded" delay={0.15} />

      <div
        className="flex items-center gap-6 px-5 py-3 rounded-xl"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
      >
        <div className="space-y-2">
          <Bar className="h-3 w-16 rounded" />
          <Bar strong className="h-4 w-8 rounded" delay={0.1} />
        </div>
        <div className="w-px h-8" style={{ background: 'var(--border-color)' }} />
        <div className="space-y-2">
          <Bar className="h-3 w-24 rounded" delay={0.1} />
          <Bar strong className="h-4 w-16 rounded" delay={0.2} />
        </div>
      </div>

      <div className="space-y-2">
        <Bar className="h-3.5 w-20 rounded" />
        <div className="rounded-2xl overflow-hidden" style={cardBorder}>
          {Array.from({ length: 6 }).map((_, i) => <EditorRow key={i} index={i} />)}
        </div>
      </div>

      <div className="flex gap-3">
        <Bar className="flex-1 h-12 rounded-xl" />
        <Bar strong className="flex-1 h-12 rounded-xl" delay={0.1} />
      </div>
    </div>
  );
}

export function TrackSkeletonRow({ index }: { index: number }) {
  const delay = (index % 6) * 0.12;
  return (
    <div
      className={`grid ${GRID_CLASSES} items-center gap-2 sm:gap-4 px-4 sm:px-6 py-3`}
      style={{ borderBottom: '1px solid var(--border-color)' }}
    >
      <Bar className="w-4 h-3 rounded mx-auto" delay={delay} />

      <div className="min-w-0 space-y-2">
        <Bar strong className="h-4 rounded" style={{ width: `${nameWidths[index % nameWidths.length]}%` }} delay={delay} />
        <Bar className="h-3 rounded" style={{ width: `${subWidths[index % subWidths.length]}%` }} delay={delay} />
      </div>

      <div className="hidden md:flex justify-center min-w-0">
        <Bar strong className="h-8 rounded-lg" style={{ width: `${pillWidths[index % pillWidths.length]}px`, maxWidth: '100%' }} delay={delay} />
      </div>

      <div className="hidden sm:flex justify-center">
        <Bar className="w-10 h-3 rounded" delay={delay} />
      </div>
    </div>
  );
}

export function HeaderSkeleton() {
  return (
    <>
      <div className="flex items-center gap-2 mb-6">
        <Bar className="h-3.5 w-16 rounded" />
        <Bar className="h-3.5 w-2 rounded" />
        <Bar className="h-3.5 w-16 rounded" />
        <Bar className="h-3.5 w-2 rounded" />
        <Bar className="h-3.5 w-24 rounded" />
        <Bar className="h-3.5 w-2 rounded" />
        <Bar strong className="h-3.5 w-28 rounded" />
      </div>

      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-8">
        <div className="flex items-end gap-4 sm:gap-5">
          <Bar strong className="w-16 h-16 sm:w-[88px] sm:h-[88px] rounded-2xl shrink-0" />
          <div className="space-y-2.5 pb-1">
            <Bar className="h-3 w-32 rounded" />
            <Bar strong className="h-7 w-56 rounded" />
            <Bar className="h-3 w-40 rounded" />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pb-1 w-full lg:w-auto">
          <div
            className="h-11 w-44 rounded-xl overflow-hidden relative shrink-0"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
          >
            <Bar className="absolute inset-0 rounded-xl" />
          </div>
          <div
            className="h-11 w-56 rounded-xl overflow-hidden relative flex-1 min-w-[180px] sm:flex-none"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
          >
            <Bar className="absolute inset-0 rounded-xl" />
          </div>
        </div>
      </div>
    </>
  );
}

export function PlayerPageSkeleton() {
  return (
    <div className="px-4 sm:px-6 md:px-8 py-6 md:py-8">
      <HeaderSkeleton />
      <div className="rounded-2xl overflow-hidden" style={cardBorder}>
        <div
          className={`grid ${GRID_CLASSES} items-center gap-2 sm:gap-4 px-4 sm:px-6 py-3`}
          style={{
            borderBottom: '1px solid var(--border-color)',
            background: 'rgba(255,255,255,0.02)',
          }}
        >
          <span className="text-[15px] font-medium text-center" style={{ color: 'var(--text-muted)' }}>#</span>
          <span className="text-[15px] font-medium" style={{ color: 'var(--text-muted)' }}>Título</span>
          <span className="hidden md:flex text-[15px] font-medium justify-center" style={{ color: 'var(--text-muted)' }}>Playlist</span>
          <span className="hidden sm:block text-[15px] font-medium text-center" style={{ color: 'var(--text-muted)' }}>Duración</span>
        </div>
        {Array.from({ length: 10 }).map((_, i) => <TrackSkeletonRow key={i} index={i} />)}
      </div>
    </div>
  );
}