import { Bar } from '@/components/skeletons/Bar';

const GRID_CLASSES = 'grid-cols-[2rem_1fr_2.5rem] sm:grid-cols-[2rem_1fr_2.5rem_5rem]';

const titleWidths = [48, 65, 40, 58, 52, 44, 62, 36, 50, 60];
const artistWidths = [22, 30, 26, 34, 20, 28, 24, 32, 27, 21];

export function TrackSkeletonRow({ index }: { index: number }) {
  const tw = titleWidths[index % titleWidths.length];
  const aw = artistWidths[index % artistWidths.length];
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

      <div className="flex justify-center">
        <Bar className="w-6 h-6 rounded-full" delay={delay} />
      </div>

      <div className="hidden sm:flex justify-center">
        <Bar className="w-10 h-3 rounded" delay={delay} />
      </div>
    </div>
  );
}