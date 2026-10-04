import { Bar } from '@/components/skeletons/Bar';

export function HeaderSkeleton() {
  return (
    <div className="mb-8 space-y-6">
      <div className="flex items-center gap-2">
        <Bar className="h-3 w-16 rounded" />
        <Bar className="h-3 w-2 rounded" />
        <Bar strong className="h-3 w-32 rounded" />
      </div>
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
        <div className="flex items-end gap-4 sm:gap-5">
          <Bar strong className="w-16 h-16 sm:w-[88px] sm:h-[88px] rounded-2xl shrink-0" />
          <div className="space-y-2.5 pb-1">
            <Bar className="h-3 w-28 rounded" />
            <Bar strong className="h-7 w-52 rounded" />
            <Bar className="h-3 w-36 rounded" />
          </div>
        </div>
        <div className="flex gap-3 pb-1">
          <div
            className="h-11 w-44 rounded-xl overflow-hidden relative"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
          >
            <Bar className="absolute inset-0 rounded-xl" />
          </div>
          <div
            className="h-11 w-56 rounded-xl overflow-hidden relative"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
          >
            <Bar className="absolute inset-0 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}